class DocumentsRepository {
  constructor() {
    this.documents = new Map();
  }

  create(document) {
    this.documents.set(document.id, document);
    return document;
  }

  findAll() {
    return Array.from(this.documents.values());
  }

  findById(id) {
    return this.documents.get(id) || null;
  }

  clear() {
    this.documents.clear();
  }
}

module.exports = new DocumentsRepository();
