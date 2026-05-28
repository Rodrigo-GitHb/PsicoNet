# Backend

API REST do Pulse Social, feita com Django, Django REST Framework e JWT.

## Apps

- `accounts`: usuario customizado, cadastro, login, perfil e follow/unfollow.
- `posts`: posts, feed, explorar, curtidas e comentarios.
- `interactions`: sugestoes de usuarios.
- `config`: configuracoes do projeto.

## Comandos

```bash
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Testes e checks

```bash
python manage.py test
python manage.py check
```

## Endpoints principais

### Autenticacao e usuarios

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- `GET /api/auth/me/`
- `PATCH /api/auth/me/`
- `GET /api/auth/users/`
- `GET /api/auth/users/<username>/`
- `POST /api/auth/users/<username>/follow/`
- `GET /api/auth/users/<username>/followers/`
- `GET /api/auth/users/<username>/following/`

### Posts

- `GET /api/posts/feed/`
- `GET /api/posts/explore/`
- `GET /api/posts/`
- `POST /api/posts/`
- `GET /api/posts/user/<username>/`
- `GET /api/posts/<id>/`
- `DELETE /api/posts/<id>/`
- `POST /api/posts/<id>/like/`
- `GET /api/posts/<id>/comments/`
- `POST /api/posts/<id>/comments/`

### Interacoes

- `GET /api/interactions/suggestions/`

## Autenticacao

Envie o token JWT nas rotas protegidas:

```http
Authorization: Bearer <access_token>
```
