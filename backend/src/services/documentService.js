// Serviço de documentos: concentra todas as regras de negócio.
// Cada função tem responsabilidade única e delega persistência ao repositório.

const { randomUUID } = require('crypto');
const path = require('path');
const repository = require('../repositories/documentRepository');

/**
 * Registra um documento recém-enviado e retorna seus metadados.
 * @param {{ originalname: string, filename: string, size: number }} file
 * @param {string} owner - identificador do dono do documento
 * @returns {object} metadados do documento salvo
 */
function registerDocument(file, owner) {
  const metadata = {
    id: randomUUID(),
    // path.basename evita que nomes com separadores de diretório causem path traversal.
    originalName: path.basename(file.originalname),
    filename: file.filename,
    size: file.size,
    owner,
    uploadedAt: new Date().toISOString(),
  };
  return repository.save(metadata);
}

/**
 * Retorna a lista de todos os documentos armazenados.
 * @returns {object[]}
 */
function listDocuments() {
  return repository.findAll();
}

/**
 * Busca o caminho absoluto do arquivo de um documento pelo id.
 * Lança um erro se o documento não existir.
 * @param {string} id
 * @returns {{ metadata: object, filePath: string }}
 */
function resolveDownload(id) {
  const metadata = repository.findById(id);
  if (!metadata) {
    const error = new Error('Documento não encontrado');
    error.status = 404;
    throw error;
  }
  const filePath = repository.buildFilePath(path.basename(metadata.filename));
  // Garante que o caminho resolvido permanece dentro do diretório de armazenamento.
  if (!filePath.startsWith(repository.STORAGE_DIR + path.sep) && filePath !== repository.STORAGE_DIR) {
    const error = new Error('Acesso negado');
    error.status = 403;
    throw error;
  }
  return { metadata, filePath };
}

module.exports = { registerDocument, listDocuments, resolveDownload };
