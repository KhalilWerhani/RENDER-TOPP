import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Pagination
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useDossierService } from './dossierService';
import { AppContent } from '../../context/AppContext';
import FileViewerModalUser from './FileViewerModalUser';
const UserEntreprise = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const { getUserDossiers, getDossierFiles } = useDossierService();
  
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalDossiers, setTotalDossiers] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserDossiers(page, pageSize, typeFilter);
        setDossiers(data.dossiers);
        setTotalDossiers(data.total);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchData();
    }
  }, [userData, page, pageSize, typeFilter]);

  const handleViewFiles = async (dossier) => {
    try {
      const data = await getDossierFiles(dossier._id);
      setSelectedDossier(data.dossier);
      setOpenFileModal(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Création':
        return 'primary';
      case 'Modification':
        return 'secondary';
      case 'Fermeture':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDetailedType = (dossier) => {
    if (dossier.type === 'Création' && dossier.questionnaire?.entrepriseType) {
      return `Création ${dossier.questionnaire.entrepriseType}`;
    }
    if (dossier.type === 'Fermeture' && dossier.typeFermeture) {
      return dossier.typeFermeture;
    }
    if (dossier.typeChangement) {
      return dossier.typeChangement;
    }
    if (dossier.type === 'TRANSFORMATION_SARL_EN_SAS') {
      return 'Transformation SARL→SAS';
    }
    return dossier.type || 'Non spécifié';
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (!userData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mes Dossiers Entreprise (Traités)
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1); // Reset to first page when filter changes
          }}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">Tous les types</MenuItem>
          <MenuItem value="Création">Créations</MenuItem>
          <MenuItem value="Modification">Modifications</MenuItem>
          <MenuItem value="Fermeture">Fermetures</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : dossiers.length === 0 ? (
        <Typography>Aucun dossier traité trouvé</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Code Dossier</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Nom Entreprise</TableCell>
                  <TableCell>SIRET</TableCell>
                  <TableCell>Domiciliation</TableCell>
                  <TableCell>Créé le</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dossiers.map((dossier) => (
                  <TableRow key={dossier._id}>
                    <TableCell>{dossier.codeDossier}</TableCell>
                    <TableCell>
                      <Chip
                        label={getDetailedType(dossier)}
                        color={getTypeColor(dossier.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {dossier.nomEntreprise || dossier.entreprise?.nom || 'Non spécifié'}
                    </TableCell>
                    <TableCell>
                      {dossier.siret || dossier.entreprise?.siret || 'Non renseigné'}
                    </TableCell>
                    <TableCell>
                      {dossier.domiciliation || dossier.entreprise?.adresse || 'Non renseigné'}
                    </TableCell>
                    <TableCell>
                      {new Date(dossier.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Voir les détails">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewFiles(dossier)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Select
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value);
                setPage(1); // Reset to first page when page size changes
              }}
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value={5}>5 par page</MenuItem>
              <MenuItem value={10}>10 par page</MenuItem>
              <MenuItem value={25}>25 par page</MenuItem>
              <MenuItem value={50}>50 par page</MenuItem>
            </Select>

            <Pagination
              count={Math.ceil(totalDossiers / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* File Viewer Modal */}
      {selectedDossier && (
        <FileViewerModalUser
          open={openFileModal}
          onClose={() => setOpenFileModal(false)}
          dossier={selectedDossier}
          backendUrl={backendUrl}
        />
      )}
    </Box>
  );
};

export default UserEntreprise;