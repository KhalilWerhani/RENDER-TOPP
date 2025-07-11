/*import express from "express";
import upload from "../middleware/multerDocument.js";
import {
  uploadDocument,
  getDocumentsByParent,
  downloadDocument
} from "../controllers/datadocumentController.js";

const router = express.Router();

// Upload document
router.post("/", upload.single("file"), uploadDocument);
router.post("/modification", upload.single("file"), uploadDocument);
router.post("/fermeture", upload.single("file"), uploadDocument);

// Get documents by parent (dossier/modification/fermeture)
router.get("/", getDocumentsByParent);

// Download a document
router.get("/:id/download", downloadDocument);

export default router;*/
