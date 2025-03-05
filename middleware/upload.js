import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Storage engine for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "movie_posters", // ✅ Upload images to "movie_posters" folder
        format: async () => "jpg", // ✅ Convert all images to JPG
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`
    }
});

// ✅ File upload filter (Restrict file types)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG and PNG images are allowed!"), false);
    }
};

// ✅ Set up Multer with file size limit (2MB)
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 2MB file size limit
});

// ✅ Export **upload instance** (NOT middleware function)
export default upload;
