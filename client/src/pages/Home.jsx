import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER;

  // Default preview image URL - replace with your actual default image
  const defaultPreviewImage =
    "https://res.cloudinary.com/dplsiqv75/image/upload/v1750937459/%22AI%20Elon%20Musk%22/jygce7jionelxdk4rdqg.jpg";

  // Background image URL - replace with your actual background image
  const backgroundImage =
    "https://res.cloudinary.com/dplsiqv75/image/upload/v1750942818/mxsmxvmj5oubowymclfe.avif";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setSelectedFile(file);

    // Simulate a short delay to show the uploading state
    // In a real app, this would be replaced by the actual upload time
    setTimeout(() => {
      setUploading(false);
    }, 1500);
  };

  const handleUploadAndGenerate = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setGeneratedImage(null);

    try {
      // Step 1: Upload user image to Cloudinary
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", CLOUDINARY_FOLDER);

      const cloudRes = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      const uploadedImageUrl = cloudRes.data.secure_url;
      const publicId = cloudRes.data.public_id;

      // Step 2: Send the image URL to backend to generate selfie
      const res = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/generate-selfie",
        { userImageUrl: uploadedImageUrl }
      );

      // Step 3: Upload the generated image to Cloudinary for permanent storage
      // First, we need to fetch the image as a blob
      const generatedImageResponse = await fetch(res.data.generatedImageUrl);
      const generatedImageBlob = await generatedImageResponse.blob();

      // Create a new FormData for the generated image
      const generatedFormData = new FormData();
      generatedFormData.append("file", generatedImageBlob);
      generatedFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      generatedFormData.append("folder", CLOUDINARY_FOLDER + "/generated");

      // Upload the generated image to Cloudinary
      const generatedCloudRes = await axios.post(
        CLOUDINARY_UPLOAD_URL,
        generatedFormData
      );

      // Store the permanent Cloudinary URL
      setGeneratedImage(generatedCloudRes.data.secure_url);

      // Step 4: Delete uploaded user image from Cloudinary (original image)
      await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-user-image",
        { publicId }
      );
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      // Show loading state if needed
      setLoading(true);

      // Fetch the image as a blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "ai_selfie_with_elon.jpg";

      // Append to the body (required for Firefox)
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      // Hide loading state if needed
      setLoading(false);
    }
  };

  const shareToTwitter = () => {
    if (!generatedImage) return;
    const text = "Check out my AI selfie with Elon Musk!";
    const url = encodeURIComponent(generatedImage);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  const shareToInstagram = () => {
    alert(
      "To share on Instagram, please download the image and upload it to your Instagram app."
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(127,29,29,0.7), rgba(0,0,0,0.8)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Turn Any Photo into
            <br />a Selfie with Elon Musk
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            – Powered by AI!
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
            Upload any photo of yourself and instantly get a realistic selfie
            with your favorite celebrity in seconds.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-md mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8 ">
          <div className="flex items-center justify-center mb-6">
            {selectedFile ? (
              <div className="relative w-32 h-32">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={defaultPreviewImage}
                  alt="Default Preview"
                  className="w-32 h-32 object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex justify-center mb-6">
            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handleUploadAndGenerate}
            disabled={loading || uploading || !selectedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </div>
            ) : uploading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </div>
            ) : (
              "Try It Now"
            )}
          </button>
        </div>

        {/* Result Section */}
        {generatedImage && (
          <div className="max-w-md mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-bold mb-4 text-center">
              Your AI Selfie with Elon
            </h2>
            <img
              src={generatedImage}
              alt="Generated Selfie"
              className="w-full rounded-lg mb-4"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={downloadImage}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "My AI Selfie with Elon",
                      text: "Check out my AI-generated selfie with Elon Musk!",
                      url: generatedImage,
                    });
                  } else {
                    alert("Web Share API not supported on this browser");
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={shareToTwitter}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
              <button
                onClick={shareToInstagram}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Share on Instagram
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-300 text-sm">
              Generate high-quality selfies in seconds with our advanced AI
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">High Quality</h3>
            <p className="text-gray-300 text-sm">
              Professional-grade results with realistic lighting and composition
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-300 text-sm">
              Your photos are processed securely and deleted after generation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
