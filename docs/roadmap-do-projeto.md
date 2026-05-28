# Roadmap do Projeto

Este roadmap foi pensado para voce concluir o projeto final com menos chance de se perder.

## Fase 1. Preparar o ambiente

### Objetivo

Criar o back-end Django e deixar o projeto pronto para comecar a API.

### Comandos

Entre na pasta do back-end:

```bash
cd D:\ProjetosEBAC\ebac-twitter-clone\backend
```

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual:

```bash
venv\Scripts\activate
```

Instale as dependencias principais:

```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow python-decouple whitenoise
```

Salve as dependencias:

```bash
pip freeze > requirements\dev.txt
```

Crie o projeto Django:

```bash
django-admin startproject config .
python manage.py startapp accounts
python manage.py startapp posts
python manage.py startapp interactions
```

## Fase 2. Configurar Django e DRF

### Objetivo

Deixar o projeto pronto para responder a API REST e conversar com o front.

### O que fazer

- configurar `INSTALLED_APPS`
- configurar `MIDDLEWARE`
- configurar `REST_FRAMEWORK`
- configurar JWT
- configurar CORS
- configurar `MEDIA_URL` e `MEDIA_ROOT`

### Comandos uteis

Rodar o servidor:

```bash
python manage.py runserver
```

Aplicar migracoes quando necessario:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Fase 3. Modelagem do sistema

### Objetivo

Criar a base de dados do projeto.

### Modelos recomendados

- `accounts`
  - usuario
  - perfil opcional ou custom user
  - follow
- `posts`
  - post
- `interactions`
  - comment
  - like

### Ordem recomendada

1. usuario
2. follow
3. post
4. comment
5. like

### Comandos

Depois de criar ou editar models:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Fase 4. Autenticacao

### Objetivo

Permitir cadastro e login com seguranca.

### O que implementar

- cadastro
- login
- refresh token
- rota do usuario autenticado

### Endpoints sugeridos

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

### Comandos

Criar superusuario para testes:

```bash
python manage.py createsuperuser
```

## Fase 5. Perfil

### Objetivo

Permitir que o usuario altere os proprios dados.

### O que implementar

- editar nome
- editar bio
- editar foto
- alterar senha

### Endpoints sugeridos

- `GET /api/profile/`
- `PATCH /api/profile/`

## Fase 6. Rede de conexoes

### Objetivo

Permitir seguir e deixar de seguir pessoas.

### O que implementar

- seguir usuario
- deixar de seguir
- listar seguidores
- listar seguidos

### Endpoints sugeridos

- `POST /api/follows/<user_id>/`
- `DELETE /api/follows/<user_id>/`
- `GET /api/followers/`
- `GET /api/following/`

## Fase 7. Posts

### Objetivo

Permitir criacao e gerenciamento das publicacoes.

### O que implementar

- criar post
- listar posts
- editar post proprio
- excluir post proprio

### Endpoints sugeridos

- `GET /api/posts/`
- `POST /api/posts/`
- `PATCH /api/posts/<id>/`
- `DELETE /api/posts/<id>/`

## Fase 8. Feed filtrado

### Objetivo

Atender ao requisito principal do projeto: o feed deve exibir apenas posts de pessoas seguidas.

### O que implementar

- endpoint de feed
- filtro por usuarios seguidos
- ordenacao por data

### Endpoint sugerido

- `GET /api/feed/`

## Fase 9. Curtidas e comentarios

### Objetivo

Adicionar interacoes sociais nas publicacoes.

### O que implementar

- curtir
- remover curtida
- comentar
- listar comentarios

### Endpoints sugeridos

- `GET /api/posts/<id>/comments/`
- `POST /api/posts/<id>/comments/`
- `POST /api/posts/<id>/like/`
- `DELETE /api/posts/<id>/like/`

## Fase 10. Integrar com o front-end

### Objetivo

Substituir os dados mockados por dados reais da API.

### Pasta do front

```bash
cd D:\ProjetosEBAC\ebac-twitter-clone\frontend
```

### Instalar dependencias uteis no front

Se quiser chamadas HTTP mais organizadas:

```bash
npm install axios
```

Se quiser formularios melhores:

```bash
npm install react-hook-form
```

Se quiser validacao de dados:

```bash
npm install zod
```

### O que integrar primeiro

1. login
2. cadastro
3. usuario logado
4. feed
5. criar post
6. comentarios
7. curtidas
8. perfil
9. seguir e seguidores

### Comandos do front

Rodar o front:

```bash
npm run dev
```

Validar o front:

```bash
npm run lint
npm run build
```

## Fase 11. Testes

### Objetivo

Garantir que a API funciona corretamente.

### Comandos do Django

Rodar testes:

```bash
python manage.py test
```

Se quiser usar pytest:

```bash
pip install pytest pytest-django
```

## Fase 12. Deploy

### Objetivo

Deixar a aplicacao acessivel online.

### Front-end

Opcoes:

- Vercel
- Netlify

### Back-end

Opcoes:

- Render
- Railway
- PythonAnywhere

### Comandos importantes antes do deploy

No front:

```bash
cd D:\ProjetosEBAC\ebac-twitter-clone\frontend
npm run build
```

No back:

```bash
cd D:\ProjetosEBAC\ebac-twitter-clone\backend
python manage.py collectstatic
```

## Fase 13. Entrega final

### O que conferir

- cadastro funcionando
- login funcionando
- perfil editavel
- seguir e deixar de seguir
- feed filtrado por seguidos
- curtidas funcionando
- comentarios funcionando
- deploy online
- repositorio no GitHub
- README com instrucoes

## Fluxo diario recomendado

### Subir o back-end

```bash
cd D:\ProjetosEBAC\ebac-twitter-clone\backend
venv\Scripts\activate
python manage.py runserver
```

### Subir o front-end

Em outro terminal:

```bash
cd D:\ProjetosEBAC\ebac-twitter-clone\frontend
npm run dev
```

## Ordem ideal para voce seguir agora

1. Criar o back-end Django
2. Configurar DRF, JWT e CORS
3. Fazer model de usuario e follow
4. Fazer cadastro e login
5. Fazer perfil
6. Fazer posts
7. Fazer feed filtrado
8. Fazer curtidas e comentarios
9. Integrar tudo com o front
10. Fazer deploy e documentacao

## Se quiser meu apoio como tutor

Voce pode me chamar com comandos assim:

- `me ajuda a criar o projeto Django`
- `me ajuda a configurar JWT`
- `me ajuda a criar o model Follow`
- `me ajuda a integrar o feed com a API`
- `me ajuda a fazer deploy`
