import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';

import auth from '../controller/auth';
import user from '../controller/user';

let router = express();

//Connect to database
initializeDb(db => {

  //Internal middleware
  router.use(middleware({ config, db }));

  // API Routes v1
  router.use('/auth', auth({ config, db }));
  router.use('/user', user({ config, db }));

});

export default router;
