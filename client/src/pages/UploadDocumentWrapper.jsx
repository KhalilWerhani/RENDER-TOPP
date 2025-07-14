import React, { useState, useEffect, useContext } from 'react';
import { 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Pagination
} from '@mui/material';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { AppContent } from '../context/AppContext';

// Styled components
const DossierCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const DossierCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  &.selected {
    border: 2px solid #1976d2;
    background-color: #f0f7ff;
  }
`;

const DossierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const DossierStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'active' ? '#e8f5e9' : 
    props.status === 'closed' ? '#ffebee' : '#e3f2fd'};
  color: ${props => 
    props.status === 'active' ? '#2e7d32' : 
    props.status === 'closed' ? '#c62828' : '#1565c0'};
`;

const UploadDocumentWrapper = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  // Fetch dossiers from the new endpoint
  const fetchDossiers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/bo/dossiers`, {
        params: {
          page,
          limit: pagination.limit
        },
        withCredentials: true
      });

      setDossiers(response.data.dossiers || []);
      setPagination(prev => ({
        ...prev,
        page,
        total: response.data.total || 0
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dossiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, []);

  const handlePageChange = (event, newPage) => {
    fetchDossiers(newPage);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!file || !selectedDossier) {
    setError('Please select a file and a dossier');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userData.id); // The admin/BO user uploading the file
  formData.append('dossierId', selectedDossier._id); // The dossier ID
  formData.append('typeDossier', selectedDossier.type === 'fermeture' ? 'fermeture' : 'standard'); // Determine dossier type
  formData.append('destinataireId', selectedDossier.user?._id); // The client who owns the dossier

  try {
    setLoading(true);
    const res = await axios.post(`${backendUrl}/api/filesboadmin/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    setSuccess(true);
    setFile(null);
    // Refresh the dossiers list after successful upload
    fetchDossiers(pagination.page);
  } catch (err) {
    setError(err.response?.data?.message || 'Upload failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Dossier Document Upload</Typography>

      {!selectedDossier ? (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Select a dossier to upload documents:
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : dossiers.length === 0 ? (
            <Typography>No dossiers found</Typography>
          ) : (
            <>
              <DossierCardContainer>
                {dossiers.map(dossier => (
                  <DossierCard 
                    key={dossier._id}
                    onClick={() => setSelectedDossier(dossier)}
                  >
                    <DossierHeader>
                      <Typography variant="h6">{dossier.codeDossier || 'Unnamed Dossier'}</Typography>
                      <DossierStatus status={dossier.statut?.toLowerCase()}>
                        {dossier.statut || 'UNKNOWN'}
                      </DossierStatus>
                    </DossierHeader>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Client:</strong> {dossier.user?.name || dossier.entreprise?.nom || 'N/A'}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Type:</strong> {dossier.type === 'fermeture' ? dossier.typeFermeture : dossier.type || 'Standard'}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Created:</strong> {new Date(dossier.createdAt).toLocaleDateString()}
                    </Typography>
                    
                    {dossier.fichiers?.length > 0 && (
                      <Typography variant="body2">
                        <strong>Documents:</strong> {dossier.fichiers.length}
                      </Typography>
                    )}
                  </DossierCard>
                ))}
              </DossierCardContainer>
              
              {pagination.total > pagination.limit && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={Math.ceil(pagination.total / pagination.limit)}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setSelectedDossier(null)}
            >
              Back to Dossiers
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Document to: {selectedDossier.codeDossier}
          </Typography>

          <Box component="form" onSubmit={handleUpload} sx={{ mt: 2 }}>
            <input
              accept="application/pdf,image/*"
              style={{ display: 'none' }}
              id="dossier-file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="dossier-file-upload">
              <Button 
                variant="contained" 
                component="span"
                sx={{ mr: 2 }}
              >
                Select File
              </Button>
            </label>
            
            {file && (
              <Typography variant="body1" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!file || loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Upload Document
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Document uploaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadDocumentWrapper;