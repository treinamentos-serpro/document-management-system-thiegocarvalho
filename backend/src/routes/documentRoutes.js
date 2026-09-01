// Definição das rotas de documentos.
// Configura o multer com diskStorage e conecta cada rota ao controller.

const express = require('express');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
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

// Limita downloads a 60 requisições por minuto por IP para evitar abuso.
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/upload', upload.single('file'), controller.upload);
router.get('/documents', controller.list);
router.get('/documents/:id/download', downloadLimiter, controller.download);

module.exports = router;
