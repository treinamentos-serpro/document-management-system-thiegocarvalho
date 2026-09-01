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
    <div className="inline-block">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {downloading ? 'Baixando...' : 'Baixar'}
      </button>
      {error && <span className="ml-2 text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}
