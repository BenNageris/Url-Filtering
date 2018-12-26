'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
var Word = mongoose.model('Word');
var jwt = require('jsonwebtoken');
var fs = require('fs');

/* GET home page. */

router.post('/login', function (req, res) {
    var obj = JSON.parse(req.body.obj);
    //var obj = req.body.obj;
    Parent.findOne({ "username": obj.username }, function (err, parent) {
        if (err == null && parent != null && parent.validPassword(obj.password)) {
            //res.cookie('token', parent.generateJWT(), { maxAge: 900000, httpOnly: true });
            //res.cookie('username', req.body.username, { maxAge: 900000, httpOnly: true });
            //return res.json({ "token": "succes" });
            //res.writeHead(302, {
            //    'Location': '/parents/'
            //});
            //res.end();
            return res.json({ username: obj.username, childs: parent.childs, token: parent.generateJWT() });
        }
        return res.json({ "err": "username or password are incorrect" });

    });
    //res.render('index', { title: 'Express' });
});

router.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});




router.get('/getchilds', function (req, res) {
    //return res.render('extensionShowChilds', { "Children": [{ name: "Aaaa" }] });
    Parent.findOne({ "username": req.decoded.username }, { childs: 1, _id: 0 }, function (err, child) {
        if (err == null && child != null) {
            return res.render('extensionShowChilds', { "Children": child.getAllChilds(), "Parent": req.decoded.username });
        }
        else {
            return res.render('error'); // error page
        }
    });
});

router.post('/getPolicys', function (req, res) {
    Parent.findOne({ 'username': req.decoded.username }).then(function (parent) {
        for (var i = 0; i < parent.childs.length; i++) {
            if (parent.childs[i].name == req.body.child) {
                var result = new Object();
                result.domains = parent.childs[i].domains;
                result.categories = parent.childs[i].categories;
                return res.json(result);
            }
        }
        return res.json({ "err": "error" });
    });
});

router.post('/getWords', function (req, res) {
    Word.find({ 'baseWord': { $in: req.body.category.trim().split(',') } }, { simillarwords: 1, _id: 0 }).then(function (word) {

        if (word == null)
            return res.json({ "err": "error" });
        var result = [];
        for (var k = 0; k < word.length; k++) {
            for (var i = 0; i < word[k].simillarwords.length; i++) {
                result.push({ "simillarword": word[k].simillarwords[i].simillarword, "ratio": word[k].simillarwords[i].ratio });
            }
        }

        fs.readFile('./public/js/injected.js', function (err, data) {
            //res.writeHead(200, { 'Content-Type': 'text/html' });
            //console.log("var arr = " + JSON.stringify(result) + ";" + data.toString());
            res.write("var arr = " + JSON.stringify(result) + ";" + data.toString());
            res.end();
        });

        //return res.json(result);
    });
});


module.exports = router;
