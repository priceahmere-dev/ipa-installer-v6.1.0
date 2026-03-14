# IPA Installer v6.1.0

A modern, web-based tool for uploading IPA files and generating Over-The-Air (OTA) installation links for iOS devices.

## ✨ Features

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Automatic Metadata Extraction**: Extracts app name, bundle ID, and version from IPA files
- **OTA Installation**: Generates proper manifest.plist for iOS OTA installation
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Loading indicators and error handling
- **Secure Processing**: Validates IPA files and cleans up temporary files

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/priceahmere-dev/ipa-installer-v6.1.0.git
cd ipa-installer-v6.1.0
```

### Local Setup Script

Run the automated setup script:
```bash
./deploy.sh
```

This will install dependencies and prepare the application for deployment.

4. Open your browser and navigate to `http://localhost:3000`

## 🌐 Deployment

### Option 1: Render (Recommended)

1. Fork this repository to your GitHub account
2. Sign up for [Render](https://render.com)
3. Connect your GitHub account
4. Click "New +" and select "Web Service"
5. Choose your forked repository
6. Configure the service:
   - **Name**: ipa-installer
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. Click "Create Web Service"
8. Your app will be deployed and accessible at the provided URL

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Follow the prompts to link your GitHub repo
4. Your app will be deployed automatically

### Option 3: Docker

1. Build the Docker image:
```bash
docker build -t ipa-installer .
```

2. Run the container:
```bash
docker run -p 3000:3000 ipa-installer
```

3. Deploy to any container hosting service (Docker Hub, Google Cloud Run, AWS ECS, etc.)

### Option 4: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`

## 📱 Usage

1. **Upload IPA**: Drag and drop or click to select an IPA file
2. **Process**: The server extracts app information automatically
3. **Install**: Copy the generated installation link
4. **Install on Device**: Open the link on your iOS device and follow the prompts

## 🔧 Development

For development with auto-restart:
```bash
npm run dev
```

## � Troubleshooting

### Network Error Issues
If you encounter network errors:

1. **Check Server Status**: Visit `http://localhost:3000/status` to verify the server is running
2. **Run Tests**: Execute `./test.sh` to diagnose issues
3. **Check Console**: Look for error messages in the server console
4. **Dependencies**: Ensure all npm packages are installed with `npm install`

### Common Issues

- **"Network Error"**: Server not running or CORS issues
- **"Invalid IPA file"**: File is corrupted or not properly signed
- **"No file uploaded"**: File selection failed
- **Installation fails on iOS**: App not properly signed or device restrictions

### Testing the Server

Run the test script:
```bash
./test.sh
```

This will check:
- Server availability
- Status endpoint
- Uploads directory
- Basic functionality

## ⚠️ Important Limitations

**Automatic Installation**: Due to iOS security restrictions, this tool **cannot** automatically install apps on iOS devices. Instead, it generates OTA (Over-The-Air) installation links that users must open on their iOS devices.

**Requirements for Installation**:
- iOS device (iPhone/iPad)
- Properly signed IPA file
- Device must be enrolled in developer program or enterprise MDM
- Trust the developer certificate if prompted

**What This Tool Does**:
- ✅ Uploads IPA files
- ✅ Extracts app information
- ✅ Generates installation manifests
- ✅ Creates QR codes for easy mobile access
- ✅ Provides OTA installation links

**What This Tool Cannot Do**:
- ❌ Automatically install apps on iOS devices
- ❌ Bypass iOS security restrictions
- ❌ Install unsigned or improperly signed apps

## 🏗️ Architecture

- **Frontend**: Vanilla HTML/CSS/JavaScript with modern UI
- **Backend**: Node.js with Express.js
- **File Processing**: Uses `adm-zip` for IPA extraction and `plist` for parsing
- **Upload Handling**: `multer` for multipart form data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with Express.js, Multer, and other open-source libraries
- Inspired by iOS OTA installation mechanisms