import express from 'express';
import Dossier from '../models/dossierModel.js';
import DossierModification from '../models/dossierModificationModel.js';
import userAuth from '../middleware/userAuth.js';
import {
  choisirDemarche,
  remplirQuestionnaire,
  getAllDossiers,
  getDossiersByStatut,
  getAllProject,
  updateDossierStatus,
  getDossierCreationById ,
  updateModificationStatus ,
  updateFermetureStatus,
  sendStatusEmail ,
 // ajouterPiecesDossier ,
  getUnpaidDossier,
  updateStatut ,
  updateDossier,
} from '../controllers/dossierController.js';
import upload from '../middleware/multerConfig.js'
import { uploadDocument  } from '../controllers/uploadController.js';
import { addDocumentToDossier } from '../controllers/dossierController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { sanitizeFileName } from '../middleware/multerConfig.js'; // Adjust path
import File from '../models/File.js';


const dossierRouter = express.Router();

// --- Routes de base ---
dossierRouter.post("/choisir-demarche", choisirDemarche);
dossierRouter.post("/questionnaire/:dossierId", remplirQuestionnaire);
dossierRouter.get("/", getAllDossiers);
dossierRouter.get("/statut/:statut", getDossiersByStatut);
dossierRouter.get("/user/all", userAuth ,getAllProject);
//dossierRouter.put('/upload-documents/:id', uploadss.array('documents'), ajouterPiecesDossier);
dossierRouter.put('/update-statut/:id', updateStatut);
dossierRouter.get('/:id',getDossierCreationById)
dossierRouter.get('/unpaid', userAuth, getUnpaidDossier);
// Status update routes for all dossier types
dossierRouter.put('/:id/status', updateDossierStatus);
dossierRouter.put('/modification/:id/status', updateModificationStatus);
dossierRouter.put('/fermeture/:id/status', updateFermetureStatus);
// Email notification route
dossierRouter.post('/send-status-email', sendStatusEmail);
dossierRouter.post('/upload-document', 
  upload.single('file'), 
  uploadDocument,
  addDocumentToDossier
);
// In your backend routes file

// Add this to your backend routes

dossierRouter.get('/download/:username/:filename', async (req, res) => {
  try {
    const { username, filename } = req.params;

    // 1. Decode URI components first
    const decodedUsername = decodeURIComponent(username);
    const decodedFilename = decodeURIComponent(filename);

    // 2. Sanitize the decoded values for directory search
    const sanitizedUsername = sanitizeFileName(decodedUsername);
    const searchPattern = sanitizeFileName(decodedFilename.replace(/\.[^/.]+$/, "")); // Remove extension if any

    const uploadsRoot = path.join(__dirname, '..', 'uploadss');

    // 3. Possible directories to search
    const searchDirs = [
      path.join(uploadsRoot, sanitizedUsername),
      path.join(uploadsRoot, 'general')
    ];

    let foundFile = null;

    // 4. Search through possible directories
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        
        // Find file that matches the pattern (case insensitive, with possible suffix)
        const matchingFile = files.find(file => {
          const fileBase = path.basename(file, path.extname(file));
          const sanitizedFileBase = sanitizeFileName(fileBase);
          
          // Match the beginning of the filename (before the timestamp suffix)
          return sanitizedFileBase.startsWith(searchPattern);
        });

        if (matchingFile) {
          foundFile = path.join(dir, matchingFile);
          break;
        }
      }
    }

    if (!foundFile) {
      console.error('File not found. Searched for pattern:', searchPattern);
      console.error('Searched in directories:', searchDirs);
      
      // Get list of actual files for debugging
      const availableFiles = {};
      for (const dir of searchDirs) {
        if (fs.existsSync(dir)) {
          availableFiles[dir] = fs.readdirSync(dir);
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'File not found',
        details: {
          requested: { username, filename },
          searchPattern,
          searchedPaths: searchDirs,
          availableFiles
        }
      });
    }

    // 5. Verify file exists
    if (!fs.existsSync(foundFile)) {
      console.error('File path exists but file not found:', foundFile);
      return res.status(404).json({
        success: false,
        message: 'File path exists but file not found',
        path: foundFile
      });
    }

    // 6. Send the file with original requested filename
    res.download(foundFile, decodedFilename, (err) => {
      if (err) {
        console.error('Download failed:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Download failed',
            error: err.message
          });
        }
      }
    });

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

dossierRouter.get('/debug/uploads', (req, res) => {
  const uploadsRoot = path.join(__dirname, '..', 'uploadss');
  
  try {
    const walkDir = (dir) => {
      const results = [];
      const list = fs.readdirSync(dir);
      
      list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          results.push({
            name: file,
            type: 'directory',
            contents: walkDir(fullPath)
          });
        } else {
          results.push({
            name: file,
            type: 'file',
            size: stat.size,
            modified: stat.mtime
          });
        }
      });
      
      return results;
    };
    
    res.json({
      uploadsRoot,
      structure: walkDir(uploadsRoot)
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});


