const express = require('express');
const controllers = require('../controllers');
const router = express.Router();

router.post('/auth/register', controllers.register);
router.post('/auth/login', controllers.login);
router.post('/user/details', controllers.login);

module.exports = router

