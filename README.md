# 🤖 AI Selfie Generator with Elon Musk

Generate fun and realistic AI selfies with Elon Musk by uploading your own photo! This project uses advanced AI models via the Replicate API and Cloudinary to create high-quality, personalized selfies in real time.

## ✨ Features

- 📤 Upload your own image
- ☁️ Cloud storage with Cloudinary
- 🤖 AI processing via Replicate API
- 🖼️ Real-time selfie generation
- 📥 One-click download
- 🔗 Native share functionality
- 🧹 Automatic cloud cleanup

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express
- **APIs/Services**: Replicate API, Cloudinary

## 📦 Project Structure

```
ai-selfie-with-elon/
├── frontend/    # React application
├── backend/     # Express server
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sadid14n/ai-selfie-with-elon-musk.git
cd ai-selfie-elon
```

### 2. Install dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### 3. Configure environment variables

**Frontend (.env):**

```
VITE_SERVER_DOMAIN=http://localhost:3000
VITE_CLOUDINARY_UPLOAD_URL="Your Cloudinary Upload URL"
VITE_CLOUDINARY_FOLDER="Your Cloudinary Folder Name"
VITE_CLOUDINARY_UPLOAD_PRESET="Your Cloudinary Upload Preset"
VITE_CLOUDINARY_API_KEY="Your Cloudinary API Key"
VITE_CLOUDINARY_API_SECRET="Your Cloudinary API Secret"
```

> Note: Make sure your Cloudinary upload preset is created and set to unsigned

**Backend (.env):**

```
REPLICATE_API_TOKEN="Your Replicate API Token"
CLOUDINARY_API_KEY="Your Cloudinary API Key"
CLOUDINARY_API_SECRET="Your Cloudinary API Secret"
CLOUDINARY_CLOUD_NAME="Your Cloudinary Cloud Name"
```

### 4. Run the application

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend:**

```bash
cd backend
npm run dev
```

## 🧠 Future Improvements

- [ ] Fix extra faces in output
- [ ] Improve identity preservation
- [ ] Add user authentication & image gallery
- [ ] Implement progress bar & better error feedback

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Replicate](https://replicate.com/) for AI model
- [Cloudinary](https://cloudinary.com/) for image storage
