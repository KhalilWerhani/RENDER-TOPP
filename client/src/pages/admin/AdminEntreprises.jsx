import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
   
} from '@mui/material';
import { Snackbar } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  CreditCard as CreditCardIcon,  // Ajoutez cette ligne
  Person as PersonIcon,          // Ajoutez cette ligne
  CalendarToday as CalendarIcon  ,
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
    logo: ''
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);
const [selectedDossierForStatus, setSelectedDossierForStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalDossiers, setTotalDossiers] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
const [toast, setToast] = useState({
  open: false,
  message: '',
  severity: 'success' // can be 'success', 'error', etc.
});
  const statusConfig = {
  "en attente": {
    color: "default",
    icon: <CheckCircleIcon color="warning" />,
    label: "En Attente"
  },
  "payé": {
    color: "primary",
    icon: <CreditCardIcon color="success" />,
    label: "Payé"
  },
  "a traité": {
    color: "warning",
    icon: <DescriptionIcon color="action" />,
    label: "À Traiter"
  },
  "en traitement": {
    color: "info",
    icon: <CheckCircleIcon color="info" />,
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
  // Handle modification types
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
        type: typeFilter !== 'all' ? typeFilter : undefined
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
  }, [page, pageSize, statusFilter, typeFilter]);

  const handleViewFiles = async (dossier) => {
  try {
    if (!dossier?._id) {
      throw new Error('Dossier invalide: ID manquant');
    }

    // Use a single endpoint that handles all types
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
      url = `/api/dossiers/modifications/${dossier._id}/update-status`;
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
    
    // Validate required fields
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

    // Group all modification types together
    if (selectedDossier.type === 'Création') {
      endpoint = `/api/admin/dossiers/${selectedDossier._id}`;
    } else if (selectedDossier.type === 'Fermeture') {
      endpoint = `/api/admin/fermetures/${selectedDossier._id}`;
    } else {
      // Handle all modification types (CHANGEMENT_ACTIVITE, TRANSFORMATION_SARL_EN_SAS, etc.)
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
        return 'default';
      case 'payé':
        return 'primary';
      case 'a traité':
        return 'warning';
      case 'en traitement':
        return 'info';
      case 'traité':
        return 'success';
      default:
        return 'default';
    }
  };

 const getTypeColor = (type) => {
  // If type includes "Création", extract the actual type
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Dossiers Clients
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      // Update your type filter select component
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
        <Select
  value={typeFilter}
  onChange={(e) => setTypeFilter(e.target.value)}
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
        <Typography>Aucun dossier trouvé</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
<TableHead>
  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
    <TableCell>Client</TableCell>
    <TableCell>Email</TableCell>
    <TableCell>Nom Entreprise</TableCell> {/* Add this */}
    <TableCell>Code Dossier</TableCell>
    <TableCell>Type</TableCell>
    <TableCell>Statut</TableCell>
    <TableCell>SIRET</TableCell>
    <TableCell>Domiciliation</TableCell>
    <TableCell>BO Affecté</TableCell>
    <TableCell>Créé le</TableCell>
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>
              <TableBody>
                {dossiers.map((dossier) => (
             <TableRow key={dossier._id}>
  <TableCell>{dossier.user?.name || 'Non spécifié'}</TableCell>
  <TableCell>{dossier.user?.email || 'Non spécifié'}</TableCell>
  <TableCell>{dossier.nomEntreprise || dossier.entreprise?.nom || 'Non spécifié'}</TableCell>
  <TableCell>{dossier.codeDossier}</TableCell>
  <TableCell>
    <Chip
      label={getDetailedType(dossier)}
      color={getTypeColor(dossier.questionnaire?.entrepriseType || dossier.typeFermeture || dossier.type)}
      size="small"
    />
  </TableCell>
  <TableCell>
    <Chip
      label={dossier.statut}
      color={getStatusColor(dossier.statut)}
      size="small"
    />
  </TableCell>
  <TableCell>{dossier.siret || dossier.entreprise?.siret || 'Non renseigné'}</TableCell>
  <TableCell>{dossier.domiciliation || dossier.entreprise?.adresse || 'Non renseigné'}</TableCell>
  <TableCell>{dossier.boAffecte?.name || 'Non affecté'}</TableCell>
  <TableCell>
    {format(new Date(dossier.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
  </TableCell>
  <TableCell>
  <Box sx={{ display: 'flex', gap: 1 }}>
    <Tooltip title="Voir les fichiers">
      <IconButton
        color="primary"
        onClick={() => handleViewFiles(dossier)}
        size="small"
      >
        <VisibilityIcon />
      </IconButton>
    </Tooltip>
    
    {dossier.statut !== 'traité' && (
      <>
     <Tooltip title="Marquer comme traité">
  <Button
    variant="contained"
    color="success"
    size="small"
    startIcon={<CheckCircleIcon />}
    onClick={() => handleStatusUpdateClick(dossier)}
    disabled={isSaving}
    sx={{
      textTransform: 'none',
      borderRadius: '8px',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: '#2e7d32',
        boxShadow: 'none'
      }
    }}
  >
    Traité
  </Button>
</Tooltip>
        
        <Tooltip title="Ajouter SIRET/Domiciliation">
          <IconButton
            color="secondary"
            onClick={() => handleAddSiret(dossier)}
            size="small"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </>
    )}
    
    {dossier.statut === 'traité' && (
      <Tooltip title="Dossier traité">
        <CheckCircleIcon color="success" />
      </Tooltip>
    )}
  </Box>
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
              onChange={(e) => setPageSize(e.target.value)}
              size="small"
              sx={{ width: 120 }}
            >
              <MenuItem value={5}>5 par page</MenuItem>
              <MenuItem value={10}>10 par page</MenuItem>
              <MenuItem value={25}>25 par page</MenuItem>
              <MenuItem value={50}>50 par page</MenuItem>
            </Select>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Précédent
              </Button>
              <Button
                disabled={page * pageSize >= totalDossiers}
                onClick={() => setPage(p => p + 1)}
              >
                Suivant
              </Button>
            </Box>
          </Box>
        </>
      )}
      {/* Confirmation Dialog */}
<Dialog
  open={confirmationOpen}
  onClose={() => setConfirmationOpen(false)}
>
  <DialogTitle>Confirmer le changement de statut</DialogTitle>
  <DialogContent>
    <Typography>
      Êtes-vous sûr de vouloir marquer ce dossier comme "Traité" ?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmationOpen(false)}>Annuler</Button>
    <Button
      onClick={() => handleUpdateStatus(selectedDossierForStatus)}
      color="success"
      variant="contained"
      disabled={isSaving}
    >
      {isSaving ? 'En cours...' : 'Confirmer'}
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
      <Dialog open={openSiretModal} onClose={() => setOpenSiretModal(false)}>
        <DialogTitle>Ajouter les informations d'entreprise</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom de l'entreprise"
              value={siretData.nomEntreprise}
              onChange={(e) => setSiretData({ ...siretData, nomEntreprise: e.target.value })}
              fullWidth
            />
            <TextField
              label="Numéro SIRET"
              value={siretData.siret}
              onChange={(e) => setSiretData({ ...siretData, siret: e.target.value })}
              fullWidth
            />
            <TextField
              label="Domiciliation"
              value={siretData.domiciliation}
              onChange={(e) => setSiretData({ ...siretData, domiciliation: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="URL du logo"
              value={siretData.logo}
              onChange={(e) => setSiretData({ ...siretData, logo: e.target.value })}
              fullWidth
            />
          </Box>
          {/* Success Toast */}

<Snackbar
  open={toast.open}
  autoHideDuration={6000}
  onClose={() => setToast({...toast, open: false})}
  message={toast.message}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  ContentProps={{
    style: {
      backgroundColor: toast.severity === 'success' ? '#4caf50' : '#f44336',
      color: 'white'
    }
  }}
/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSiretModal(false)}>Annuler</Button>
          <Button
  onClick={handleSiretSubmit}
  variant="contained"
  disabled={!siretData.siret || !siretData.domiciliation || !siretData.nomEntreprise || isSaving}
  startIcon={isSaving ? <CircularProgress size={20} /> : null}
>
  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEntreprises;