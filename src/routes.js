const express = require('express');
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');
const MatchController = require('./controllers/MatchController');

const routes = express.Router();

routes.get('/devs', DevController.index);
routes.get('/likes', LikeController.index);
routes.get('/dislikes', DislikeController.index);
routes.get('/matchs', MatchController.index);
routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/remove-likes', LikeController.delete);
routes.post('/devs/:devId/dislikes', DislikeController.store);
routes.post('/devs/:devId/remove-dislikes', DislikeController.delete);

module.exports = routes;