// --- Lecture d’un dossier classique ---
/*dossierRouter.get('/:id', userAuth, async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id);
    
    if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });
    res.json(dossier);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
*/
// --- Lecture d’une modification ---
dossierRouter.get('/modifications/:id', async (req, res) => {
   try {
    const modification = await DossierModification.findById(req.params.id)
      .populate('user', 'name email')           // récupère name et email du client
      .populate('boAffecte', 'name email')
      .populate('fichiers' ,  'filename url');
         // récupère name et email du BO
    if (!modification) return res.status(404).json({ message: "Modification non trouvée" });
    res.status(200).json(modification);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// ✅ Route : mise à jour du statut d’un dossier

dossierRouter.put('/dossier/:id/update-status', async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id);
    if (!dossier) return res.status(404).json({ message: "Dossier introuvable" });

    // Update both fields if they exist in request body
    if (req.body.etatAvancement) {
      dossier.etatAvancement = req.body.etatAvancement;
    }
    if (req.body.statut) {
      dossier.statut = req.body.statut;
    }

    await dossier.save();

    res.status(200).json({ 
      message: "Statut mis à jour", 
      dossier: {
        _id: dossier._id,
        statut: dossier.statut,
        etatAvancement: dossier.etatAvancement,
        // Include other fields you might need
      }
    });
  } catch (err) {
    console.error("Erreur mise à jour statut dossier:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Route : mise à jour du statut d'une modification
dossierRouter.put('/dossiers/modifications/:id/update-status', async (req, res) => {
  try {
    const modification = await DossierModification.findById(req.params.id);
    if (!modification) return res.status(404).json({ message: "Modification introuvable" });

    // Update both fields if they exist in request body
    if (req.body.etatAvancement) {
      modification.etatAvancement = req.body.etatAvancement;
    }
    if (req.body.statut) {
      modification.statut = req.body.statut;
    }

    await modification.save();

    res.status(200).json({ 
      message: "Statut de modification mis à jour", 
      modification: {
        _id: modification._id,
        statut: modification.statut,
        etatAvancement: modification.etatAvancement,
        // Include other fields you might need
      }
    });
  } catch (err) {
    console.error("Erreur mise à jour statut modification:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Add userAuth middleware to the route
/*dossierRouter.get("/user-latest", userAuth, async (req, res) => {
  try {
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    
    if (!req.user?.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    console.log(`Fetching latest for user ${req.user.id}`);

    // Verify models are registered
    if (!mongoose.models.Dossier || !mongoose.models.DossierModification) {
      console.error("Models not registered!");
      return res.status(500).json({ message: "Database configuration error" });
    }

    let dossier;
    try {
      dossier = await Dossier.findOne({ user: req.user.id })
        .sort({ updatedAt: -1 })
        .lean()
        .maxTimeMS(5000); // Add timeout
      
      console.log("Dossier query completed");
    } catch (dbErr) {
      console.error("Dossier query error:", {
        message: dbErr.message,
        stack: dbErr.stack,
        name: dbErr.name
      });
      return res.status(500).json({ 
        message: "Database error",
        error: process.env.NODE_ENV === 'development' ? dbErr.message : undefined
      });
    }

    if (!dossier) {
      console.log("No dossier found, checking modifications");
      try {
        const modification = await DossierModification.findOne({ user: req.user.id })
          .sort({ updatedAt: -1 })
          .lean()
          .maxTimeMS(5000);

        if (modification) {
          return res.json({
            ...modification,
            isModification: true
          });
        }

        return res.status(404).json({
          message: "Aucun dossier ou modification trouvé",
          code: "NO_DOCUMENTS_FOUND"
        });
      } catch (modErr) {
        console.error("Modification query error:", modErr);
        return res.status(500).json({ 
          message: "Database error",
          error: process.env.NODE_ENV === 'development' ? modErr.message : undefined
        });
      }
    }

    // Rest of your logic...
    
  } catch (err) {
    console.error("Unexpected error in /user-latest:", {
      message: err.message,
      stack: err.stack,
      user: req.user
    });
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
*/

dossierRouter.get('/:id/payment-status', userAuth, async (req, res) => {
  try {
    const dossier = await Dossier.findById(req.params.id);
    if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });
    
    res.json({
      paymentStatus: dossier.paymentStatus,
      paymentIntentId: dossier.paymentIntentId,
      etatAvancement: dossier.etatAvancement
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

dossierRouter.get('/download/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    console.log(file)
    if (!file || !file.url || !file.filename) {
      return res.status(404).json({ message: 'Fichier introuvable ou incomplet' });
    }

    let downloadUrl = file.url;

    res.send(downloadUrl);
  } catch (error) {
    console.error('Erreur téléchargement fichier :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


dossierRouter.get('/dossier/:id', getDossierCreationById);

// Add this to your dossierRouter
dossierRouter.put("/:id", userAuth, updateDossier);





export default dossierRouter;
