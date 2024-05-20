import dotenv from "dotenv";
import connectDB from "./db/config.js";
import { v2 as cloudinary } from "cloudinary";
import { server } from "./socket/socket.js";

dotenv.config({ path: "./.env.local" });

const PORT = process.env.PORT || 8000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed", err);
  });
