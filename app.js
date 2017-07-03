'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app= express();

//cargar rutas
var UserRoutes = require('./routes/userRoutes');

//configurar body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http

//rutas base
app.use('/api', UserRoutes);

//exportar el modulo
module.exports = app;
