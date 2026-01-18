import multer from "multer";
import path from "path";

// For Vercel deployment, use memory storage
// Note: You should integrate with cloud storage (S3, Cloudinary, etc.) for production
const storage = multer.memoryStorage();

// If you want to use disk storage locally, uncomment below:
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
