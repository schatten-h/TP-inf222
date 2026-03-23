// server.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

let stats = {
  get: 0,
  post: 0,
  put: 0,
  delete: 0
};

let articles = [
  {
    id: 1,
    titre: "REVOLUTION",
    contenu: "Tp de Inf 222",
    auteur: "Admin_Harry",
    date: new Date()
  },
  {
    id: 2,
    titre: "Backend",
    contenu: "EC1 - Inf 222",
    auteur: "Dr. Jiomekong",
    date: new Date()
  }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.post('/api/articles', (req, res) => {
  stats.post++;

  const { titre, contenu, auteur } = req.body;

  if (!titre || !auteur) {
    return res.status(400).json({ message: "Titre et auteur obligatoires" });
  }

  const article = {
    id: articles.length + 1,
    titre,
    contenu,
    auteur,
    date: new Date()
  };

  articles.push(article);

  res.status(201).json(article);
});

app.get('/api/articles', (req, res) => {
  stats.get++;
  res.json(articles);
});

app.get('/api/articles/:id', (req, res) => {
  stats.get++;

  const article = articles.find(a => a.id == req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article non trouvé" });
  }

  res.json(article);
});

app.put('/api/articles/:id', (req, res) => {
  stats.put++;

  const article = articles.find(a => a.id == req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article non trouvé" });
  }

  const { titre, contenu } = req.body;

  if (titre) article.titre = titre;
  if (contenu) article.contenu = contenu;

  res.json({ message: "Article modifié", article });
});

app.delete('/api/articles/:id', (req, res) => {
  stats.delete++;

  articles = articles.filter(a => a.id != req.params.id);

  res.json({ message: "Article supprimé" });
});

app.get('/api/articles/search', (req, res) => {
  stats.get++;

  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Query manquante" });
  }

  const resultats = articles.filter(a =>
    a.titre.toLowerCase().includes(query.toLowerCase()) ||
    a.contenu.toLowerCase().includes(query.toLowerCase())
  );

  res.json(resultats);
});

app.get('/api/stats', (req, res) => {
  res.json(stats);
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HARRY Blog API",
      version: "1.0.0",
      description: "API REST complète avec Dashboard"
    },
    servers: [
      {
        url: "https://tp-inf222.onrender.com"
      }
    ]
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
