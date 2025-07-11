import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 Export the sanitizeFileName function
export const sanitizeFileName = (fileName) => {
  return fileName
    .normalize('NFD') // Normalize special characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[<>:"/\\|?*]/g, '_') // Replace illegal characters
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};


// Define the root uploads directory path
const UPLOADS_ROOT = path.join(__dirname, '..', 'uploadss');

// Ensure the root uploads directory exists
if (!fs.existsSync(UPLOADS_ROOT)) {
  fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // Get username from request body or user object
      // Meilleur : récupère depuis le body
const rawUsername = req.body.username || 'general';


console.log('req.body:', req.body);
console.log('Selected username:', rawUsername);

      if (!rawUsername) {
  return cb(new Error("Username is required for document upload"), null);
}

      console.log('Uploading file for user:', rawUsername);

      
      if (!rawUsername) {
        throw new Error("No username provided");
      }
      
      // Sanitize and ensure we have a valid directory name
      const username = sanitizeFileName(rawUsername.trim());
      
      // Create path to user directory
      const userDir = path.join(UPLOADS_ROOT, username);
      
      // Create directory if it doesn't exist (including parent directories)
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
        console.log(`Created client directory: ${userDir}`);
      }
      
      cb(null, userDir);
    } catch (err) {
      console.error('Error creating client directory:', err);
      // Fallback to general directory if there's an error
      const generalDir = path.join(UPLOADS_ROOT, 'general');
      if (!fs.existsSync(generalDir)) {
        fs.mkdirSync(generalDir, { recursive: true });
      }
      cb(null, generalDir);
    }
  },
  filename: function (req, file, cb) {
  const ext = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, ext);
  
  // Normalize and sanitize the filename
  const normalized = file.originalname.normalize('NFC');
  const sanitizedTitle = sanitizeFileName(baseName);
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  cb(null, `${sanitizedTitle}-${uniqueSuffix}${ext}`);
}

});

const uploadss = multer({ storage });

export default uploadss;