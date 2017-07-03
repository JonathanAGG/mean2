'use strict'
var fs = require('fs');//file system
var path = require('path');
var User = require('../models/artist');
var User = require('../models/song');
var User = require('../models/album');


/**
 * Store a new resource.
 */
var storage = (req, res) => {

	var user = new User();
	var params = req.body;

	//Validations
	if( !params.name || !params.lastname || !params.email || !params.password){
		return res.status(200).send({message: 'Enter all fields'});
	}
		//fill schema
		user.name = params.name;
		user.lastname = params.lastname;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = 'null';
		
		//encrypt password
		bcrypt.hash(params.password, null, null, (err, hash)=>{

			if(err){
				return res.status(500).send({message: 'Failed to encrypt password'});
			}

			user.password = hash;		
			//Save resourse
			user.save((err, userStored)=>{
						
				if(err || !userStored){
					return res.status(500).send({message: 'Failed to save resourse'});
				}
				//Successful storage
				return res.status(200).send({data: userStored});
			});
			
		});
}
