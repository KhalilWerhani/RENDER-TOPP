import React from 'react';
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
  Divider,
  Chip,
  Box,
  IconButton,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const FileViewerModal = ({ open, onClose, dossier }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!dossier) return null;

  // Status configuration
  const statusConfig = {
    "en attente": {
      color: "warning",
      icon: <CheckCircleIcon color="warning" />,
      label: "En Attente"
    },
    "payé": {
      color: "success",
      icon: <CreditCardIcon color="success" />,
      label: "Payé"
    },
    "a traité": {
      color: "info",
      icon: <DescriptionIcon color="info" />,
      label: "À Traiter"
    },
    "en traitement": {
      color: "primary",
      icon: <CheckCircleIcon color="primary" />,
      label: "En Traitement"
    },
    "traité": {
      color: "secondary",
      icon: <CheckCircleIcon color="secondary" />,
      label: "Traité"
    }
  };

  // Type colors mapping
  const typeColors = {
    "Création": "primary",
    "SAS": "primary",
    "SASU": "primary",
    "SARL": "primary",
    "EURL": "primary",
    "SCI": "primary",
    "AUTO-ENTREPRENEUR": "primary",
    "Entreprise individuelle": "primary",
    "Association": "primary",
    "Modification": "secondary",
    "TRANSFERT_SIEGE": "secondary",
    "CHANGEMENT_DENOMINATION": "secondary",
    "CHANGEMENT_PRESIDENT": "secondary",
    "CHANGEMENT_ACTIVITE": "secondary",
    "TRANSFORMATION_SARL_EN_SAS": "secondary",
    "TRANSFORMATION_SAS_EN_SARL": "secondary",
    "Fermeture": "error",
    "DISSOLUTION_LIQUIDATION": "error",
    "MISE_EN_SOMMEIL": "error",
    "RADIATION_AUTO_ENTREPRENEUR": "error",
    "Radiation auto-entrepreneur": "error",
    "Dépôt de bilan": "error",
    "Dépôt de marque": "error"
  };

  const getTypeLabel = (type) => {
    const labels = {
      "SAS": "Création SAS",
      "SASU": "Création SASU",
      "SARL": "Création SARL",
      "EURL": "Création EURL",
      "SCI": "Création SCI",
      "AUTO-ENTREPRENEUR": "Création Auto-entrepreneur",
      "Entreprise individuelle": "Création Entreprise Individuelle",
      "Association": "Création Association",
      "TRANSFERT_SIEGE": "Transfert de siège",
      "CHANGEMENT_DENOMINATION": "Changement de dénomination",
      "CHANGEMENT_PRESIDENT": "Changement de président",
      "CHANGEMENT_ACTIVITE": "Changement d'activité",
      "TRANSFORMATION_SARL_EN_SAS": "Transformation SARL → SAS",
      "TRANSFORMATION_SAS_EN_SARL": "Transformation SAS → SARL",
      "DISSOLUTION_LIQUIDATION": "Dissolution & Liquidation",
      "MISE_EN_SOMMEIL": "Mise en sommeil",
      "RADIATION_AUTO_ENTREPRENEUR": "Radiation auto-entrepreneur",
      "Radiation auto-entrepreneur": "Radiation auto-entrepreneur",
      "Dépôt de bilan": "Dépôt de bilan",
      "Dépôt de marque": "Dépôt de marque"
    };
    return labels[type] || type;
  };

  const renderQuestionValue = (value) => {
    if (value === null || value === undefined) return 'Non renseigné';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value.toString();
  };

  // Styled Accordion component
  const StyledAccordion = ({ title, children, defaultExpanded = true }) => (
    <Accordion 
      defaultExpanded={defaultExpanded}
      sx={{
        mb: 2,
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '8px !important',
        '&:before': { display: 'none' }
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center">
          <AssignmentIcon color="action" sx={{ mr: 1.5 }} />
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );

  const renderCreationDetails = () => (
    <StyledAccordion title={`Détails de la création ${dossier.type}`}>
      <Table size="small">
        <TableBody>
          {[
            { label: "Type de création", value: getTypeLabel(dossier.type) },
            { label: "Nom de l'entreprise", value: dossier.nomEntreprise },
            { label: "Forme sociale", value: dossier.formeSociale || dossier.type },
            { label: "SIRET", value: dossier.siret || dossier.entreprise?.siret || 'Non renseigné' },
            { label: "Domiciliation", value: dossier.domiciliation || dossier.entreprise?.adresse || 'Non renseigné' },
            { label: "Bénéficiaire effectif", value: dossier.beneficiaireEffectif ? 'Oui' : 'Non' },
            { label: "Créé avec TOP", value: dossier.createdWithTop ? 'Oui' : 'Non' },
            { label: "Entreprise artisanale", value: dossier.artisanale ? 'Oui' : 'Non' }
          ].map((row, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontWeight: 'bold', width: isMobile ? '40%' : '30%', bgcolor: 'grey.50' }}>
                {row.label}
              </TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledAccordion>
  );

  const renderModificationDetails = () => {
    if (dossier.type === 'TRANSFORMATION_SARL_EN_SAS') {
      return (
        <StyledAccordion title="Détails de la transformation SARL en SAS">
          <Table size="small">
            <TableBody>
              {[
                { label: "Type de modification", value: getTypeLabel(dossier.type) },
                { label: "Forme sociale actuelle", value: "SARL" },
                { label: "Nouvelle forme sociale", value: "SAS" },
                { label: "Date de modification", value: dossier.modificationDate || 'Non spécifiée' },
                { label: "Nom de l'entreprise", value: dossier.nomEntreprise },
                { label: "SIRET", value: dossier.siret },
                { label: "Domiciliation", value: dossier.domiciliation },
                { label: "Bénéficiaire effectif", value: dossier.beneficiaireEffectif ? 'Oui' : 'Non' },
                { label: "Statuts modifiés", value: dossier.modifiedStatuts ? 'Oui' : 'Non' }
              ].map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 'bold', width: isMobile ? '40%' : '30%', bgcolor: 'grey.50' }}>
                    {row.label}
                  </TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledAccordion>
      );
    }
    // Add other modification types as needed
    return null;
  };

  const renderClosureDetails = () => {
    const closureTypes = {
      'DISSOLUTION_LIQUIDATION': 'Dissolution et liquidation',
      'MISE_EN_SOMMEIL': 'Mise en sommeil',
      'RADIATION_AUTO_ENTREPRENEUR': 'Radiation auto-entrepreneur',
      'Radiation auto-entrepreneur': 'Radiation auto-entrepreneur',
      'Dépôt de bilan': 'Dépôt de bilan',
      'Dépôt de marque': 'Dépôt de marque'
    };

    return (
      <StyledAccordion title="Détails de la fermeture">
        <Table size="small">
          <TableBody>
            {[
              { label: "Type de fermeture", value: closureTypes[dossier.type] || dossier.type },
              { label: "Forme sociale", value: dossier.formeSociale },
              { label: "Nom de l'entreprise", value: dossier.nomEntreprise },
              { label: "SIRET", value: dossier.siret },
              { label: "Date de fermeture", value: dossier.modificationDate || 'Non spécifiée' },
              ...(dossier.typeFermeture ? [{ label: "Motif de fermeture", value: dossier.typeFermeture }] : []),
              ...(dossier.timing ? [{ label: "Échéance", value: dossier.timing }] : []),
              ...(dossier.observations ? [{ label: "Observations", value: dossier.observations }] : [])
            ].map((row, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ fontWeight: 'bold', width: isMobile ? '40%' : '30%', bgcolor: 'grey.50' }}>
                  {row.label}
                </TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledAccordion>
    );
  };

  const renderDossierSpecificDetails = () => {
    if ([
      'SAS', 'SASU', 'SARL', 'EURL', 'SCI', 
      'AUTO-ENTREPRENEUR', 'Entreprise individuelle', 'Association'
    ].includes(dossier.type)) {
      return renderCreationDetails();
    }
    
    if ([
      'TRANSFERT_SIEGE', 'CHANGEMENT_DENOMINATION', 'CHANGEMENT_PRESIDENT',
      'CHANGEMENT_ACTIVITE', 'TRANSFORMATION_SARL_EN_SAS', 'TRANSFORMATION_SAS_EN_SARL'
    ].includes(dossier.type)) {
      return renderModificationDetails();
    }
    
    if ([
      'DISSOLUTION_LIQUIDATION', 'MISE_EN_SOMMEIL', 'RADIATION_AUTO_ENTREPRENEUR',
      'Radiation auto-entrepreneur', 'Dépôt de bilan', 'Dépôt de marque'
    ].includes(dossier.type)) {
      return renderClosureDetails();
    }
    
    return null;
  };

  const renderQuestionnaireSection = () => {
    if (!dossier.questionnaire || Object.keys(dossier.questionnaire).length === 0) {
      return (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Aucun questionnaire disponible
        </Typography>
      );
    }

    return (
      <>
        <Divider sx={{ my: 2 }} />
        <StyledAccordion title="Questionnaire">
          <Table size="small">
            <TableBody>
              {Object.entries(dossier.questionnaire).map(([key, value]) => (
                <TableRow key={key} hover>
                  <TableCell sx={{ fontWeight: 'bold', width: isMobile ? '40%' : '30%', bgcolor: 'grey.50' }}>
                    {key}
                  </TableCell>
                  <TableCell>{renderQuestionValue(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledAccordion>
      </>
    );
  };

  const renderFileList = (files, title, emptyMessage) => (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <DescriptionIcon color="primary" sx={{ mr: 1 }} />
        {title}
      </Typography>
      {(!files || files.length === 0) ? (
        <Typography variant="body2" color="textSecondary" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          {emptyMessage}
        </Typography>
      ) : (
        <List dense sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
          {files.map((file, index) => (
            <ListItem 
              key={index}
              secondaryAction={
                <Tooltip title="Télécharger">
                  <IconButton edge="end" href={file.url} target="_blank" download>
                    <DownloadIcon color="primary" />
                  </IconButton>
                </Tooltip>
              }
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.200' }}>
                  <DescriptionIcon fontSize="small" color="action" />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={file.filename || file.titre || `Document ${index + 1}`}
                primaryTypographyProps={{ fontWeight: 'medium' }}
                secondary={file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{ sx: { borderRadius: isMobile ? 0 : '12px' } }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        py: 2,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box display="flex" alignItems="center">
          <Chip
            label={getTypeLabel(dossier.type)}
            sx={{ 
              mr: 2,
              color: 'white',
              bgcolor: typeColors[dossier.type] || 'grey.700',
              fontWeight: 'bold'
            }}
            size="small"
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Dossier: {dossier.codeDossier}
          </Typography>
        </Box>
        <IconButton edge="end" onClick={onClose} sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: isMobile ? 1 : 3 }}>
        {/* Client and BO Info Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Informations du client
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
                  {dossier.user?.name?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {dossier.user?.name || 'Non spécifié'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {dossier.user?.email || 'Non spécifié'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {statusConfig[dossier.statut]?.icon}
                <Chip
                  label={statusConfig[dossier.statut]?.label || dossier.statut}
                  size="small"
                  sx={{ ml: 1, fontWeight: 'bold' }}
                  color={statusConfig[dossier.statut]?.color || 'default'}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Informations de l'entreprise
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight="medium">
                  {dossier.nomEntreprise || dossier.entreprise?.nom || 'Non spécifié'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SIRET: {dossier.siret || dossier.entreprise?.siret || 'Non renseigné'}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="medium">
                  Domiciliation:
                </Typography>
                <Typography variant="body2">
                  {dossier.domiciliation || dossier.entreprise?.adresse || 'Non renseigné'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {renderDossierSpecificDetails()}
        {renderQuestionnaireSection()}
        {renderFileList(dossier.fichiers, 'Fichiers uploadés par le client', 'Aucun fichier uploadé par le client')}
        {renderFileList(dossier.fichiersbo, 'Documents générés par le BO', 'Aucun document généré par le BO')}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ borderRadius: '8px', textTransform: 'none', px: 3, py: 1 }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerModal;