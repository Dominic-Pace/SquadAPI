import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';

let app = express();

const spec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Squad API',
      version: 'Beta'
    },
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    security: [
      { jwt: [] }
    ],
    tags: [
      {
        name: 'auth',
        description: 'Authentication for Squad'
      },
      {
        name: 'user',
        description: 'Squads Users'
      }
    ]
  },
  apis: [
    'app/controller/auth/index.js',
    'app/controller/user/index.js'
  ],

});

app.server = http.createServer(app);

// Middleware
// Parse application/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

// Passport config
app.use(passport.initialize());
let User = require('./models/user');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  User.authenticate()
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// API Routes v1
app.use('/v1', routes);

// Serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(spec);
});

app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(spec));

app.server.listen(process.env.PORT || 3005);

export default app;
