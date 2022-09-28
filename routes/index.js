const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const middleware = require('../helper/middleware');

router.post('/auth/register', controllers.register);
router.post('/auth/login', controllers.login);
router.put('/auth/update-password', middleware.mustLogin, controllers.updatePassword); 
router.delete('/auth/delete', middleware.mustLogin, controllers.delete); 

module.exports = router

