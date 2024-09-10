const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const SERVICE_ROUTES = require('./services');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const bindRouteHandler = (req, res, route) => {

  // TODO: add the middleware here

  route.handler(req, res);
};

for (const route of Object.values(SERVICE_ROUTES)) {

  if (!route || !route.method || !route.path || !route.handler) {
    continue;
  }

  switch (route.method.toUpperCase()) {
    case 'GET':
      app.get(route.path, (req, res) => {
        bindRouteHandler(req, res, route);
      });
      break;
    case 'POST':
      app.post(route.path, (req, res) => {
        bindRouteHandler(req, res, route);
      });
      break;
    case 'PUT':
      app.put(route.path, (req, res) => {
        bindRouteHandler(req, res, route);
      });
      break;
    case 'DELETE':
      app.delete(route.path, (req, res) => {
        bindRouteHandler(req, res, route);
      });
      break;
    default:
      break;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});