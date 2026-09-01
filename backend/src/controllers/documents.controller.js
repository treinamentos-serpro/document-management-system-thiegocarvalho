const documentsService = require('../services/documents.service');

class DocumentsController {
  constructor(service = documentsService) {
    this.service = service;
    this.upload = this.upload.bind(this);
    this.list = this.list.bind(this);
    this.download = this.download.bind(this);
  }

  upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      const owner = req.body ? req.body.owner : undefined;
      const document = this.service.createDocument({ file: req.file, owner });

      return res.status(201).json(document);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ error: error.message || 'Erro interno do servidor.' });
    }
  }

  list(req, res) {
    try {
      const documents = this.service.listDocuments();
      return res.status(200).json(documents);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar documentos.' });
    }
  }

  download(req, res) {
    try {
      const { id } = req.params;
      const { document, filePath } = this.service.getDocumentById(id);

      return res.download(filePath, document.originalName, (err) => {
        if (err && !res.headersSent) {
          return res
            .status(500)
            .json({ error: 'Erro ao realizar o download do arquivo.' });
        }
      });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ error: error.message || 'Erro interno do servidor.' });
    }
  }
}

module.exports = new DocumentsController();
