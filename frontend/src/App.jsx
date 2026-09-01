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
    <main className="mx-auto max-w-4xl px-4 py-8 font-sans sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Document Management System
      </h1>
      <UploadComponent onUploadSuccess={handleUploadSuccess} />
      <DocumentList documents={documents} loading={loading} error={error} />
    </main>
  );
}
