# Deploy - SOMA Crédito Sales

## Build local

```bash
npm run build
```

O output é gerado em `dist/`. Conteúdo:

- `dist/index.html` — Página principal
- `dist/assets/` — CSS e JS minificados

## Publicação via FTP

1. Execute o build: `npm run build`
2. Faça upload do conteúdo da pasta `dist/` para o diretório público do servidor (ex: `public_html/`, `www/`, `htdocs/`)
3. Garanta que `index.html` esteja na raiz do diretório público

## Variáveis de ambiente

Para funcionar com Supabase, configure no ambiente de produção:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Caso use `.env` local, o Vite injeta essas variáveis no build. Em hospedagens, configure no painel.

## Hospedagens estáticas

O projeto é um SPA (Single Page Application). Funciona em:

- Vercel
- Netlify
- GitHub Pages (com base path se necessário)
- Qualquer host estático ou CDN

Configure redirecionamento para `index.html` em rotas não raiz (SPA fallback) se a hospedagem exigir.
