import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Snackbar,
  Pagination,
  Avatar,
  InputAdornment,
  Divider,
  Collapse
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useDossierService } from './dossierService';
import { AppContent } from '../../context/AppContext';
import FileViewerModalUser from './FileViewerModalUser';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UserEntreprise = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const { getUserDossiers, getDossierFiles } = useDossierService();
  
  const [dossiers, setDossiers] = useState([]);
  const [groupedDossiers, setGroupedDossiers] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalDossiers, setTotalDossiers] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const statusConfig = {
    "en attente": {
      color: "warning",
      label: "En Attente"
    },
    "payé": {
      color: "info",
      label: "Payé"
    },
    "a traité": {
      color: "warning",
      label: "À Traiter"
    },
    "en traitement": {
      color: "primary",
      label: "En Traitement"
    },
    "traité": {
      color: "success",
      label: "Traité"
    }
  };

  const getTypeColor = (type) => {
    const actualType = type.includes('Création') 
      ? type.replace('Création ', '') 
      : type;

    switch (actualType) {
      case 'SAS':
      case 'SASU':
      case 'SARL':
      case 'EURL':
      case 'SCI':
        return 'primary';
      case 'Modification':
      case 'TRANSFORMATION_SARL_EN_SAS':
        return 'secondary';
      case 'Fermeture':
      case 'RADIATION_AUTO_ENTREPRENEUR':
      case 'MISE_EN_SOMMEIL':
      case 'LIQUIDATION':
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

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const data = await getUserDossiers(page, pageSize, typeFilter, searchQuery);
      setDossiers(data.dossiers || []);
      setTotalDossiers(data.total || 0);
      
      // Group dossiers by SIRET or enterprise name
      const grouped = {};
      data.dossiers.forEach(dossier => {
        const key = dossier.siret || dossier.entreprise?.siret || dossier.nomEntreprise || dossier.entreprise?.nom;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(dossier);
      });
      setGroupedDossiers(grouped);
      
    } catch (err) {
      console.error('Error fetching dossiers:', err);
      setError(err.response?.data?.message || err.message);
      setDossiers([]);
      setGroupedDossiers({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchDossiers();
    }
  }, [userData, page, pageSize, typeFilter, searchQuery]);

  const toggleRowExpand = (key) => {
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleViewFiles = async (dossier) => {
    try {
      const data = await getDossierFiles(dossier._id);
      setSelectedDossier({
        ...data.dossier,
        type: data.dossier.type,
        codeDossier: data.dossier.codeDossier,
        statut: data.dossier.statut,
        user: data.dossier.user,
        createdAt: data.dossier.createdAt,
        fichiers: data.dossier.fichiers || [],
        questionnaire: data.dossier.questionnaire || []
      });
      setOpenFileModal(true);
    } catch (err) {
      console.error('Error viewing files:', err);
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'Erreur lors du chargement des fichiers',
        severity: 'error'
      });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    fetchDossiers();
  };

  if (!userData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '300px'
      }}>
        <CircularProgress size={60} sx={{ color: '#1e3a8a' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          color: '#1e3a8a', 
          fontWeight: 'bold',
          textAlign: { xs: 'center', md: 'left' }
        }}>
          Mes Dossiers Entreprise
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: '#f4d47c',
              color: '#1e3a8a',
              '&:hover': {
                backgroundColor: '#e6c66d'
              }
            }}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' }
        }}>
          <TextField
            placeholder="Rechercher..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 2 }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flex: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              size="small"
              sx={{ minWidth: 180 }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="Création">Créations</MenuItem>
              <MenuItem value="SAS">Création SAS</MenuItem>
              <MenuItem value="SASU">Création SASU</MenuItem>
              <MenuItem value="SARL">Création SARL</MenuItem>
              <MenuItem value="EURL">Création EURL</MenuItem>
              <MenuItem value="SCI">Création SCI</MenuItem>
              <MenuItem value="Modification">Modifications</MenuItem>
              <MenuItem value="TRANSFORMATION_SARL_EN_SAS">Transformation SARL→SAS</MenuItem>
              <MenuItem value="Fermeture">Fermetures</MenuItem>
              <MenuItem value="RADIATION_AUTO_ENTREPRENEUR">Radiation auto-entrepreneur</MenuItem>
              <MenuItem value="MISE_EN_SOMMEIL">Mise en sommeil</MenuItem>
              <MenuItem value="LIQUIDATION">Liquidation</MenuItem>
            </Select>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '300px'
        }}>
          <CircularProgress size={60} sx={{ color: '#1e3a8a' }} />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            Erreur: {error}
          </Typography>
          <Button 
            onClick={fetchDossiers} 
            variant="outlined" 
            sx={{ mt: 2 }}
          >
            Réessayer
          </Button>
        </Paper>
      ) : Object.keys(groupedDossiers).length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Aucun dossier trouvé
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Essayez de modifier vos critères de recherche
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper sx={{ 
            mb: 3, 
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#1e3a8a' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Entreprise</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SIRET</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Domiciliation</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(groupedDossiers).map((key) => {
                    const enterpriseDossiers = groupedDossiers[key];
                    const firstDossier = enterpriseDossiers[0];
                    const isExpanded = expandedRows[key] || false;
                    const hasSiret = firstDossier.siret || firstDossier.entreprise?.siret;
                    
                    return (
                      <React.Fragment key={key}>
                        <TableRow 
                          hover
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleRowExpand(key)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {isExpanded ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                              <Typography variant="body2" fontWeight="medium">
                                {firstDossier.nomEntreprise || firstDossier.entreprise?.nom || 'Non spécifié'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {hasSiret || 'Non renseigné'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {firstDossier.domiciliation || firstDossier.entreprise?.adresse || 'Non renseigné'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Voir les dossiers">
                                <IconButton
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRowExpand(key);
                                  }}
                                  size="small"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                  Dossiers associés
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Code</TableCell>
                                      <TableCell>Type</TableCell>
                                      <TableCell>Statut</TableCell>
                                      <TableCell>Créé le</TableCell>
                                      <TableCell>Actions</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {enterpriseDossiers.map((dossier) => (
                                      <TableRow key={dossier._id}>
                                        <TableCell>
                                          <Chip 
                                            label={dossier.codeDossier} 
                                            size="small"
                                            sx={{ 
                                              backgroundColor: '#f0f4f8',
                                              color: '#1e3a8a',
                                              fontWeight: 'bold'
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            label={getDetailedType(dossier)}
                                            color={getTypeColor(dossier.questionnaire?.entrepriseType || dossier.typeFermeture || dossier.type)}
                                            size="small"
                                            sx={{ fontWeight: 'medium' }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            label={statusConfig[dossier.statut]?.label || dossier.statut}
                                            color={getTypeColor(dossier.statut)}
                                            size="small"
                                            sx={{ fontWeight: 'medium' }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                              {format(new Date(dossier.createdAt), 'dd/MM/yyyy', { locale: fr })}
                                            </Typography>
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Voir les fichiers">
                                              <IconButton
                                                color="primary"
                                                onClick={() => handleViewFiles(dossier)}
                                                size="small"
                                              >
                                                <VisibilityIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Pagination */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Entreprises par page:
              </Typography>
              <Select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                size="small"
                sx={{ width: 80 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
            
            <Pagination
              count={Math.ceil(totalDossiers / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#1e3a8a'
                },
                '& .Mui-selected': {
                  backgroundColor: '#f4d47c !important',
                  color: '#1e3a8a'
                }
              }}
            />
            
            <Typography variant="body2" color="textSecondary">
              {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalDossiers)} sur ${totalDossiers} entreprises`}
            </Typography>
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

      {/* Success Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({...toast, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{
          backgroundColor: toast.severity === 'success' ? '#4caf50' : '#f44336',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '4px',
          boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Typography variant="body2">
            {toast.message}
          </Typography>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default UserEntreprise;