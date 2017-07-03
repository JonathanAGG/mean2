'use strict'
var fs = require('fs');//file system
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

/**
 * Store a new resource.
 */
var storage = (req, res) => {

	var user = new User();
	var params = req.body;

	//Validations
	if (!params.name || !params.lastname || !params.email || !params.password) {
		return res.status(200).send({ message: 'Enter all fields' });
	}
	//fill schema
	user.name = params.name;
	user.lastname = params.lastname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	//encrypt password
	bcrypt.hash(params.password, null, null, (err, hash) => {

		if (err) {
			return res.status(500).send({ message: 'Failed to encrypt password' });
		}

		user.password = hash;
		//Save resourse
		user.save((err, userStored) => {

			if (err || !userStored) {
				return res.status(500).send({ message: 'Failed to save resourse' });
			}
			//Successful storage
			return res.status(200).send({ data: userStored });
		});

	});
}

/**
 * Update a resource.
 */
var update = (req, res) => {

	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {

		if (err) {
			return res.status(500).send({ message: 'Failed to update data' });
		}
		if (!userUpdated) {
			return res.status(404).send({ message: 'User no found' });
		}
		return res.status(200).send({ userUpdated });
	});
}

/**
 * Upload image.
 */
var uploadImage = (req, res) => {

	var idUser = req.params.id;
	var fileName = 'null';
	//files: variable global multipart
	if (!req.files) {
		return res.status(200).send({ message: 'Image no found' });
	}
	//split: divide el path cada ves que encuentra '\' y genera un arreglo
	var filePath = req.files.image.path;
	var fileName = filePath.split('\\')[2];
	var fileExtension = fileName.split('\.')[1];

	if (fileExtension != 'jpg' && fileExtension != 'png' && fileExtension != 'gif') {
		return res.status(200).send({ message: 'Format not allowed' });
	}

	User.findByIdAndUpdate(idUser, { image: fileName }, (err, userUpdated) => {

		if (err) {
			return res.status(500).send({ message: 'Failed to update data' });
		}
		if (!userUpdated) {
			return res.status(404).send({ message: 'User no found' });
		}
		return res.status(200).send({ userUpdated });
	});
}
/**
 * Gets the user's image
 */
var getImageFile = (req, res) => {

	var filePath = './uploads/users/' + req.params.fileName;
	console.log(filePath);
	fs.exists(filePath, (exists) => {
		if (!exists) {
			return res.status(404).send({ message: 'Image no found' });
		}
		return res.sendFile(path.resolve(filePath));
	});
}


/**
 * Login User.
 */
var login = (req, res) => {

	var params = req.body;

	//Validations
	if (!params.email || !params.password) {
		return res.status(200).send({ message: 'Enter all fields' });
	}
	var email = params.email;
	var password = params.password;

	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		//validate errs
		if (err) {
			return res.status(500).send({ message: 'Request failed' });
		}
		if (!user) {
			return res.status(404).send({ message: 'User no found' });
		}
		//Compare password
		bcrypt.compare(password, user.password, (err, check) => {

			if (!check) {
				return res.status(404).send({ message: 'Bad Credentials' });
			}
			//Return user data
			if (params.gethash) {
				//Return a token to JWT
				return res.status(200).send({ jwt: jwt.createToken(user) });
			}
			return res.status(200).send({ user });
		});
	});
}

var demo = (req, res) => {
	res.status(200).send({ message: 'demooo' });
}


module.exports = {
	storage,
	update,
	uploadImage,
	getImageFile,
	demo,
	login
};