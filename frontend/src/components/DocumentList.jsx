import React from 'react';
import DownloadButton from './DownloadButton';

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('pt-BR');
}

export default function DocumentList({ documents, loading, error }) {
  if (loading) {
    return <p>Carregando documentos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!documents || documents.length === 0) {
    return <p>Nenhum documento cadastrado.</p>;
  }

  return (
    <section style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Documentos Cadastrados</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>Nome Original</th>
            <th style={{ padding: '0.5rem' }}>Proprietário</th>
            <th style={{ padding: '0.5rem' }}>Tamanho</th>
            <th style={{ padding: '0.5rem' }}>Data de Upload</th>
            <th style={{ padding: '0.5rem' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{doc.originalName}</td>
              <td style={{ padding: '0.5rem' }}>{doc.owner || 'anonymous'}</td>
              <td style={{ padding: '0.5rem' }}>{formatBytes(doc.size)}</td>
              <td style={{ padding: '0.5rem' }}>{formatDate(doc.uploadedAt)}</td>
              <td style={{ padding: '0.5rem' }}>
                <DownloadButton documentId={doc.id} filename={doc.originalName} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
