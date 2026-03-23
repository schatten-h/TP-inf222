const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const express = require('express');
const app = express();

app.use(express.json());

let articles = [
  {
    id: 1,
    titre: "REVOLUTION",
    contenu: "Tp de Inf 222",
    auteur: "Admin_Harry",
    date: new Date()
  }
];

// 🔹 Créer un article
/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *               auteur:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article créé
 */
app.post('/api/articles', (req, res) => {
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
 *     responses:
 *       200:
 *         description: Liste des articles
 */
app.get('/api/articles', (req, res) => {
  res.json(articles);
});
// 🔹 Lire un article par ID
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article trouvé
 *       404:
 *         description: Article non trouvé
 */
app.get('/api/articles/:id', (req, res) => {
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               contenu:
 *                 type: string
 *     responses:
 *       200:
 *         description: Article modifié
 */
app.put('/api/articles/:id', (req, res) => {
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article supprimé
 */
app.delete('/api/articles/:id', (req, res) => {
  articles = articles.filter(a => a.id != req.params.id);

  res.json({ message: "Article supprimé" });
});

// 🔍 Rechercher un article

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
app.get('/api/articles/search', (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Query manquante" });
  }

  const resultats = articles.filter(a =>
    a.titre.includes(query) || a.contenu.includes(query)
  );

  res.json(resultats);
});

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
  apis: ["./server.js"], // là où on met les commentaires
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});

