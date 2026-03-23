const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const express = require('express');
const app = express();

app.use(express.json());

// ✅ Données
let articles = [
  {
    id: 1,
    titre: "REVOLUTION",
    contenu: "Tp de Inf 222",
    auteur: "Admin_Harry",
    date: new Date()
  }
];

// ✅ Stats
let stats = {
  get: 0,
  post: 0,
  put: 0,
  delete: 0
};

// 🔹 Créer un article
/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un article
 */
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

// 🔹 Lire tous les articles
/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 */
app.get('/api/articles', (req, res) => {
  stats.get++;
  res.json(articles);
});

// 🔹 Lire un article par ID
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 */
app.get('/api/articles/:id', (req, res) => {
  stats.get++;

  const article = articles.find(a => a.id == req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article non trouvé" });
  }

  res.json(article);
});

// 🔹 Modifier un article
/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 */
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

// 🔹 Supprimer un article
/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 */
app.delete('/api/articles/:id', (req, res) => {
  stats.delete++;

  articles = articles.filter(a => a.id != req.params.id);

  res.json({ message: "Article supprimé" });
});

// 🔍 Rechercher un article
/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 */
app.get('/api/articles/search', (req, res) => {
  stats.get++;

  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Query manquante" });
  }

  const resultats = articles.filter(a =>
    a.titre.includes(query) || a.contenu.includes(query)
  );

  res.json(resultats);
});

// 📊 Route stats (NOUVEAU 🔥)
app.get('/api/stats', (req, res) => {
  res.json(stats);
});

// 🔧 Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HARRY Blog",
      version: "1.0.0",
      description: "API REST pour gérer un blog simple"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
