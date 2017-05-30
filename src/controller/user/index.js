import { Router } from 'express';
import passport from 'passport';

import User from '../../models/user';

import { authenticate } from '../../middleware/auth';
import { defaultResponseModel } from '../../utils/response';

export default({ config, db }) => {
  let api = Router();

  /**
   * @swagger
   * /user:
   *   post:
   *     summary: Register New User
   *     description:
   *       "Endpoint to create a new user."
   *     tags:
   *       - user
   *     parameters:
   *       - name: body
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - email
   *             - password
   *             - fullName
   *             - role
   *             - homeTown
   *             - dateOfBirth
   *             - squads
   *             - badges
   *           properties:
   *             email:
   *               type: string
   *               description: email of the user
   *               unique: true
   *             password:
   *               type: password
   *               description: desired password of the user
   *             fullName:
   *               type: string
   *               description: full name of the user
   *             role:
   *               type: string
   *               description: role of the user
   *               enum: [ admin, user ]
   *             homeTown:
   *               type: object
   *               description: location of the user
   *               properties:
   *                 location:
   *                   type: string
   *                 coordinates:
   *                   type: array
   *                   items:
   *                     type: number
   *                     properties:
   *                       longitude:
   *                         type: integer
   *                       latitude:
   *                         type: integer
   *             dateOfBirth:
   *               type: Date
   *               description: user's birthday in ISO time
   *             squads:
   *               type: array
   *               description: List of Squads that the user belongs to
   *             badges:
   *               type: array
   *               description: Badges that the user has earned
   *           example: {
   *             "email": "example.user@gmail.com",
   *             "password": "Example1234!",
   *             "fullName": "Example User",
   *             "role": "user",
   *             "homeTown": {
   *               "location": "Manchester, NH",
   *               "coordinates": [-71.431990, 42.955041]
   *             },
   *             "dateOfBirth": "1995-02-03T00:00:00.000Z",
   *             "squads": [],
   *             "badges": []
   *           }
   *     responses:
   *       201:
   *         description: User Has Successfully been created!
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *             message:
   *               type: string
   *             data:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *         examples:
   *           application/json: {
   *             "status": "Success",
   *             "message": "Successfully created new User!",
   *             "data": [{ _id: "524n6o743x2of86b8a9md681f5sd69" }]
   *           }
   *       401:
   *         description: Failure to create user
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
   *             "message": "Unable to create user!",
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
  api.post('/', (req, res) => {
    User.register(new User({
      username: req.body.email,
      fullName: req.body.fullName,
      role: req.body.role,
      homeTown: req.body.homeTown,
      dateOfBirth: req.body.dateOfBirth,
      squads: req.body.squads,
      badges: req.body.badges

    }), req.body.password, (err, user) => {
      if (err) {
        console.log('error', err.name)
        if(err.name === 'MissingUsernameError' || err.name === 'MissingPasswordError'){
          res.status(401);
          res.json(defaultResponseModel(false, 'Must have a valid email or password.', []));
        } else if(err.name === 'UserExistsError'){
          res.status(401).json(defaultResponseModel(false, 'A user already exists with this email. Please try again', []));
        } else if(err.name === 'ValidationError'){
          res.status(401).json(defaultResponseModel(false, 'Invalid JSON request. Please check and try again', []));
        }

        res.send(err);
      }

      passport.authenticate(
        'local', {
          session: false
        }
      )(req, res, () => {
        console.log('res', res.token);
        console.log('user', user._id);
        res.status(201).send(defaultResponseModel(true, 'New User registered successfully.', {
          _id: user._id
        }))
      });
    });
  });

  /**
   * @swagger
   * /user/{{id}}:
   *   get:
   *     summary: Get A User By ID
   *     description:
   *       "Endpoint to get a user by their user ID."
   *     tags:
   *       - user
   *     parameters:
   *       - name: id
   *         in: query
   *         description: The id of the user to get from the database
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully retrieved user data!
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
   *             "message": "User has been found!",
   *             "data": {
   *
   *               "_id": "524n6o743x2of86b8a9md681f5sd69",
   *               "username": "example.user@gmail.com",
   *               "fullName": "Example User",
   *               "role": "user",
   *               "dateOfBirth": "1970-04-18T10:49:58.723Z",
   *               "__v": 0,
   *               "createdDate": "2017-05-30T00:28:33.511Z",
   *               "badges": [],
   *               "squadTokens": 250,
   *               "refCode": "ABC123",
   *               "squads": [ "1A2B3C4D5E6F", "7G8H9I8J7K6" ],
   *               "homeTown": {
   *                 "location": "Manchester, NH",
   *                 "coordinates": [-71.431990, 42.955041]
   *               }
   *             }
   *           }
   *       401:
   *         description: Failure to delete user
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
   *             "message": "Unable to delete user!",
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
   *             "message": "Unable to delete the user. Please check the user ID!",
   *             "data": []
   *           }
   */
  api.get('/:id', authenticate, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        if(err.kind === 'ObjectId') {
          res.status(401);
          res.json({ code: 200, status: 'Failure', data: [] })
        }
      }
      res.json({ code: 200, status: 'Success', data: user });
    });
  });

  /**
   * @swagger
   * /user/{{id}}:
   *   delete:
   *     summary: Delete A User By ID
   *     description:
   *       "Endpoint to delete a user."
   *     tags:
   *       - user
   *     parameters:
   *       - name: id
   *         in: query
   *         description: The id of the user to delete from the database
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: User Has Successfully been deleted!
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
   *             "message": "User successfully deleted!",
   *             "data": []
   *           }
   *       401:
   *         description: Failure to delete user
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
   *             "message": "Unable to delete user!",
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
   *             "message": "Unable to delete the user. Please check the user ID!",
   *             "data": []
   *           }
   */
  api.delete('/:id', authenticate, (req, res) => {
    User.remove({
      _id: req.params.id
    }, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "User Successfully Removed"})
    })
  });

  return api;
}
