import React, { useState } from 'react';
import { uploadDocument } from '../services/api';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ text: 'Por favor, selecione um arquivo.', type: 'error' });
      return;
    }

    try {
      setUploading(true);
      setMessage({ text: '', type: '' });

      const uploadedDoc = await uploadDocument(file, owner);

      setMessage({ text: 'Documento enviado com sucesso!', type: 'success' });
      setFile(null);
      setOwner('');

      // Reseta o valor do input file no DOM
      e.target.reset();

      if (onUploadSuccess) {
        onUploadSuccess(uploadedDoc);
      }
    } catch (err) {
      setMessage({ text: err.message || 'Erro ao enviar documento.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Enviar Novo Documento</h2>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="file-input" className="mb-2 block text-sm font-medium text-gray-700">
            Arquivo:
          </label>
          <input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0] || null)}
            disabled={uploading}
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="owner-input" className="mb-2 block text-sm font-medium text-gray-700">
            Proprietário (opcional):
          </label>
          <input
            id="owner-input"
            type="text"
            placeholder="Nome do proprietário"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={uploading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? 'Enviando...' : 'Enviar Documento'}
        </button>
      </form>

      {message.text && (
        <p
          className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
