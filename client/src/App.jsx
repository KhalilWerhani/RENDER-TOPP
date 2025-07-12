import { Routes, Route , Navigate  } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Public pages
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import MentionsLegales from './pages/Other-informations/MentionsLegales';
import ConditionsGenerales from './pages/Other-informations/ConditionsGenerales';

// Paiement
import Paiement from './pages/Paiements/Paiement';
import PaimentModification from './pages/Paiements/PaimentModification';
import PaiementSuccess from './pages/Paiements/PaiementSuccess';
import PaiementCancelled from './pages/Paiements/PaiementCancelled';

// Private access
import PrivateRoute from './components/PrivateRoute';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBOList from './pages/admin/AdminBOList';
import User from './pages/admin/User';
import UserFiche from './pages/admin/UserFiche';
import BOFiche from './pages/admin/BOFiche';
import DocumentsAdmin from './pages/DocumentsAdmin';
import UserTable from './pages/UserTable';
import AdminKanban from './pages/admin/AdminKanban';
import PageDossier from './pages/admin/PageDossier';
import ListeProjetsClient from './pages/admin/ListeProjetsClient';

import ListeProjetsBo from './pages/admin/ListeProjetsBo';
import AdminPaiements from './pages/admin/AdminPaiements';



// BO
import BOLayout from './pages/bo/BOLayout';
import DashboardBO from './pages/bo/DashboardBO';
import EntrepriseTable from './pages/EntrepriseTable';
import Calendrier from './components/Calendrier';
import Documents from './pages/Documents';

// Client
import HomePage from './pages/HomePage';
import Profile from './pages/Profile-component/Profil';
import FormProject from './pages/FormProject';
import FormEntreprise from './pages/FormEntreprise';
import Proced from './pages/Test/Proced';
import GuideSarl from './pages/Guide-component/GuideSarl';
import GuideSas from './pages/Guide-component/GuideSas';
import GuideSasu from './pages/Guide-component/GuideSasu';
import GuideEurl from './pages/Guide-component/GuideEurl';
import GuideAutoEntrepreneur from './pages/Guide-component/GuideAutoEntrepreneur';
import DocumentModels from './pages/DocumentModels';
import AidesJuridiques from './pages/Test/AideJuridiques';
import Bilan from './pages/Bilan';
import Comptabilite from './pages/Comptabilite';
import FormAssociation from './pages/Type-Entreprises/FormAssociation';
import FormAutoEntrepreneur from './pages/Type-Entreprises/FormAutoEntrepreneur';
import FormEntrepriseIndividuelle from './pages/Type-Entreprises/FormEntrepriseIndividuelle';
import FormSci from './pages/Type-Entreprises/FormSci';
import TransfertSiegeSociale from './pages/Gerer-Entreprises/TransfertSiegeSociale';
import ChangementDenomination from './pages/Gerer-Entreprises/ChangementDenomination';
import ChangementPresident from './pages/Gerer-Entreprises/ChangementPresident';
import ChangementActivite from './pages/Gerer-Entreprises/ChangementActivite';
import TransformationSarlEnSas from './pages/Gerer-Entreprises/TransformationSarlEnSas';
import TransformationSasEnSarl from './pages/Gerer-Entreprises/TransformationSasEnSarl';
import FermerSociete from './pages/Gerer-Entreprises/FermerSociete';
import PageModificationWrapper from './components/PageModificationWrapper';


import DashboardUser from './pages/user/DashboardUser';
import FormSas from './pages/Type-Entreprises/FormSas';
import FormSasu from './pages/Type-Entreprises/FormSasu';
import FormSarl from './pages/Type-Entreprises/FormSarl';
import FormEurl from './pages/Type-Entreprises/FormEurl';
import LoadingWrapper from './components/LoadingWrapper';
import PaiementFermeture from './pages/Paiements/PaiementFermeture';
import Validation from './pages/Validation';
import DashboardLayout from './components/DashboardLayout';
import Project from './pages/user/Project';


