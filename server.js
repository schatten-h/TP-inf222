```js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

let stats = {
  get: 0,
  post: 0,
  put: 0,
  delete: 0
};

let articles = [
  {
    id: 1,
    titre: "Introduction au Backend",
    contenu: "Comprendre les bases du développement backend avec Node.js",
    auteur: "Harry",
    date: new Date()
  },
  {
    id: 2,
    titre: "API REST avec Express",
    contenu: "Création d'une API REST complète avec Express et Swagger",
    auteur: "John Doe",
    date: new Date()
  },
  {
    id: 3,
    titre: "Déploiement sur Render",
    contenu: "Comment déployer une API Node.js gratuitement sur Render",
    auteur: "Alice",
    date: new Date()
  }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/test', (req, res) => {
  res.json({ message: "OK" });
});

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
  stats.get++;
  res.json(articles);
});

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
  stats.get++;

  const article = articles.find(a => a.id == req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article non trouvé" });
  }

  res.json(article);
});

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
  stats.delete++;

  articles = articles.filter(a => a.id != req.params.id);

  res.json({ message: "Article supprimé" });
});

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

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Statistiques de l'API
 *     responses:
 *       200:
 *         description: Compteurs des requêtes
 */
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
    }
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
```

