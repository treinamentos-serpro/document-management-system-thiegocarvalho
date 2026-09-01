// Repositório de documentos: gerencia a persistência em memória e no filesystem local.
// Os metadados ficam em um Map indexado por id. Os arquivos físicos são
// gerenciados pelo multer (gravados em backend/storage/).

const path = require('path');
const fs = require('fs');

const STORAGE_DIR = path.resolve(__dirname, '../../storage');

// Garante que o diretório de armazenamento existe ao carregar o módulo.
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Armazenamento em memória: id -> metadados do documento.
const documents = new Map();

function save(metadata) {
  documents.set(metadata.id, metadata);
  return metadata;
}

function findAll() {
  return Array.from(documents.values());
}

function findById(id) {
  return documents.get(id) || null;
}

function buildFilePath(filename) {
  return path.join(STORAGE_DIR, filename);
}

module.exports = { save, findAll, findById, buildFilePath, STORAGE_DIR };
