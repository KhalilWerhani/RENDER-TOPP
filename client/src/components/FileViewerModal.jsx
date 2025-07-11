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
  TableRow
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CreditCard as CreditCardIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const FileViewerModal = ({ open, onClose, dossier }) => {
  if (!dossier) return null;

  const statusConfig = {
    "en attente": {
      color: "bg-amber-50 text-amber-800 border-amber-200",
      icon: <CheckCircleIcon color="warning" />,
      label: "En Attente"
    },
    "payé": {
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: <CreditCardIcon color="success" />,
      label: "Payé"
    },
    "a traité": {
      color: "bg-gray-50 text-gray-800 border-gray-200",
      icon: <DescriptionIcon color="action" />,
      label: "À Traiter"
    },
    "en traitement": {
      color: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <CheckCircleIcon color="info" />,
      label: "En Traitement"
    },
    "traité": {
      color: "bg-purple-50 text-purple-800 border-purple-200",
      icon: <CheckCircleIcon color="success" />,
      label: "Traité"
    }
  };

  // Updated type colors mapping
  const typeColors = {
    // Creation types
    "Création": "primary",
    "SAS": "primary",
    "SASU": "primary",
    "SARL": "primary",
    "EURL": "primary",
    "SCI": "primary",
    "AUTO-ENTREPRENEUR": "primary",
    "Entreprise individuelle": "primary",
    "Association": "primary",
    
    // Modification types
    "Modification": "secondary",
    "TRANSFERT_SIEGE": "secondary",
    "CHANGEMENT_DENOMINATION": "secondary",
    "CHANGEMENT_PRESIDENT": "secondary",
    "CHANGEMENT_ACTIVITE": "secondary",
    "TRANSFORMATION_SARL_EN_SAS": "secondary",
    "TRANSFORMATION_SAS_EN_SARL": "secondary",
    
    // Closure types
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

  const renderCreationDetails = () => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Détails de la création {dossier.type}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Type de création</TableCell>
              <TableCell>{getTypeLabel(dossier.type)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'entreprise</TableCell>
              <TableCell>{dossier.nomEntreprise}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Forme sociale</TableCell>
              <TableCell>{dossier.formeSociale || dossier.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>SIRET</TableCell>
              <TableCell>{dossier.siret || dossier.entreprise?.siret || 'Non renseigné'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Domiciliation</TableCell>
              <TableCell>{dossier.domiciliation || dossier.entreprise?.adresse || 'Non renseigné'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Bénéficiaire effectif</TableCell>
              <TableCell>{dossier.beneficiaireEffectif ? 'Oui' : 'Non'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Créé avec TOP</TableCell>
              <TableCell>{dossier.createdWithTop ? 'Oui' : 'Non'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Entreprise artisanale</TableCell>
              <TableCell>{dossier.artisanale ? 'Oui' : 'Non'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );

  const renderModificationDetails = () => {
    if (dossier.type === 'TRANSFORMATION_SARL_EN_SAS') {
      return (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Détails de la transformation SARL en SAS</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type de modification</TableCell>
                  <TableCell>{getTypeLabel(dossier.type)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Forme sociale actuelle</TableCell>
                  <TableCell>SARL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nouvelle forme sociale</TableCell>
                  <TableCell>SAS</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date de modification prévue</TableCell>
                  <TableCell>{dossier.modificationDate || 'Non spécifiée'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'entreprise</TableCell>
                  <TableCell>{dossier.nomEntreprise}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>SIRET</TableCell>
                  <TableCell>{dossier.siret}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Domiciliation</TableCell>
                  <TableCell>{dossier.domiciliation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bénéficiaire effectif</TableCell>
                  <TableCell>{dossier.beneficiaireEffectif ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statuts modifiés</TableCell>
                  <TableCell>{dossier.modifiedStatuts ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      );
    } else if (dossier.type === 'TRANSFORMATION_SAS_EN_SARL') {
      return (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Détails de la transformation SAS en SARL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type de modification</TableCell>
                  <TableCell>{getTypeLabel(dossier.type)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Forme sociale actuelle</TableCell>
                  <TableCell>SAS</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nouvelle forme sociale</TableCell>
                  <TableCell>SARL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date de modification prévue</TableCell>
                  <TableCell>{dossier.modificationDate || 'Non spécifiée'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'entreprise</TableCell>
                  <TableCell>{dossier.nomEntreprise}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>SIRET</TableCell>
                  <TableCell>{dossier.siret}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Domiciliation</TableCell>
                  <TableCell>{dossier.domiciliation}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      );
    } else if ([
      'TRANSFERT_SIEGE',
      'CHANGEMENT_DENOMINATION',
      'CHANGEMENT_PRESIDENT',
      'CHANGEMENT_ACTIVITE'
    ].includes(dossier.type)) {
      return (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Détails de la modification</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type de modification</TableCell>
                  <TableCell>{getTypeLabel(dossier.type)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Forme sociale</TableCell>
                  <TableCell>{dossier.formeSociale}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date de modification</TableCell>
                  <TableCell>{dossier.modificationDate}</TableCell>
                </TableRow>
                {dossier.type === 'TRANSFERT_SIEGE' && dossier.adresseNouvelle && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nouvelle adresse</TableCell>
                    <TableCell>{dossier.adresseNouvelle}</TableCell>
                  </TableRow>
                )}
                {dossier.type === 'CHANGEMENT_DENOMINATION' && dossier.nouveauNom && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nouveau nom</TableCell>
                    <TableCell>{dossier.nouveauNom}</TableCell>
                  </TableRow>
                )}
                {dossier.type === 'CHANGEMENT_PRESIDENT' && dossier.nouveauPresident && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nouveau président</TableCell>
                    <TableCell>{`${dossier.nouveauPresident.prenom} ${dossier.nouveauPresident.nom}`}</TableCell>
                  </TableRow>
                )}
                {dossier.type === 'CHANGEMENT_ACTIVITE' && dossier.nouvelleActivite && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nouvelle activité</TableCell>
                    <TableCell>{dossier.nouvelleActivite}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bénéficiaire effectif</TableCell>
                  <TableCell>{dossier.beneficiaireEffectif ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statuts modifiés</TableCell>
                  <TableCell>{dossier.modifiedStatuts ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      );
    }
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
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Détails de la fermeture</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Type de fermeture</TableCell>
                <TableCell>{closureTypes[dossier.type] || dossier.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Forme sociale</TableCell>
                <TableCell>{dossier.formeSociale}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nom de l'entreprise</TableCell>
                <TableCell>{dossier.nomEntreprise}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>SIRET</TableCell>
                <TableCell>{dossier.siret}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date de fermeture</TableCell>
                <TableCell>{dossier.modificationDate || 'Non spécifiée'}</TableCell>
              </TableRow>
              {dossier.typeFermeture && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Motif de fermeture</TableCell>
                  <TableCell>{dossier.typeFermeture}</TableCell>
                </TableRow>
              )}
              {dossier.timing && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Échéance</TableCell>
                  <TableCell>{dossier.timing}</TableCell>
                </TableRow>
              )}
              {dossier.observations && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Observations</TableCell>
                  <TableCell>{dossier.observations}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderDossierSpecificDetails = () => {
    // Creation types
    if ([
      'SAS', 'SASU', 'SARL', 'EURL', 'SCI', 
      'AUTO-ENTREPRENEUR', 'Entreprise individuelle', 'Association'
    ].includes(dossier.type)) {
      return renderCreationDetails();
    }
    
    // Modification types
    if ([
      'TRANSFERT_SIEGE', 'CHANGEMENT_DENOMINATION', 'CHANGEMENT_PRESIDENT',
      'CHANGEMENT_ACTIVITE', 'TRANSFORMATION_SARL_EN_SAS', 'TRANSFORMATION_SAS_EN_SARL'
    ].includes(dossier.type)) {
      return renderModificationDetails();
    }
    
    // Closure types
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
        <Typography variant="h6" gutterBottom>
          Questionnaire
        </Typography>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Voir les réponses du questionnaire</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
              <Table size="small">
                <TableBody>
                  {Object.entries(dossier.questionnaire).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{key}</TableCell>
                      <TableCell>{renderQuestionValue(value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Chip
            label={getTypeLabel(dossier.type)}
            color={typeColors[dossier.type] || 'default'}
            size="small"
            sx={{ mr: 2 }}
          />
          Dossier: {dossier.codeDossier}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Informations du dossier
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Client: {dossier.user?.name || 'Non spécifié'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Créé le: {new Date(dossier.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  {statusConfig[dossier.statut]?.icon}
                  <Chip
                    label={statusConfig[dossier.statut]?.label || dossier.statut}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                <Typography variant="subtitle1" gutterBottom>
                  BO Affecté
                </Typography>
                {dossier.boAffecte ? (
                  <>
                    <Typography variant="body2">
                      {dossier.boAffecte.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dossier.boAffecte.email}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Non affecté
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {renderDossierSpecificDetails()}
        {renderQuestionnaireSection()}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Fichiers uploadés par le client
        </Typography>
        {(!dossier.fichiers || dossier.fichiers.length === 0) ? (
          <Typography variant="body2" color="textSecondary">
            Aucun fichier uploadé par le client
          </Typography>
        ) : (
          <List dense>
            {dossier.fichiers.map((file, index) => (
              <ListItem 
                key={index}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    href={file.url} 
                    target="_blank"
                    download
                  >
                    <DownloadIcon />
                  </IconButton>
                }
                sx={{
                  border: '1px solid #eee',
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary={file.filename || `Fichier ${index + 1}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Documents générés par le BO
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fonctionnalité à implémenter - documents stockés dans Document.js
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerModal;