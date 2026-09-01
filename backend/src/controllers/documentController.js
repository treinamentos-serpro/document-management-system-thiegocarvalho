// Controller de documentos: trata requisições HTTP e delega ao serviço.
// Não contém regras de negócio — apenas valida entrada e formata resposta.

const service = require('../services/documentService');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  const owner = req.body.owner || 'anonymous';
  const document = service.registerDocument(req.file, owner);
  return res.status(201).json(document);
}

function list(req, res) {
  const documents = service.listDocuments();
  return res.json(documents);
}

function download(req, res) {
  try {
    const { metadata, filePath } = service.resolveDownload(req.params.id);
    return res.download(filePath, metadata.originalName);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
  }
}

module.exports = { upload, list, download };
