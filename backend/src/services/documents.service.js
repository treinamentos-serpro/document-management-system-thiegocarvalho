const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const documentsRepository = require('../repositories/documents.repository');

class DocumentsService {
  constructor(repository = documentsRepository) {
    this.repository = repository;
  }

  createDocument({ file, owner }) {
    if (!file) {
      throw new Error('Nenhum arquivo enviado.');
    }

    const documentData = {
      id: crypto.randomUUID(),
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      owner: owner && typeof owner === 'string' && owner.trim() !== '' ? owner.trim() : 'anonymous',
    };

    return this.repository.create(documentData);
  }

  listDocuments() {
    return this.repository.findAll();
  }

  getDocumentById(id) {
    const document = this.repository.findById(id);
    if (!document) {
      const error = new Error('Documento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const storageDir = path.resolve(__dirname, '../../storage');
    const filePath = path.join(storageDir, document.filename);

    if (!fs.existsSync(filePath)) {
      const error = new Error('Documento não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return { document, filePath };
  }
}

module.exports = new DocumentsService();
