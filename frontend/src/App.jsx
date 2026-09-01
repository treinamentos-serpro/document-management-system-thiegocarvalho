import React, { useState, useEffect, useCallback } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { getDocuments } from './services/api';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar lista de documentos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploadSuccess={handleUploadSuccess} />
      <DocumentList documents={documents} loading={loading} error={error} />
    </main>
  );
}
