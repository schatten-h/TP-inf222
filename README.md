# TP-INF222
utilisation des API REST avec node js et swagger

# API Blog - INF222

## Description
Cette API permet de gérer des articles de blog (CRUD + recherche).

## Technologies utilisées
- Node.js
- Express
- Swagger
  
## Endpoints

- POST /api/articles → créer un article
- GET /api/articles → voir tous les articles
- GET /api/articles/{id} → voir un article
- PUT /api/articles/{id} → modifier
- DELETE /api/articles/{id} → supprimer
- GET /api/articles/search?query=texte → rechercher
- Documentation API

http://localhost:3000/api-docs

## Auteur

LAWOU TENKEU KUATE HARRY 24G2269

## Installation

```bash
git clone https://github.com/schatten-h/TP-inf222.git
cd TP-inf222
npm install
node server.js

