import React, { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Box,
  Divider,
  Paper,
  IconButton
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { AppContent } from '../../context/AppContext';

const FileViewerModalUser = ({ open, onClose, dossier, backendUrl }) => {
  if (!dossier) return null;

  // Function to construct the correct file URL
  const getFileUrl = (file) => {
    // If the file already has a full URL, use that
    if (file.url) return file.url;
    
    // Otherwise construct from path (ensure path doesn't start with a slash)
    const cleanPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
    return `${backendUrl}/${cleanPath}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails du dossier</Typography>
          <Button onClick={onClose} color="primary">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Code dossier:</strong> {dossier.codeDossier}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Type:</strong> {dossier.type}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Statut:</strong> 
            <Chip 
              label={dossier.statut} 
              color={dossier.statut === 'traité' ? 'success' : 'primary'} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Typography>
          {dossier.nomEntreprise && (
            <Typography variant="subtitle1" gutterBottom>
              <strong>Nom entreprise:</strong> {dossier.nomEntreprise}
            </Typography>
          )}
          {dossier.siret && (
            <Typography variant="subtitle1" gutterBottom>
              <strong>SIRET:</strong> {dossier.siret}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Fichiers associés
        </Typography>
        
        {dossier.fichiers?.length > 0 ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List>
              {dossier.fichiers.map((file, index) => (
                <ListItem 
                  key={index}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      href={getFileUrl(file)}
                      target="_blank"
                      download
                    >
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={file.filename} 
                    secondary={`${(file.size / 1024).toFixed(2)} KB`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Aucun fichier associé à ce dossier
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerModalUser;