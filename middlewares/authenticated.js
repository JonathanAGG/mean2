'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'demo_secret';

exports.ensureAuth = (req, res, next)=>{
    //validate header field
    if(!req.headers.auth){
        return res.status(403).send({message: 'header auth no found'});
    }
    var token = req.headers.auth.replace(/['"]+/g,'');

    try {
        //decode token
        var payload = jwt.decode(token, secret);
        //if the authentication time to expired
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token to expired'});
        }        
    } catch (ex) {
        console.log(ex);
        return res.status(404).send({message: 'Token invalid'});
    }
    //add user data to req
    req.user = payload;
    next();
};