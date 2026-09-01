# Especificação - Document Management System (DMS)

## 1. Objetivo

Fornecer uma aplicação web simples para gestão de documentos, permitindo upload, listagem e download de arquivos com armazenamento no filesystem local e metadados mantidos em memória.

## 2. Escopo

### Dentro do escopo

- Upload de documentos multipart/form-data via API e interface web.
- Listagem dos documentos cadastrados com exibições de metadados.
- Download de documentos armazenados pelo identificador único.
- Gestão simples por usuário (identificação do proprietário/dono do documento).
- Persistência física em diretório local (`backend/storage`) utilizando `multer` com `diskStorage`.
- Persistência dos metadados em memória durante o ciclo de vida da aplicação.

### Fora do escopo

- Armazenamento em nuvem ou provedores externos (ex: S3, Blob Storage).
- Banco de dados relacional ou NoSQL (nesta fase inicial).
- Versionamento de arquivos e histórico de alterações.
- Autenticação e autorização complexas (ex: OAuth2, JWT, RBAC).

## 3. Requisitos funcionais

| ID    | Requisito                                                                      |
| ----- | ------------------------------------------------------------------------------ |
| RF-01 | O usuário pode enviar (upload) um documento informando o arquivo e proprietário. |
| RF-02 | O sistema deve gravar o arquivo no filesystem local (`backend/storage`).       |
| RF-03 | O sistema deve manter os metadados do documento enviado em memória.            |
| RF-04 | O usuário pode listar todos os documentos cadastrados com seus metadados.      |
| RF-05 | O usuário pode realizar o download de um documento a partir do seu identificador (`id`). |

## 4. Requisitos não funcionais

| ID     | Requisito                                                                         |
| ------ | --------------------------------------------------------------------------------- |
| RNF-01 | Backend desenvolvido em Node.js com Express seguindo Clean Architecture em 4 camadas (`routes -> controllers -> services -> repositories`). |
| RNF-02 | Arquivos recebidos gravados no filesystem local via `multer` utilizando `diskStorage`. |
| RNF-03 | Metadados dos documentos mantidos exclusivamente em memória nesta fase.           |
| RNF-04 | Configuração da aplicação gerenciada via variáveis de ambiente (12-Factor App).   |
| RNF-05 | Testes automatizados no backend desenvolvidos com o runner nativo (`node:test`).  |
| RNF-06 | Frontend desenvolvido em React + Vite com comunicação via proxy `/api`.           |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                                         |
| ------------ | ------ | ------------------------------------------------- |
| id           | string | Identificador único do documento (UUID ou hash)   |
| originalName | string | Nome original do arquivo enviado pelo usuário      |
| filename     | string | Nome do arquivo gerado e salvo em disco           |
| mimeType     | string | Tipo MIME do arquivo (ex: `application/pdf`)      |
| size         | number | Tamanho do arquivo em bytes                       |
| uploadedAt   | string | Data e hora do envio no formato ISO 8601          |
| owner        | string | Identificador ou nome do usuário dono do documento|

## 6. Contratos de API

### POST /upload

- **Descrição**: Envia um novo documento para armazenamento.
- **Content-Type**: `multipart/form-data`
- **Campos do formulário**:
  - `file` (arquivo): Conteúdo binário do arquivo.
  - `owner` (string, opcional): Identificador/nome do proprietário (padrão: `"anonymous"`).
- **Respostas**:
  - `201 Created`: Retorna os metadados do documento criado.
    ```json
    {
      "id": "c9b1a234-5678-4abc-9def-123456789abc",
      "originalName": "relatorio.pdf",
      "filename": "1700000000000-relatorio.pdf",
      "mimeType": "application/pdf",
      "size": 102400,
      "uploadedAt": "2026-09-01T10:00:00.000Z",
      "owner": "joao"
    }
    ```
  - `400 Bad Request`: Arquivo ausente ou dados inválidos.
    ```json
    {
      "error": "Nenhum arquivo enviado."
    }
    ```

### GET /documents

- **Descrição**: Retorna a lista de todos os documentos e seus metadados.
- **Respostas**:
  - `200 OK`: Lista contendo os objetos de metadados.
    ```json
    [
      {
        "id": "c9b1a234-5678-4abc-9def-123456789abc",
        "originalName": "relatorio.pdf",
        "filename": "1700000000000-relatorio.pdf",
        "mimeType": "application/pdf",
        "size": 102400,
        "uploadedAt": "2026-09-01T10:00:00.000Z",
        "owner": "joao"
      }
    ]
    ```

### GET /documents/:id/download

- **Descrição**: Faz o download do arquivo correspondente ao ID informado.
- **Parâmetros de Rota**: `id` (string)
- **Respostas**:
  - `200 OK`: Fluxo binário do arquivo com headers apropriados (`Content-Type` e `Content-Disposition: attachment; filename="..."`).
  - `404 Not Found`: Documento não encontrado.
    ```json
    {
      "error": "Documento não encontrado."
    }
    ```

## 7. Decisões arquiteturais

- **Backend Clean Architecture**:
  - Organização em 4 camadas dentro de `backend/src`: `routes -> controllers -> services -> repositories`.
  - Baixo acoplamento e separação clara de responsabilidades:
    - `routes/`: Mapeia endpoints HTTP e middleware Multer.
    - `controllers/`: Recebe requisições HTTP, valida entradas e formata respostas.
    - `services/`: Contém as regras de negócio de gerenciamento de documentos.
    - `repositories/`: Gerencia o repositório em memória para metadados e acesso aos arquivos salvos.
- **Armazenamento**:
  - Armazenamento físico estritamente local em `backend/storage` utilizando `multer.diskStorage`.
  - Metadados mantidos em estrutura de memória (Array / Map) no repositório backend.
- **Frontend SPA**:
  - React com Vite e componentes funcionais.
  - Comunicação REST com backend via `fetch` utilizando o proxy `/api`.

## 8. Plano de execução

1. **Estruturação do Backend (Clean Architecture)**:
   - Criar repositório de documentos em memória (`backend/src/repositories/documentRepository.js`).
   - Criar serviço de documentos (`backend/src/services/documentService.js`).
   - Criar controller de documentos (`backend/src/controllers/documentController.js`).
   - Configurar middleware de upload Multer (`backend/src/routes/uploadMiddleware.js`).
   - Criar rotas do backend (`backend/src/routes/documentRoutes.js`).
   - Conectar rotas no arquivo principal (`backend/src/app.js`).
2. **Testes do Backend**:
   - Escrever e executar testes automatizados com `node:test` para os cenários de upload, listagem e download (`backend/test/app.test.js`).
3. **Desenvolvimento do Frontend**:
   - Criar serviço de integração com API (`frontend/src/services/api.js`).
   - Criar componente de Upload (`frontend/src/components/DocumentUpload.jsx`).
   - Criar componente de Listagem (`frontend/src/components/DocumentList.jsx`).
   - Integrar componentes na página principal (`frontend/src/App.jsx`).
4. **Validação de Integração e Homologação**:
   - Executar testes de integração de ponta a ponta (upload, listagem e download pela interface).