import DossiersBO from './pages/bo/DossiersBO';
import DossierDetailBO from './pages/bo/DossierDetailBO';
import UserLayout from './pages/user/UserLayout';

import LoginModal from './components/LoginModal';


import MesPaiements from './pages/user/MesPaiements';
import UploadDocument from './pages/UploadDocument';
import ReceivedDocuments from './pages/ReceivedDocuments';
import UploadDocumentWrapper from './pages/UploadDocumentWrapper';
import PDossier from './pages/admin/PDossier';
import AdminMessages from './pages/admin/AdminMessages';
import AdminConversations from './pages/admin/AdminConversations';
import BOConversations from './pages/bo/BOConversations';
import BOMessages from './pages/bo/BOMessages';
import UserConversations from './pages/user/UserConversations';
import UserMessages from './pages/user/UserMessages';
import MiseEnSommeil from './pages/Gerer-Entreprises/MiseEnSomeil';

import AdminLeads from './pages/admin/AdminLeads';
import GererEntreprise from './pages/Gerer-Entreprises/GererEntreprise';
import FermerEntreprise from './pages/Gerer-Entreprises/FermerEntreprise';

import RadiationAutoEntrepreneur from './pages/Gerer-Entreprises/RadiationAutoEntrepreneur';
import SearchPage from './pages/admin/SearchPage';
import AdminEntreprises from './pages/admin/AdminEntreprises';
import UserEntreprise from './pages/user/UserEntreprise';



//messagerie 




