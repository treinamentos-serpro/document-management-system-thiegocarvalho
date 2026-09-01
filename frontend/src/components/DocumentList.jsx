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
    return <p className="text-sm text-gray-600">Carregando documentos...</p>;
  }

  if (error) {
    return <p className="text-sm font-medium text-red-600">{error}</p>;
  }

  if (!documents || documents.length === 0) {
    return <p className="text-sm text-gray-600">Nenhum documento cadastrado.</p>;
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Documentos Cadastrados</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th scope="col" className="p-2 font-medium text-gray-700">Nome Original</th>
              <th scope="col" className="p-2 font-medium text-gray-700">Proprietário</th>
              <th scope="col" className="p-2 font-medium text-gray-700">Tamanho</th>
              <th scope="col" className="p-2 font-medium text-gray-700">Data de Upload</th>
              <th scope="col" className="p-2 font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2 text-gray-900">{doc.originalName}</td>
                <td className="p-2 text-gray-700">{doc.owner || 'anonymous'}</td>
                <td className="p-2 text-gray-700">{formatBytes(doc.size)}</td>
                <td className="p-2 text-gray-700">{formatDate(doc.uploadedAt)}</td>
                <td className="p-2">
                  <DownloadButton documentId={doc.id} filename={doc.originalName} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
