# Frontend

Interface React do Pulse Social, integrada a API Django REST.

## Recursos

- Login e cadastro reais com JWT.
- Rotas protegidas.
- Feed, explorar, rede, perfil e configuracoes.
- Criacao de posts, curtidas, comentarios e follow/unfollow via API.
- Upload de foto de perfil usando `multipart/form-data`.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Ambiente

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```
