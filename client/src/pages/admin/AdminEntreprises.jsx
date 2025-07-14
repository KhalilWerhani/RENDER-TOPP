import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import FileViewerModal from '../../components/FileViewerModal';

const AdminEntreprises = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [openSiretModal, setOpenSiretModal] = useState(false);
  const [siretData, setSiretData] = useState({
    siret: '',
    domiciliation: '',
    logo: '',
    nomEntreprise: ''
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedDossierForStatus, setSelectedDossierForStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalDossiers, setTotalDossiers] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const statusConfig = {
    "en attente": {
      color: "warning",
      icon: <CheckCircleIcon color="warning" />,
      label: "En Attente"
    },
    "payé": {
      color: "info",
      icon: <CreditCardIcon color="info" />,
      label: "Payé"
    },
    "a traité": {
      color: "warning",
      icon: <DescriptionIcon color="warning" />,
      label: "À Traiter"
    },
    "en traitement": {
      color: "primary",
      icon: <CheckCircleIcon color="primary" />,
      label: "En Traitement"
    },
    "traité": {
      color: "success",
      icon: <CheckCircleIcon color="success" />,
      label: "Traité"
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
      const response = await axios.get('/api/admin/combined-dossiers', {
        params: {
          page,
          pageSize,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchQuery || undefined
        }
      });
      
      setDossiers(response.data.dossiers || []);
      setTotalDossiers(response.data.total || 0);
    } catch (err) {
      console.error('Error fetching dossiers:', err);
      setError(err.message);
      setDossiers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
  }, [page, pageSize, statusFilter, typeFilter, searchQuery]);

  const handleViewFiles = async (dossier) => {
    try {
      if (!dossier?._id) {
        throw new Error('Dossier invalide: ID manquant');
      }

      const response = await axios.get(`/api/admin/dossiers/${dossier._id}`).catch(err => {
        if (err.response?.status === 404) {
          throw new Error(`Dossier non trouvé`);
        }
        throw err;
      });

      if (!response.data) {
        throw new Error('Données du dossier non trouvées dans la réponse');
      }

      setSelectedDossier({
        ...dossier,
        type: dossier.type,
        codeDossier: dossier.codeDossier,
        statut: dossier.statut,
        user: dossier.user,
        boAffecte: dossier.boAffecte,
        createdAt: dossier.createdAt,
        fichiers: dossier.fichiers || [],
        fichiersbo: dossier.fichiersbo || [],
        questionnaire: dossier.questionnaire || []
      });
      
      setOpenFileModal(true);
    } catch (err) {
      console.error('Error viewing files:', err);
      setToast({
        open: true,
        message: err.message || 'Erreur lors du chargement des fichiers',
        severity: 'error'
      });
    }
  };

  const handleUpdateStatus = async (dossier) => {
    try {
      setIsSaving(true);
      
      let url = '';
      const payload = { statut: 'traité' };
      
      if (dossier.type === 'Création') {
        url = `/api/dossier/${dossier._id}/update-status`;
      } else if (dossier.type === 'Fermeture') {
        url = `/api/fermeture/${dossier._id}/update-status`;
      } else {
        url = `/api/modification/${dossier._id}/update-status`;
      }
      
      const response = await axios.put(url, payload);
      await fetchDossiers();
      
      setToast({
        open: true,
        message: response.data.message || 'Statut mis à jour avec succès',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'Erreur lors de la mise à jour',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
      setConfirmationOpen(false);
    }
  };

  const handleStatusUpdateClick = (dossier) => {
    setSelectedDossierForStatus(dossier);
    setConfirmationOpen(true);
  };

  const handleAddSiret = (dossier) => {
    setSelectedDossier(dossier);
    setSiretData({
      nomEntreprise: dossier.nomEntreprise || dossier.entreprise?.nom || '',
      siret: dossier.siret || dossier.entreprise?.siret || '',
      domiciliation: dossier.domiciliation || dossier.entreprise?.adresse || '',
      logo: dossier.logo || ''
    });
    setOpenSiretModal(true);
  };

  const handleSiretSubmit = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (!siretData.siret || !siretData.domiciliation || !siretData.nomEntreprise) {
        throw new Error('Le SIRET, la domiciliation et le nom de l\'entreprise sont obligatoires');
      }

      let endpoint;
      const payload = {
        siret: siretData.siret,
        domiciliation: siretData.domiciliation,
        logo: siretData.logo,
        nomEntreprise: siretData.nomEntreprise,
        entreprise: {
          nom: siretData.nomEntreprise,
          siret: siretData.siret,
          adresse: siretData.domiciliation
        }
      };

      if (selectedDossier.type === 'Création') {
        endpoint = `/api/admin/dossiers/${selectedDossier._id}`;
      } else if (selectedDossier.type === 'Fermeture') {
        endpoint = `/api/admin/fermetures/${selectedDossier._id}`;
      } else {
        endpoint = `/api/admin/modifications/${selectedDossier._id}`;
      }

      await axios.put(endpoint, payload);
      await fetchDossiers();
      
      setToast({
        open: true,
        message: 'Changements enregistrés avec succès',
        severity: 'success'
      });

      setOpenSiretModal(false);

    } catch (err) {
      console.error('Error updating dossier:', err);
      setToast({
        open: true,
        message: err.response?.data?.message || err.message || 'Erreur lors de la mise à jour',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en attente':
        return 'warning';
      case 'payé':
        return 'info';
      case 'a traité':
        return 'warning';
      case 'en traitement':
        return 'primary';
      case 'traité':
        return 'success';
      default:
        return 'default';
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

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRefresh = () => {
    fetchDossiers();
  };

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
          Gestion des Dossiers Clients
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="en attente">En attente</MenuItem>
              <MenuItem value="payé">Payé</MenuItem>
              <MenuItem value="a traité">À traiter</MenuItem>
              <MenuItem value="en traitement">En traitement</MenuItem>
              <MenuItem value="traité">Traité</MenuItem>
            </Select>

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
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
      ) : dossiers.length === 0 ? (
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
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Client</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Entreprise</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SIRET</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Crée le</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dossiers.map((dossier) => (
                    <TableRow 
                      key={dossier._id}
                      hover
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f8f9fa' },
                        '&:last-child td': { borderBottom: 0 }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32,
                            backgroundColor: '#f4d47c',
                            color: '#1e3a8a'
                          }}>
                            {dossier.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {dossier.user?.name || 'Non spécifié'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {dossier.user?.email || 'Non spécifié'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {dossier.nomEntreprise || dossier.entreprise?.nom || 'Non spécifié'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {dossier.domiciliation || dossier.entreprise?.adresse || 'Non renseigné'}
                        </Typography>
                      </TableCell>
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
                          color={getStatusColor(dossier.statut)}
                          size="small"
                          icon={statusConfig[dossier.statut]?.icon}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dossier.siret || dossier.entreprise?.siret || 'Non renseigné'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {format(new Date(dossier.createdAt), 'dd/MM/yyyy', { locale: fr })}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Voir les fichiers">
                            <IconButton
                              color="primary"
                              onClick={() => handleViewFiles(dossier)}
                              size="small"
                              sx={{
                                backgroundColor: '#e6f0ff',
                                '&:hover': {
                                  backgroundColor: '#d0e0ff'
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {dossier.statut !== 'traité' && (
                            <>
                              <Tooltip title="Marquer comme traité">
                                <IconButton
                                  color="success"
                                  onClick={() => handleStatusUpdateClick(dossier)}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#e6f7e6',
                                    '&:hover': {
                                      backgroundColor: '#d0f0d0'
                                    }
                                  }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Ajouter SIRET/Domiciliation">
                                <IconButton
                                  color="secondary"
                                  onClick={() => handleAddSiret(dossier)}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#f0e6ff',
                                    '&:hover': {
                                      backgroundColor: '#e0d0ff'
                                    }
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
                Dossiers par page:
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
              {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalDossiers)} sur ${totalDossiers} dossiers`}
            </Typography>
          </Box>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 2,
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1e3a8a', 
          color: 'white',
          borderRadius: '8px 8px 0 0',
          margin: -2,
          marginBottom: 0,
          padding: 2
        }}>
          Confirmer le changement de statut
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 3 }}>
          <Typography>
            Êtes-vous sûr de vouloir marquer ce dossier comme "Traité" ?
          </Typography>
          {selectedDossierForStatus && (
            <Box sx={{ 
              backgroundColor: '#f8f9fa', 
              p: 2, 
              borderRadius: 1,
              mt: 2
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Détails du dossier:
              </Typography>
              <Typography variant="body2">
                Client: {selectedDossierForStatus.user?.name || 'Non spécifié'}
              </Typography>
              <Typography variant="body2">
                Entreprise: {selectedDossierForStatus.nomEntreprise || selectedDossierForStatus.entreprise?.nom || 'Non spécifié'}
              </Typography>
              <Typography variant="body2">
                Type: {getDetailedType(selectedDossierForStatus)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
          <Button 
            onClick={() => setConfirmationOpen(false)}
            variant="outlined"
            sx={{
              color: '#1e3a8a',
              borderColor: '#1e3a8a',
              '&:hover': {
                borderColor: '#1e3a8a',
                backgroundColor: '#f0f4f8'
              }
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={() => handleUpdateStatus(selectedDossierForStatus)}
            variant="contained"
            disabled={isSaving}
            sx={{
              backgroundColor: '#1e3a8a',
              '&:hover': {
                backgroundColor: '#152c5e'
              }
            }}
          >
            {isSaving ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* File Viewer Modal */}
      <FileViewerModal
        open={openFileModal}
        onClose={() => setOpenFileModal(false)}
        dossier={selectedDossier}
      />

      {/* SIRET/Domiciliation Modal */}
      <Dialog 
        open={openSiretModal} 
        onClose={() => setOpenSiretModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1e3a8a', 
          color: 'white',
          borderRadius: '8px 8px 0 0'
        }}>
          Informations de l'entreprise
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Nom de l'entreprise"
              value={siretData.nomEntreprise}
              onChange={(e) => setSiretData({ ...siretData, nomEntreprise: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
              required
            />
            
            <TextField
              label="Numéro SIRET"
              value={siretData.siret}
              onChange={(e) => setSiretData({ ...siretData, siret: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
              required
              placeholder="123 456 789 00012"
            />
            
            <TextField
              label="Adresse de domiciliation"
              value={siretData.domiciliation}
              onChange={(e) => setSiretData({ ...siretData, domiciliation: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
              required
              multiline
              rows={3}
            />
            
            <TextField
              label="URL du logo (optionnel)"
              value={siretData.logo}
              onChange={(e) => setSiretData({ ...siretData, logo: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
              placeholder="https://example.com/logo.png"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
          <Button 
            onClick={() => setOpenSiretModal(false)}
            variant="outlined"
            sx={{
              color: '#1e3a8a',
              borderColor: '#1e3a8a',
              '&:hover': {
                borderColor: '#1e3a8a',
                backgroundColor: '#f0f4f8'
              }
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSiretSubmit}
            variant="contained"
            disabled={!siretData.siret || !siretData.domiciliation || !siretData.nomEntreprise || isSaving}
            sx={{
              backgroundColor: '#1e3a8a',
              '&:hover': {
                backgroundColor: '#152c5e'
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0'
              }
            }}
          >
            {isSaving ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Enregistrement...
              </>
            ) : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

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
          {toast.severity === 'success' ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <DescriptionIcon fontSize="small" />
          )}
          <Typography variant="body2">
            {toast.message}
          </Typography>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default AdminEntreprises;