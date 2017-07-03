'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var mdAuth = require('../middlewares/authenticated');

//multipart
var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/users'})

var api= express.Router();

api.post('/user', mdAuth.ensureAuth, UserController.storage);
api.put('/user/:id', mdAuth.ensureAuth, UserController.update);
api.post('/login', mdAuth.ensureAuth, UserController.login);

api.post('/upload-image/:id', [mdAuth.ensureAuth,mdUpload], UserController.uploadImage);
api.get('/get-image/:fileName', UserController.getImageFile);

api.get('/', UserController.demo);

module.exports = api;