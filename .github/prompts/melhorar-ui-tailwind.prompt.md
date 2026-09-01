---
description: Melhora o visual do frontend aplicando Tailwind CSS 3, mantendo a funcionalidade existente.
name: melhorar-ui-tailwind
agent: ui-designer
---

# Melhorar o visual do frontend com Tailwind CSS 3

Aplique um redesign visual no frontend do DMS (`frontend/`) usando **Tailwind CSS 3**,
sem quebrar as funcionalidades de upload, listagem e download já existentes.

## Passos

1. Instale e configure o Tailwind CSS 3 no projeto `frontend`:
   - Dependências de desenvolvimento: `tailwindcss@3`, `postcss`, `autoprefixer`.
   - Gere `tailwind.config.js` e `postcss.config.js` com o `content` apontando para
     `./index.html` e `./src/**/*.{js,jsx}`.
   - Crie um arquivo CSS de entrada (ex. `src/index.css`) com as diretivas
     `@tailwind base;`, `@tailwind components;` e `@tailwind utilities;` e importe-o
     em `src/main.jsx`.

2. Reestilize os componentes existentes usando classes utilitárias do Tailwind,
   removendo os estilos inline (`style={{ ... }}`):
   - `App.jsx`: layout geral, espaçamento e título.
   - `UploadComponent.jsx`: formulário de envio (inputs, label, botão, mensagens de
     sucesso/erro).
   - `DocumentList.jsx`: tabela de documentos (cabeçalho, linhas, estados de
     carregamento/erro/vazio).
   - `DownloadButton.jsx`: botão de download.

3. Garanta um visual consistente:
   - Paleta neutra com uma cor de destaque para ações primárias (ex. botão de envio).
   - Responsividade básica (o layout deve funcionar em telas menores).
   - Estados de foco visíveis e contraste adequado para acessibilidade.

4. Não altere:
   - A lógica de estado dos componentes.
   - As chamadas em `services/api.js`.
   - Os endpoints ou o comportamento do backend.

5. Ao final, rode `npm run build` dentro de `frontend` para confirmar que o projeto
   compila sem erros.

## Critérios de aceite

- Nenhum estilo inline remanescente nos componentes alterados.
- Tailwind configurado e funcionando (classes aplicadas refletem no visual).
- Build do frontend concluído sem erros.
- Funcionalidades de upload, listagem e download preservadas.
