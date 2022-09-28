const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const middleware = require('../helper/middleware');

router.post('/auth/register', controllers.register);
router.post('/auth/login', controllers.login);
router.get('/user/details', middleware.mustLogin, controllers.userDetails); 

module.exports = router

