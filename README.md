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

## 🛠️ How It Works

1. **File Upload**: IPA files are uploaded via HTTP POST
2. **Extraction**: The server unzips the IPA and parses `Info.plist`
3. **Manifest Generation**: Creates a `manifest.plist` with app metadata
4. **OTA Link**: Generates an `itms-services://` URL for iOS installation

## ⚠️ Important Notes

- **Security**: This tool is intended for development and testing purposes
- **Signing**: IPA files must be properly signed for installation
- **Enterprise**: For enterprise distribution, devices must be enrolled in MDM
- **HTTPS**: For production deployment, use HTTPS to serve the files
- **Storage**: Uploaded files are stored temporarily; consider cleanup for production

## 📋 Requirements for IPA Files

- Must be a valid iOS app bundle (.ipa)
- Properly signed with a valid certificate
- Contains `Info.plist` with required fields:
  - `CFBundleIdentifier`
  - `CFBundleVersion`
  - `CFBundleDisplayName` or `CFBundleName`

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