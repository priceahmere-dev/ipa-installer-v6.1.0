const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const plist = require('plist');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route for uploading IPA
app.post('/upload', upload.single('ipa'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const ipaPath = req.file.path;
  const ipaName = req.file.filename;

  try {
    // Extract Info.plist from IPA
    const zip = new AdmZip(ipaPath);
    const zipEntries = zip.getEntries();

    let infoPlistEntry = null;
    for (let entry of zipEntries) {
      if (entry.entryName.includes('Info.plist')) {
        infoPlistEntry = entry;
        break;
      }
    }

    if (!infoPlistEntry) {
      fs.unlinkSync(ipaPath); // Clean up
      return res.status(400).json({ success: false, message: 'Invalid IPA file: Info.plist not found.' });
    }

    const infoPlistData = plist.parse(infoPlistEntry.getData().toString('utf8'));
    const bundleId = infoPlistData.CFBundleIdentifier;
    const bundleVersion = infoPlistData.CFBundleVersion;
    const displayName = infoPlistData.CFBundleDisplayName || infoPlistData.CFBundleName;

    if (!bundleId || !bundleVersion || !displayName) {
      fs.unlinkSync(ipaPath);
      return res.status(400).json({ success: false, message: 'Invalid IPA file: Missing required app information.' });
    }

    // Generate manifest.plist
    const manifest = {
      items: [
        {
          assets: [
            {
              kind: 'software-package',
              url: `${req.protocol}://${req.get('host')}/uploads/${ipaName}`
            }
          ],
          metadata: {
            'bundle-identifier': bundleId,
            'bundle-version': bundleVersion,
            kind: 'software',
            title: displayName
          }
        }
      ]
    };

    const manifestPath = path.join('uploads', ipaName.replace('.ipa', '.plist'));
    fs.writeFileSync(manifestPath, plist.build(manifest));

    // Respond with installation URL
    const host = req.protocol + '://' + req.get('host');
    const installUrl = `itms-services://?action=download-manifest&url=${host}/uploads/${ipaName.replace('.ipa', '.plist')}`;
    res.json({
      success: true,
      installUrl: installUrl,
      appName: displayName,
      bundleId: bundleId,
      version: bundleVersion
    });

  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Error processing IPA file. Please ensure it\'s a valid IPA file.' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});