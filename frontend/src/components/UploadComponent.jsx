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
    <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Enviar Novo Documento</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label htmlFor="file-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Arquivo:
          </label>
          <input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files[0] || null)}
            disabled={uploading}
          />
        </div>

        <div>
          <label htmlFor="owner-input" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Proprietário (opcional):
          </label>
          <input
            id="owner-input"
            type="text"
            placeholder="Nome do proprietário"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={uploading}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" disabled={uploading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          {uploading ? 'Enviando...' : 'Enviar Documento'}
        </button>
      </form>

      {message.text && (
        <p style={{ marginTop: '1rem', color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}
    </section>
  );
}
