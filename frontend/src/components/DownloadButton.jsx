import React, { useState } from 'react';
import { downloadDocument } from '../services/api';

export default function DownloadButton({ documentId, filename }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError('');
      await downloadDocument(documentId, filename);
    } catch (err) {
      setError(err.message || 'Erro no download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <button onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Baixando...' : 'Baixar'}
      </button>
      {error && <span style={{ color: 'red', marginLeft: '0.5rem', fontSize: '0.875rem' }}>{error}</span>}
    </div>
  );
}
