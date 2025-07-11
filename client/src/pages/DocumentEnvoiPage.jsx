import React, { useState } from 'react';
import ClientSelector from './ClientSelector';
import UploadDocument from './UploadDocument';

const DocumentEnvoiPage = () => {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientRole, setSelectedClientRole] = useState(null);

  const handleClientSelect = (clientId, role) => {
    setSelectedClientId(clientId);
    setSelectedClientRole(role);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Sélectionner un client</h2>
      <ClientSelector onSelect={handleClientSelect} />

      {selectedClientId && (
        <UploadDocument
          destinataireId={selectedClientId}
          roleDestinataire={selectedClientRole}
        />
      )}
    </div>
  );
};

export default DocumentEnvoiPage;
