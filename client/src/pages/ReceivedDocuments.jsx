import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { 
  Box, 
  Typography, 
  Button, 
  Avatar,
  Paper,
  CircularProgress,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Skeleton
} from '@mui/material';
import {
  Download as DownloadIcon,
  InsertDriveFile as DocumentIcon,
  Person as PersonIcon,
  Schedule as TimeIcon,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReceivedDocuments = () => {
  const { backendUrl } = useContext(AppContent);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/documents/received`, {
          withCredentials: true,
        });

        let docs = [];
        if (Array.isArray(res.data)) {
          docs = res.data;
        } else if (res.data && res.data.length) {
          docs = res.data;
        } else if (res.data.success && res.data.documents) {
          docs = res.data.documents;
        }

        // Sort by date (newest first)
        docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDocuments(docs);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement documents reçus:', err);
        setError('Erreur lors du chargement des documents. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [backendUrl]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    const sortedDocuments = [...documents].sort((a, b) => {
      if (property === 'createdAt') {
        return isAsc 
          ? new Date(a[property]) - new Date(b[property])
          : new Date(b[property]) - new Date(a[property]);
      } else {
        return isAsc 
          ? a[property]?.localeCompare(b[property])
          : b[property]?.localeCompare(a[property]);
      }
    });
    
    setDocuments(sortedDocuments);
  };

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const fileTypes = {
      pdf: 'PDF',
      doc: 'DOC',
      docx: 'DOCX',
      xls: 'XLS',
      xlsx: 'XLSX',
      ppt: 'PPT',
      pptx: 'PPTX',
      jpg: 'JPG',
      jpeg: 'JPEG',
      png: 'PNG',
      txt: 'TXT'
    };
    return fileTypes[extension] || extension.toUpperCase();
  };

  const getFileIconColor = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const colors = {
      pdf: '#FF5252',
      doc: '#2196F3',
      docx: '#2196F3',
      xls: '#4CAF50',
      xlsx: '#4CAF50',
      ppt: '#FF9800',
      pptx: '#FF9800',
      jpg: '#FF4081',
      jpeg: '#FF4081',
      png: '#00BCD4',
      txt: '#9E9E9E'
    };
    return colors[extension] || '#673AB7';
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      maxWidth: '100%',
      margin: '0 auto',
      backgroundColor: '#f9fafc'
    }}>
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 3,
        backgroundColor: 'background.paper'
      }}>
        <Typography 
          variant="h5" 
          component="div"
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <DocumentIcon fontSize="large" color="primary" />
          Documents Reçus
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Liste de tous les documents que vous avez reçus
        </Typography>
      </Paper>

      {loading ? (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rectangular" 
              height={70} 
              sx={{ 
                mb: index < 4 ? 2 : 0, 
                borderRadius: 2 
              }} 
            />
          ))}
        </Paper>
      ) : error ? (
        <Paper elevation={2} sx={{ 
          p: 3, 
          textAlign: 'center',
          backgroundColor: 'error.light',
          color: 'error.contrastText',
          borderRadius: 3
        }}>
          <Typography variant="body1">{error}</Typography>
          <Button 
            variant="contained" 
            color="error" 
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </Paper>
      ) : documents.length === 0 ? (
        <Paper elevation={2} sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 3
        }}>
          <Typography variant="h6" gutterBottom>
            Aucun document reçu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Les documents que vous recevez apparaîtront ici.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'titre'}
                      direction={orderBy === 'titre' ? order : 'asc'}
                      onClick={() => handleRequestSort('titre')}
                      sx={{ color: 'common.white !important' }}
                    >
                      Document
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'uploader.email'}
                      direction={orderBy === 'uploader.email' ? order : 'asc'}
                      onClick={() => handleRequestSort('uploader.email')}
                      sx={{ color: 'common.white !important' }}
                    >
                      Expéditeur
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'desc'}
                      onClick={() => handleRequestSort('createdAt')}
                      sx={{ color: 'common.white !important' }}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>Type</TableCell>
                  <TableCell align="right" sx={{ color: 'common.white', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow
                    key={doc._id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: getFileIconColor(doc.fichier),
                          width: 40, 
                          height: 40 
                        }}>
                          <DocumentIcon sx={{ color: 'common.white' }} />
                        </Avatar>
                        <Typography variant="body1" fontWeight={500}>
                          {doc.titre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<PersonIcon fontSize="small" />}
                        label={doc.uploader?.email || 'Inconnu'}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={new Date(doc.createdAt).toLocaleString()}>
                        <Chip
                          icon={<TimeIcon fontSize="small" />}
                          label={formatDistanceToNow(new Date(doc.createdAt), {
                            addSuffix: true,
                            locale: fr
                          })}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getFileType(doc.fichier)} 
                        color="primary" 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          borderRadius: 1,
                          backgroundColor: 'primary.light',
                          color: 'common.white'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        href={`${backendUrl}/${doc.fichier.replace(/\\/g, '/')}`}
                        download
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          textTransform: 'none',
                          boxShadow: 'none',
                          minWidth: '120px',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                          }
                        }}
                      >
                        Télécharger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default ReceivedDocuments;