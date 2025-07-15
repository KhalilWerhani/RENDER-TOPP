import React, { useState, useEffect, useContext } from 'react';
import { 
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Pagination,
  Paper,
  Fade,
  Slide,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { Description, ArrowBack, CloudUpload, InsertDriveFile } from '@mui/icons-material';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Styled components
const DossierCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 16px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StyledDossierCard = styled(Paper)`
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  animation: ${fadeIn} 0.3s ease-out forwards;
  animation-delay: ${props => props.delay * 0.05}s;
  opacity: 0;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }

  &.selected {
    border-left: 4px solid #1976d2;
    background-color: #f5f9ff;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #1976d2, #64b5f6);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
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
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${props => 
    props.status === 'active' ? '#e8f5e9' : 
    props.status === 'closed' ? '#ffebee' : '#e3f2fd'};
  color: ${props => 
    props.status === 'active' ? '#2e7d32' : 
    props.status === 'closed' ? '#c62828' : '#1565c0'};
  transition: all 0.2s ease;
`;

const FileUploadArea = styled.div`
  border: 2px dashed #bdbdbd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin: 20px 0;
  transition: all 0.3s ease;
  background-color: ${props => props.dragging ? '#f5f5f5' : '#fafafa'};
  cursor: pointer;
  
  &:hover {
    border-color: #1976d2;
    background-color: #f5f9ff;
  }
`;

const UploadButton = styled(Button)`
  && {
    padding: 10px 24px;
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    
    ${props => props.$isuploading && css`
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        animation: ${pulse} 1.5s infinite;
      }
    `}
  }
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-top: 16px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const UploadDocumentWrapper = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedDossier) {
      setError('Please select a file and a dossier');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userData.id);
    formData.append('dossierId', selectedDossier._id);
    formData.append('typeDossier', selectedDossier.type === 'fermeture' ? 'fermeture' : 
                    selectedDossier.type === 'modification' ? 'modification' : 'standard');
    formData.append('destinataireId', selectedDossier.user?._id);

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/filesboadmin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      setSuccess(`Document uploaded successfully to ${selectedDossier.type} dossier`);
      setFile(null);
      fetchDossiers(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4, maxWidth: 1200, margin: '0 auto' }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
          <Description sx={{ verticalAlign: 'middle', mr: 1 }} />
          Dossier Document Upload
        </Typography>
      </Slide>

      {!selectedDossier ? (
        <Fade in={true}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
              Select a dossier to upload documents:
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : dossiers.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No dossiers found
                </Typography>
              </Paper>
            ) : (
              <>
                <DossierCardContainer>
                  {dossiers.map((dossier, index) => (
                    <StyledDossierCard 
                      key={dossier._id}
                      onClick={() => setSelectedDossier(dossier)}
                      elevation={2}
                      delay={index}
                    >
                      <DossierHeader>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {dossier.codeDossier || 'Unnamed Dossier'}
                        </Typography>
                        <DossierStatus status={dossier.statut?.toLowerCase()}>
                          {dossier.statut || 'UNKNOWN'}
                        </DossierStatus>
                      </DossierHeader>
                      
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        <strong>Client:</strong> {dossier.user?.name || dossier.entreprise?.nom || 'N/A'}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        <strong>Type:</strong> {dossier.type === 'fermeture' ? dossier.typeFermeture : dossier.type || 'Standard'}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                        <strong>Created:</strong> {new Date(dossier.createdAt).toLocaleDateString()}
                      </Typography>
                      
                      {dossier.fichiers?.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Documents:</strong> {dossier.fichiers.length}
                        </Typography>
                      )}
                    </StyledDossierCard>
                  ))}
                </DossierCardContainer>
                
                {pagination.total > pagination.limit && (
                  <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                      count={Math.ceil(pagination.total / pagination.limit)}
                      page={pagination.page}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Fade>
      ) : (
        <Zoom in={true}>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setSelectedDossier(null)}
              startIcon={<ArrowBack />}
              sx={{ mb: 3 }}
            >
              Back to Dossiers
            </Button>

            <Paper elevation={2} sx={{ p: isMobile ? 2 : 4, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upload Document to: <span style={{ color: '#1976d2' }}>{selectedDossier.codeDossier}</span>
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Client: {selectedDossier.user?.name || selectedDossier.entreprise?.nom || 'N/A'}
              </Typography>

              <Box 
                component="form" 
                onSubmit={handleUpload}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <FileUploadArea dragging={dragging}>
                  <CloudUpload sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {dragging ? 'Drop your file here' : 'Drag & drop your file here'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    or click to browse files (PDF, JPG, PNG)
                  </Typography>
                  
                  <input
                    accept="application/pdf,image/*"
                    style={{ display: 'none' }}
                    id="dossier-file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="dossier-file-upload">
                    <UploadButton 
                      variant="contained" 
                      component="span"
                    >
                      Select File
                    </UploadButton>
                  </label>
                </FileUploadArea>
                
                {file && (
                  <SelectedFile>
                    <InsertDriveFile sx={{ mr: 2, color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>
                  </SelectedFile>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <UploadButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!file || loading}
                    $isuploading={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </UploadButton>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Zoom>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
      >
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadDocumentWrapper;