const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const plist = require('plist');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'IPA Installer Server Running',
    version: '6.1.0',
    endpoints: {
      upload: 'POST /upload',
      health: 'GET /health',
      status: 'GET /status'
    },
    uploads: fs.existsSync('uploads') ? 'Available' : 'Not found'
  });
});

// Route for uploading IPA
app.post('/upload', upload.single('ipa'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    console.log('Processing file:', req.file.originalname);

    const ipaPath = req.file.path;
    const ipaName = req.file.filename;

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

    // Generate installation URL
    const host = req.protocol + '://' + req.get('host');
    const installUrl = `itms-services://?action=download-manifest&url=${host}/uploads/${ipaName.replace('.ipa', '.plist')}`;

    // Generate QR code for the installation URL
    const qrCodeDataURL = await QRCode.toDataURL(installUrl);

    console.log('Successfully processed IPA:', displayName);

    res.json({
      success: true,
      installUrl: installUrl,
      qrCode: qrCodeDataURL,
      appName: displayName,
      bundleId: bundleId,
      version: bundleVersion
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Error processing IPA file. Please ensure it\'s a valid IPA file.' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`🚀 IPA Installer Server v6.1.0 running on http://localhost:${PORT}`);
  console.log(`📱 Web interface: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});