# Pulse Social

Clone funcional do Twitter com tema voltado a psicologia e saude mental.

## Funcionalidades

- Cadastro e login com JWT.
- Edicao opcional de perfil: nome, bio, localizacao, site, foto e senha.
- Seguir e deixar de seguir usuarios.
- Feed com publicacoes apenas de pessoas seguidas.
- Area de exploracao para descobrir usuarios e posts.
- Criacao de posts, curtidas e comentarios.
- API REST em Django + Django REST Framework.
- Front-end React integrado ao backend.

## Tecnologias

- Backend: Python, Django, Django REST Framework.
- Frontend: React, React Router e Vite.

## Como rodar localmente

### Backend

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

```env
VITE_API_URL=http://localhost:8000
```

## Validacao

```bash
cd backend
venv\Scripts\activate
python manage.py test
python manage.py check
```

```bash
cd frontend
npm run lint
npm run build
```

## Deploy

- Link do GitHub: https://github.com/Rodrigo-GitHb/PsicoNet
- Link do deploy: `adicione-o-aqui`
