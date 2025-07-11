import React, { useState, useEffect } from 'react';
import UploadDocument from './UploadDocument';
import { Box, Typography, Button } from '@mui/material';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// Properly defined keyframes with css helper
const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
`;

// Styled components for the elegant card design
const ClientCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  padding: 20px;
  width: 100%;
`;

const ClientCard = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
  cursor: pointer;
  perspective: 1000px;

  &:hover {
    transform: rotateY(180deg);
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
`;

const FrontFace = styled(CardFace)`
  background: linear-gradient(135deg, #4a6bff 0%, #6a11cb 100%);
  color: white;
`;

const BackFace = styled(CardFace)`
  background: white;
  transform: rotateY(180deg);
  padding: 20px;
  color: #333;
`;

const ClientAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 36px;
  font-weight: bold;
`;

const ClientName = styled(Typography)`
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

const ClientDetail = styled(Typography)`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  text-align: center;
  word-break: break-word;
`;

const ClientSelectorModal = ({ onSelect }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/user/all', {
          withCredentials: true
        });

        // Handle different response formats
        let data = response.data;
        if (data?.users) data = data.users;
        if (data?.data) data = data.data;

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        setClients(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <Typography>Loading clients...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!clients?.length) return <Typography>No clients found</Typography>;

  return (
    <ClientCardContainer>
      {clients.map((client) => (
        <ClientCard key={client._id || client.id} onClick={() => onSelect(client._id || client.id, client.role)}>
          <FrontFace>
            <ClientAvatar>
              {client.name ? client.name.split(' ').map(n => n[0]).join('') : 'U'}
            </ClientAvatar>
            <ClientName variant="h6">{client.name || 'Unknown User'}</ClientName>
            <Typography>Click to select</Typography>
          </FrontFace>
          <BackFace>
            <ClientName variant="h6">{client.name || 'Unknown User'}</ClientName>
            <ClientDetail>{client.role?.toUpperCase() || 'USER'}</ClientDetail>
            <ClientDetail>
              <strong>Email:</strong> {client.email || 'N/A'}
            </ClientDetail>
            {client.phone && (
              <ClientDetail>
                <strong>Phone:</strong> {client.phone}
              </ClientDetail>
            )}
          </BackFace>
        </ClientCard>
      ))}
    </ClientCardContainer>
  );
};

const UploadDocumentWrapper = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const theme = useTheme();

  const handleClientSelect = (clientId, role) => {
    setSelectedClient({ id: clientId, role });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Envoyer un document à un client</Typography>

      {!selectedClient ? (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Sélectionnez un client parmi les options suivantes:
          </Typography>
          <ClientSelectorModal onSelect={handleClientSelect} />
        </>
      ) : (
        <Box sx={{ 
          mt: 4,
          animation: css`${rotate} 1s ease-out`, // Fixed: Wrapped with css helper
        }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => setSelectedClient(null)}
            sx={{ mb: 2 }}
          >
            Changer de client
          </Button>
          <UploadDocument
            destinataireId={selectedClient.id}
            roleDestinataire={selectedClient.role}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadDocumentWrapper;