'use strict'

var mongoose = require('mongoose');
var app= require('./app');

//configurar un puerto
var port= process.env.PORT || 3977;

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean2', (err, res) =>{
	if(err){

		throw err;
	}else{
		console.log("ak7 :v");

		app.listen(port, () => {
			console.log('servidor escuchando en http://localhost:'+port);
		});
	}
});


