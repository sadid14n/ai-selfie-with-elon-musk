import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://ai-selfie-with-elon-musk.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

app.post("/generate-selfie", async (req, res) => {
  try {
    const { userImageUrl } = req.body;

    const elonPoseUrl =
      "https://res.cloudinary.com/dplsiqv75/image/upload/v1750843076/y9vfqvr4foce6u9kgugk.webp";

    const createResponse = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version:
          "35324a7df2397e6e57dfd8f4f9d2910425f5123109c8c3ed035e769aeff9ff3c",
        input: {
          face_image_path: userImageUrl,
          prompt:
            "Merge this image with one realistic image of Elon Musk to create a hyper-realistic selfie where Elon Musk is standing next to the person in the image as if they are taking a selfie together outdoors. Make sure it looks like both are looking at the camera naturally with clear faces, good lighting, and no extra people.",
          // "Add one image of elon musk to this image to look like elon musk clicking photo with the image person at outdoor in a hyper realistic way",
          // negative_prompt:
          //   "duplicate faces, not two elon musk image, double faces, desturctured faces, multiple person, blurry, crowd, bad quality",
          negative_prompt:
            "multiple elon musk, duplicate faces, multiple people, distorted face, low quality, blurry, crowd, unrealistic background, AI artifacts, weird hand, double person, incorrect shadows, strange eyes, photo mismatch, cartoon style",
          identitynet_strength_ratio: 1.0,
          guidance_scale: 9,
          num_inference_steps: 35,
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const prediction = createResponse.data;

    // ✅ POLLING LOOP
    let result = null;
    let status = prediction.status;
    const predictionUrl = prediction.urls.get;

    while (
      status !== "succeeded" &&
      status !== "failed" &&
      status !== "canceled"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
      const getResponse = await axios.get(predictionUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      status = getResponse.data.status;

      if (status === "succeeded") {
        result = getResponse.data.output;
      }
    }

    if (result) {
      res.status(200).json({ generatedImageUrl: result });
    } else {
      res
        .status(500)
        .json({ error: "Image generation failed or was cancelled." });
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate selfie" });
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/delete-user-image", async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) return res.status(400).json({ error: "publicId required" });

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);

    if (result.result !== "ok") {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
