/*import multer from "multer";
import path from "path";
import fs from "fs";

// Chemin de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = path.join(process.cwd(), 'public', 'uploading', 'documents');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    cb(null, baseDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf',];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non autorisé"), false);
  }
};

const uploading = multer({ storage, fileFilter });

export default uploading;*/
