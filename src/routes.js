const express = require('express');
const routes = express.Router();

const semaphoreController = require('./controllers/semaphoreController');
const crossingController = require('./controllers/crossingController');
const viaController = require('./controllers/viaController');

routes.get('/semaphores/stop', semaphoreController.stop)
// routes.get('/semaphores/:id', semaphoreController.show)
// routes.post('/semaphores', semaphoreController.store)
// routes.put('/semaphores/:id', semaphoreController.update)
// routes.delete('/semaphores/:id', semaphoreController.delete)

// routes.get('/crossings', crossingController.index);
// routes.get('/crossings/:id', crossingController.show)
// routes.post('/crossings', crossingController.store);
// routes.put('/crossings/:id', crossingController.update);
// routes.delete('/crossings/:id', crossingController.delete);

// routes.get('/vias', viaController.index);
// routes.get('/vias/:id', viaController.show)
// routes.post('/vias', viaController.store);
// routes.put('/vias/:id', viaController.update);
// routes.delete('/vias/:id', viaController.delete);

module.exports = routes;