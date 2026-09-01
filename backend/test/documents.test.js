const { test, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Redireciona o diretório de storage para um diretório temporário nos testes.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dms-test-'));
process.env.STORAGE_DIR = tmpDir;

// Importa o app após configurar a variável de ambiente.
const app = require('../src/app');

// Helper para simular requisições HTTP sem abrir um servidor de verdade.
const { createServer } = require('http');
const { Readable } = require('stream');

function request(method, url, options = {}) {
  return new Promise((resolve, reject) => {
    const server = createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      const http = require('http');
      const req = http.request(
        { host: '127.0.0.1', port, method, path: url, headers: options.headers || {} },
        (res) => {
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            server.close();
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: Buffer.concat(chunks).toString(),
            });
          });
        },
      );
      req.on('error', (err) => { server.close(); reject(err); });
      if (options.body) req.write(options.body);
      req.end();
    });
  });
}

function multipartRequest(url, fieldName, filename, content) {
  const boundary = '----TestBoundary';
  const body = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"`,
    'Content-Type: text/plain',
    '',
    content,
    `--${boundary}--`,
    '',
  ].join('\r\n');
  return request('POST', url, {
    body,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(body),
    },
  });
}

test('GET /health retorna status ok', async () => {
  const res = await request('GET', '/health');
  assert.strictEqual(res.status, 200);
  const json = JSON.parse(res.body);
  assert.strictEqual(json.status, 'ok');
});

test('GET /documents retorna lista vazia inicialmente', async () => {
  const res = await request('GET', '/documents');
  assert.strictEqual(res.status, 200);
  const json = JSON.parse(res.body);
  assert.ok(Array.isArray(json));
});

test('POST /upload sem arquivo retorna 400', async () => {
  const boundary = '----Empty';
  const body = `--${boundary}--\r\n`;
  const res = await request('POST', '/upload', {
    body,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(body),
    },
  });
  assert.strictEqual(res.status, 400);
});

test('POST /upload com arquivo retorna 201 e metadados', async () => {
  const res = await multipartRequest('/upload', 'file', 'teste.txt', 'conteúdo do teste');
  assert.strictEqual(res.status, 201);
  const json = JSON.parse(res.body);
  assert.ok(json.id);
  assert.strictEqual(json.originalName, 'teste.txt');
  assert.ok(json.uploadedAt);
});

test('GET /documents retorna documento após upload', async () => {
  await multipartRequest('/upload', 'file', 'outro.txt', 'outro conteúdo');
  const res = await request('GET', '/documents');
  const json = JSON.parse(res.body);
  assert.ok(json.length >= 1);
});

test('GET /documents/:id/download retorna 404 para id inexistente', async () => {
  const res = await request('GET', '/documents/id-invalido/download');
  assert.strictEqual(res.status, 404);
});

after(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