const App = () => {


  return (
    <div>
      <ToastContainer />
      <LoginModal />

      <Routes>




        {/* 🔓 Public routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/" element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/form-project' element={<FormProject />} />
        <Route path='/modification/:type' element={<PageModificationWrapper />} />
        <Route path='/comptabilite' element={<Comptabilite />} />
        <Route path='/guide-sarl' element={<GuideSarl />} />
        <Route path='/guide-sas' element={<GuideSas />} />
        <Route path='/guide-sasu' element={<GuideSasu />} />
        <Route path='/guide-eurl' element={<GuideEurl />} />
        <Route path='/guide-auto-entrepreneur' element={<GuideAutoEntrepreneur />} />
        <Route path='/homepage' element={<HomePage />} />



        {/* Paiement (accessible sans authentification) */}
        <Route path='/paiement' element={<Paiement />} />
        <Route path="/paiement/:id" element={<Paiement />} />
        <Route path='/paiement-modification' element={<PaimentModification />} />
        <Route path="/paiement-modification/:id" element={<PaimentModification />} />
        <Route path="/paiement-fermeture" element={<PaiementFermeture />} />
        <Route path="/paiement-fermeture/:id" element={<PaiementFermeture />} />
        <Route path='/paiement/success' element={<PaiementSuccess />} />
        <Route path='/paiement/success/:id' element={<PaiementSuccess />} />
        <Route path='/paiement/cancel' element={<PaiementCancelled />} />
        <Route path="/validation" element={<Validation />} />





        {/* 🔐 Admin routes */}


        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard1' element={<AdminDashboard />} />
          <Route path='bo/liste' element={<AdminBOList />} />
          <Route path='clients' element={<UserTable />} />
          <Route path='documents' element={<DocumentsAdmin />} />
          <Route path='users' element={<User />} />
          <Route path='bo/:id' element={<BOFiche />} />
          <Route path='user/:id' element={<UserFiche />} />
          <Route path='dossiers' element={<AdminKanban />} />
          <Route path='dossier/:id' element={<PageDossier />} />
          <Route path='dossier/test' element={<PDossier />} />
          {/* <Route path="/admin/messages" element={<AdminMessages/>} />*/}
          <Route path="/admin/conversations" element={<AdminConversations />} />
          <Route path="/admin/messages/:userId" element={<AdminMessages />} />


          <Route path='dossiers/:clientId' element={<ListeProjetsClient />} />
          <Route path="bo/:boId/dossiers" element={<ListeProjetsBo />} />
          <Route path="paiements" element={<AdminPaiements />} />
          <Route path="uploadingdocadmin" element={<UploadDocument />} />
          <Route path="receiveddocadmin" element={<ReceivedDocuments />} />
          <Route path="leads" element={<AdminLeads />} />


        </Route>








        {/* 🔐 Admin routes */} 
        <Route path='/admin' element={<AdminLayout />}>
        <Route path='dashboard1' element={<AdminDashboard />} />
        <Route path='bo/liste' element={<AdminBOList />} />
        <Route path='clients' element={<UserTable />} />
        <Route path='documents' element={<DocumentsAdmin />} />
        <Route path='users' element={<User />} />
        <Route path='bo/:id' element={<BOFiche />} />
        <Route path='user/:id' element={<UserFiche />} />
        <Route path='dossiers' element={<AdminKanban />} />
        <Route path='dossier/:id' element={<PageDossier />} />
        <Route path='dossier/test' element={<PDossier />} />
        <Route path="/admin/messages" element={<AdminMessages/>} />
        <Route path="/admin/conversations" element={<AdminConversations />} />

            
        <Route path='dossiers/:clientId' element={<ListeProjetsClient />} />
        <Route path="bo/:boId/dossiers" element={<ListeProjetsBo />} />
        <Route path="paiements" element={<AdminPaiements />} />
        <Route path="uploadingdocadmin" element={<UploadDocument />} />
        <Route path="receiveddocadmin" element={<ReceivedDocuments />} />
        </Route>
       

        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard1' element={<AdminDashboard />} />
          <Route path='bo/liste' element={<AdminBOList />} />
          <Route path='clients' element={<UserTable />} />
          <Route path='documents' element={<DocumentsAdmin />} />
          <Route path='users' element={<User />} />
          <Route path='bo/:id' element={<BOFiche />} />
          <Route path='user/:id' element={<UserFiche />} />
          <Route path='dossiers' element={<AdminKanban />} />
          <Route path='dossier/:id' element={<PageDossier />} />
          <Route path='dossier/test' element={<PDossier />} />
          <Route path='dossiers/:clientId' element={<ListeProjetsClient />} />
          <Route path="bo/:boId/dossiers" element={<ListeProjetsBo />} />
          <Route path="paiements" element={<AdminPaiements />} />
          <Route path="uploadingdocadmin" element={<UploadDocument />} />
          <Route path="receiveddocadmin" element={<ReceivedDocuments />} />
          <Route path="envoyer-document" element={<UploadDocumentWrapper />} />
          <Route path="/admin/search" element={<SearchPage />} />
          <Route path="/admin/entreprises" element={<AdminEntreprises />} />
          <Route path="/admin/entreprises/:id" element={<AdminEntreprises />} />



          
        </Route>
        {/* 🔐 BO routes */}
        <Route element={<PrivateRoute allowedRoles={['BO']} />}>
          <Route path='/bo' element={<BOLayout />}>
            <Route path='dashboard' element={<DashboardBO />} />
            <Route path='entreprise' element={<EntrepriseTable />} />
            <Route path='calendrier' element={<Calendrier />} />
            <Route path='clients' element={<UserTable />} />
            <Route path='dossiers' element={<DossiersBO />} />
            <Route path='dossiers/:id' element={<DossierDetailBO />} />
            <Route path='documents' element={<Documents />} />
            <Route path="uploadingdocbo" element={<UploadDocument />} />
            <Route path="receiveddocbo" element={<ReceivedDocuments />} />
            <Route path="envoyer-document" element={<UploadDocumentWrapper />} />


            <Route path="/bo/conversations" element={<BOConversations />} />
            <Route path="/bo/messages/:userId" element={<BOMessages />} />


          </Route>
        </Route>
        {/* 🔐 Client routes
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          
        </Route>
 */}
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path='/homepage' element={<HomePage />} />
          <Route path='/documents' element={<Documents />} />
          <Route path='/profil' element={<Profile />} />
          <Route path='/form-project' element={<FormProject />} />
          <Route path='/form-entreprise' element={<FormEntreprise />} />
          <Route path='/project' element={<Project />} />
          <Route path='/proced' element={<Proced />} />
          <Route path='/documentmodels' element={<DocumentModels />} />
          <Route path='/aidejuridique' element={<AidesJuridiques />} />
          <Route path='/bilan' element={<Bilan />} />
          <Route path='/comptabilite' element={<Comptabilite />} />
          <Route path='/form-association' element={<FormAssociation />} />
          <Route path='/form-auto-entrepreneur' element={<FormAutoEntrepreneur />} />
          <Route path='/form-EI' element={<FormEntrepriseIndividuelle />} />
          <Route path='/form-sci' element={<FormSci />} />
          <Route path='/formulaire/transfert-siege-sociale' element={<TransfertSiegeSociale />} />
          <Route path='/formulaire/changement-denomination' element={<ChangementDenomination />} />
          <Route path='/formulaire/changement-president' element={<ChangementPresident />}/>
          <Route path='/formulaire/changement-activite' element={<ChangementActivite/>}/>
          <Route path='/formulaire/transformation-sarl-en-sas' element={<TransformationSarlEnSas />}/>
          <Route path='/formulaire/transformation-sas-en-sarl' element={<TransformationSasEnSarl />}/>
          <Route path='/formulaire/fermer-societe' element={<FermerSociete />} />
          <Route path='/formulaire/miseensomeil' element={<MiseEnSommeil />} />
          <Route path="/gerer-entreprise" element={<GererEntreprise />} />
          <Route path="/fermer-entreprise" element={<FermerEntreprise />} />
          <Route path='/formulaire/radiationautoentrepreneur' element={<RadiationAutoEntrepreneur />}/>
          <Route path='/formulaire/bilan' element={<Bilan />}/>


          


          <Route path='/docs' element={<FormEntreprise />} />
          <Route path="/user/conversations" element={<UserConversations />} />
          <Route path="/user/messages" element={<UserMessages />} />




        </Route>

        {/* 🔐 Client routes */}
        <Route element={<PrivateRoute deniedRoles={['admin', 'bo']} />}>

          <Route path='/documents' element={<Documents />} />
          <Route path='/profil' element={<Profile />} />
          <Route path='/form-entreprise' element={<FormEntreprise />} />
          <Route path='/form-entreprise/:id' element={<FormEntreprise />} />
          <Route path='/project' element={<Project />} />
          <Route path='/proced' element={<Proced />} />
          <Route path='/guide-sarl' element={<GuideSarl />} />
          <Route path='/guide-sas' element={<GuideSas />} />
          <Route path='/guide-sasu' element={<GuideSasu />} />
          <Route path='/guide-eurl' element={<GuideEurl />} />
          <Route path='/guide-auto-entrepreneur' element={<GuideAutoEntrepreneur />} />
          <Route path='/documentmodels' element={<DocumentModels />} />
          <Route path='/aidejuridique' element={<AidesJuridiques />} />
          <Route path='/bilan' element={<Bilan />} />
          <Route path='/comptabilite' element={<Comptabilite />} />
          <Route path="/formulaire-upload/:id" element={<FormEntreprise />} />
          <Route element={<UserLayout />}>
            <Route path="/dashboarduser" element={<DashboardUser />} />
            <Route path="/dashboard/profil" element={<Profile />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/projets" element={<Project />} />
            <Route path="/dashboard/paiement/:id" element={<MesPaiements />} />
            <Route path="/dashboard/uploadingdoc" element={<UploadDocument />} />
            <Route path="/dashboard/documentsrece" element={<ReceivedDocuments />} />
            <Route path="/dashboard/userentreprise" element={<UserEntreprise />} />

            


            {/*  <Route path="/dashboard/comptabilite" element={<Comptabilite />} /> */}
            {/* Add all other client routes that should use this layout */}
          </Route>

          {/* 🔐 Client routes with DashboardLayout 
        
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardUser />} />
            <Route path="/dashboard/profil" element={<Profile />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/projets" element={<Project />} />
        
          </Route>*/}

          {/* Company creation forms with LoadingWrapper */}
          <Route path='/form-association/:id' element={
            <LoadingWrapper>
              <FormAssociation />
            </LoadingWrapper>
          } />
          <Route path='/form-association' element={
            <LoadingWrapper>
              <FormAssociation />
            </LoadingWrapper>
          } />
          <Route path='/form-EI/:id' element={
            <LoadingWrapper>
              <FormEntrepriseIndividuelle />
            </LoadingWrapper>
          } />
          <Route path='/form-auto-entrepreneur/:id' element={
            <LoadingWrapper>
              <FormAutoEntrepreneur />
            </LoadingWrapper>
          } />
          <Route path='/form-sci/:id' element={
            <LoadingWrapper>
              <FormSci />
            </LoadingWrapper>
          } />
          <Route path='/form-sasu/:id' element={
            <LoadingWrapper>
              <FormSasu />
            </LoadingWrapper>
          } />
          <Route path='/form-sasu' element={
            <LoadingWrapper>
              <FormSasu />
            </LoadingWrapper>
          } />
          <Route path='/form-eurl/:id' element={
            <LoadingWrapper>
              <FormEurl />
            </LoadingWrapper>
          } />
          <Route path='/form-eurl' element={
            <LoadingWrapper>
              <FormEurl />
            </LoadingWrapper>
          } />
          <Route path='/form-sarl/:id' element={
            <LoadingWrapper>
              <FormSarl />
            </LoadingWrapper>
          } />
          <Route path='/form-sarl' element={
            <LoadingWrapper>
              <FormSarl />
            </LoadingWrapper>
          } />
          <Route path='/form-sas/:id' element={
            <LoadingWrapper>
              <FormSas />
            </LoadingWrapper>
          } />
          <Route path='/form-sas' element={
            <LoadingWrapper>
              <FormSas />
            </LoadingWrapper>
          } />
          <Route path='/form-auto-entrepreneur' element={
            <LoadingWrapper>
              <FormAutoEntrepreneur />
            </LoadingWrapper>
          } />
          <Route path='/form-EI' element={
            <LoadingWrapper>
              <FormEntrepriseIndividuelle />
            </LoadingWrapper>
          } />
          <Route path='/form-sci' element={
            <LoadingWrapper>
              <FormSci />
            </LoadingWrapper>
          } />

          {/* Modification forms with LoadingWrapper */}
          <Route path='/formulaire/transfert-siege-sociale' element={
            <LoadingWrapper>
              <TransfertSiegeSociale />
            </LoadingWrapper>
          } />
          <Route path='/formulaire/changement-denomination' element={
            <LoadingWrapper>
              <ChangementDenomination />
            </LoadingWrapper>
          } />
          <Route path='/formulaire/changement-president' element={
            <LoadingWrapper>
              <ChangementPresident />
            </LoadingWrapper>
          } />
          <Route path='/formulaire/changement-activite' element={
            <LoadingWrapper>
              <ChangementActivite />
            </LoadingWrapper>
          } />
          <Route path='/formulaire/transformation-sarl-en-sas' element={
            <LoadingWrapper>
              <TransformationSarlEnSas />
            </LoadingWrapper>
          } />
          <Route path='/formulaire/transformation-sas-en-sarl' element={
            <LoadingWrapper>
              <TransformationSasEnSarl />
            </LoadingWrapper>
          } />
          <Route path='/formulaire/fermer-societe' element={
            <LoadingWrapper>
              <FermerSociete />
            </LoadingWrapper>
          } />


          <Route path="/paiement-fermeture/:id" element={<PaiementFermeture />} />

          <Route path='/modification/:type' element={
            <LoadingWrapper>
              <PageModificationWrapper />
            </LoadingWrapper>
          } />
        </Route>


        {/* 🔓 Informations légales */}
        <Route path='/mentionslegales' element={<MentionsLegales />} />
        <Route path='/conditionsgenerales' element={<ConditionsGenerales />} />
      </Routes>








    </div>

  );
};

export default App;