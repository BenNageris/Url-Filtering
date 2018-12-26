'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
//var uri = "mongodb+srv://admin:TSVwH7krHADbGLWH@urlfiltering-xrq3l.gcp.mongodb.net/test?retryWrites=true";

/* GET home page. */
router.get('/', function (req, res) {
    res.render('Home');
});

router.post('/login', function (req, res) {
    console.log('/login');
    console.log(req.body.username);
    console.log(req.body.password);
    Parent.findOne({ "username": req.body.username }, function (err, parent) {
        if (err == null && parent != null && parent.validPassword(req.body.password)) {
            res.cookie('token', parent.generateJWT(), { maxAge: 900000, httpOnly: true });
            res.cookie('username', req.body.username, { maxAge: 900000, httpOnly: true });
            //return res.json({ "token": "succes" });
            //res.writeHead(302, {
            //    'Location': '/parents/'
            //});
            res.redirect(302, '/parents');
        }
        else {
            return res.render('describederror', { "desc": "username or password are incorrect" }); // error page
        }
    });
    //res.render('index', { title: 'Express' });
});

router.post('/reg', function (req, res) {
    var parent = new Parent();
    parent.username = req.body.username;
    parent.email = req.body.email;
    parent.childs = new Array();
    parent.setPassword(req.body.password);
    parent.save(function (err) {
        if (err == null) {
            //return res.json({ "token": parent.generateJWT() });
            res.cookie('token', parent.generateJWT(), { maxAge: 900000, httpOnly: true });
            res.cookie('username', req.body.username, { maxAge: 900000, httpOnly: true });
            res.redirect(302, '/parents');
        }
        else {
            //return res.json({ "err": err.message });
            return res.render('describederror', { "desc": err.message }); // error page
        }
        console.log(err);
    });
    //res.render('index', { title: 'Reg' });
});

module.exports = router;
