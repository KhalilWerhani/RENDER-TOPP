import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';
import { styled } from '@mui/system';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card,
  CardContent,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadDocument = ({ destinataireId, roleDestinataire }) => {
  const { backendUrl, userData } = useContext(AppContent);
  const [titre, setTitre] = useState('');
  const [fichier, setFichier] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Map roles to valid backend values
  const mapRoleToBackendValue = (role) => {
    const roleMap = {
      'user': 'client',       // Example mapping
      'client': 'client',     // Keep if already correct
      'collaborator': 'collaborateur',
      'collaborateur': 'collaborateur',
      'admin': 'administrateur',
      // Add other mappings as needed
    };
    
    return roleMap[role?.toLowerCase()] || 'client'; // Default to 'client' if unknown
  };

  const handleUpload = async () => {
    if (!titre || !fichier) {
      setSnackbar({
        open: true,
        message: 'Veuillez remplir tous les champs',
        severity: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('fichier', fichier);
    formData.append('destinataireId', destinataireId);
    
    // Use mapped roles
    formData.append('roleUploader', mapRoleToBackendValue(userData.role));
    formData.append('roleDestinataire', mapRoleToBackendValue(roleDestinataire));

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await axios.post(`${backendUrl}/api/documents/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setSnackbar({
        open: true,
        message: 'Document envoyé avec succès!',
        severity: 'success'
      });
      
      // Reset form
      setTitre('');
      setFichier(null);
      setFileName('');
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Erreur: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ... rest of the component remains the same ...
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFichier(file);
      setFileName(file.name);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Card className='mt-10' elevation={3} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
          Envoyer un document
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Titre du document"
            variant="outlined"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            sx={{ mb: 3 }}
            disabled={isUploading}
          />
          
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ mb: 2, width: '100%', py: 1.5 }}
            disabled={isUploading}
          >
            {fileName || 'Sélectionner un fichier'}
            <VisuallyHiddenInput 
              type="file" 
              onChange={handleFileChange} 
              disabled={isUploading}
            />
          </Button>
          
          {isUploading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" display="block" textAlign="right">
                {uploadProgress}%
              </Typography>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={isUploading || !titre || !fichier}
            fullWidth
            size="large"
            sx={{ py: 1.5, fontWeight: 'medium' }}
            startIcon={isUploading ? null : <CheckCircle />}
          >
            {isUploading ? 'Envoi en cours...' : 'Envoyer le document'}
          </Button>
        </Box>
      </CardContent>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          icon={snackbar.severity === 'error' ? <Error /> : <CheckCircle />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default UploadDocument;