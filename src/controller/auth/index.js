import { Router } from 'express';
import passport from 'passport';

import { generateAccessToken, respond, authenticate } from '../../middleware/auth';

export default({ config, db }) => {
  let api = Router();

  /**
   * @swagger
   * /auth:
   *   post:
   *     summary: Authenticates into the application
   *     description:
   *       "Authenticates a user into the Squad Application"
   *     tags:
   *       - auth
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - username
   *             - password
   *           properties:
   *             username:
   *               type: string
   *             password:
   *               type: password
   *           example: {
   *             "username": "your@email.com",
   *             "password": "ExamplePassword1234!"
   *           }
   *     responses:
   *       200:
   *         description: Successfully logs user in
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *         examples:
   *           application/json: {
   *             "status": "Success",
   *             "message": "Successfully created new User!",
   *             "data": []
   *           }
   *       401:
   *         description: Fails to log a user in
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *         examples:
   *           application/json: {
   *             "status": "Failure",
   *             "message": "Failed to log in a user!",
   *             "data": []
   *           }
   *       409:
   *         description: Invalid json structure
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *         examples:
   *           application/json: {
   *             "status": "Failure",
   *             "message": "Check your json request body!",
   *             "data": []
   *           }
   */
  api.post('/', passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), generateAccessToken, respond
  );

  /**
   * @swagger
   * /auth:
   *   get:
   *     summary: Logs out of the application
   *     description:
   *       "Logs a user out of the Squad Application"
   *     tags:
   *       - auth
   *     parameters:
   *       - name: accessToken
   *         in: query
   *         required: true
   *         type: string
   *         description: The access token from authentication into the API
   *     responses:
   *       200:
   *         description: Successfully logs user in
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *         examples:
   *           application/json: {
   *             "status": "Success",
   *             "message": "Successfully created new User!",
   *             "data": []
   *           }
   *       401:
   *         description: Fails to log a user in
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *         examples:
   *           application/json: {
   *             "status": "Failure",
   *             "message": "Failed to log in a user!",
   *             "data": []
   *           }
   *       409:
   *         description: Invalid json structure
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *         examples:
   *           application/json: {
   *             "status": "Failure",
   *             "message": "Check your json request body!",
   *             "data": []
   *           }
   */
  api.get('/', authenticate, (req, res) => {
    res.logout();
    res.status(200).send('Successfully logged out.');
  });

  return api;
}
