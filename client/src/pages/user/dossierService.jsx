import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';

export const useDossierService = () => {
  const { backendUrl } = useContext(AppContent);

  const getUserDossiers = async (page = 1, pageSize = 10, type = 'all') => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/dossiers`, {
        params: { 
          page, 
          pageSize, 
          type: type !== 'all' ? type : undefined 
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dossiers:', error);
      throw error;
    }
  };

  const getDossierFiles = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/dossiers/${id}/files`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dossier files:', error);
      throw error;
    }
  };

  return {
    getUserDossiers,
    getDossierFiles
  };
};