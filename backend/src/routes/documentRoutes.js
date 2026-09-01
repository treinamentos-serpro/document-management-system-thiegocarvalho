// Definição das rotas de documentos.
// Configura o multer com diskStorage e conecta cada rota ao controller.

const express = require('express');
const multer = require('multer');
const path = require('path');
const { STORAGE_DIR } = require('../repositories/documentRepository');
const controller = require('../controllers/documentController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, STORAGE_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), controller.upload);
router.get('/documents', controller.list);
router.get('/documents/:id/download', controller.download);

module.exports = router;
