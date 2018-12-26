'use strict';
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Parent = mongoose.model('Parent');
var helperWords=require('../helper/words.js');
var Word = mongoose.model('Word');

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

router.get('/', function (req, res) {
    return res.render('index', { title: req.decoded.username });
});

router.get('/logout', function (req, res) {
    console.log('logout function in index.js');
    res.cookie('token', '', { maxAge: -99999, httpOnly: true });    // cookie removal
    res.cookie('username', '', { maxAge: -99999, httpOnly: true }); // cookie removal
    //res.render('Home');
    res.redirect(302, '/');
});

router.get('/:parent/getAllChilds', function (req, res) {
    console.log(req.params.parent);
    Parent.findOne({ "username": req.params.parent }, { childs: 1, _id: 0 }, function (err, obj) {
        if (err == null && obj != null) {
            return res.render('childs', { "Children": obj.getAllChilds(), "Parent": req.params.parent });
        }
        else {
            return res.render('error'); // error page
        }
    });
});

router.get('/:parent/selectChildToAdd', function (req, res) {
    console.log('selectChildToAdd');
    Parent.findOne({ "username": req.params.parent }, { childs: 1, _id: 0 }, function (err, obj) {
        if (err == null && obj != null) {
            return res.render('selectAddRemoveChild', { "desc": "Insert name of child to add ", "Children": obj.getAllChilds(), "Parent": req.params.parent, "Flow": "addChild" });
        }
        else {
            return res.render('error'); // error page
        }
    });
});

router.post('/:parent/AddChild', function (req, res) {
    Parent.update(
        { "username": req.params.parent },
        { $push: { "childs": { "name": req.body.child_name, "domains": [] } } },
        function (err, obj) {
            console.log(obj);
            if (err == null && obj.nModified == 1) {
                return res.json({ "succes": true });
            }
            else {
                return res.json({ "succes": false, "err": obj });
            }
        });
    //res.json({ "decoded": req.decoded, "parent": req.params.parent });
    //Parent.findOne({ "username": req.params.parent }, function (err, parent) {
    //    console.log(parent);
    //    if (err == null && parent != null) {
    //        parent.addChild(req.body.child_name, req.body.policy, function (err) {
    //            if (err == null) {
    //                return res.json({ "succes": true });
    //            }
    //            else {
    //                return res.json({ "succes": false, "err": err.message });
    //            }
    //        });
    //    }
    //    else {
    //        return res.json({ "err": "parent not exist" });

    //    }
    //    //return res.json({ "token": parent.generateJWT() });
    //    //return res.json({ "err": "username or password are incorrect" });

    //});
});

router.get('/:parent/selectChildToRemove', function (req, res) {
    console.log('selectChildToRemove');
    Parent.findOne({ "username": req.params.parent }, { childs: 1, _id: 0 }, function (err, obj) {
        if (err == null && obj != null) {
            return res.render('selectAddRemoveChild', { "desc": "Insert name of child to remove ", "Children": obj.getAllChilds(), "Parent": req.params.parent, "Flow": "removeChild" });
        }
        else {
            return res.render('error'); // error page
        }
    });
});

router.post('/:parent/:child/RemoveChild', function (req, res) {
    Parent.update(
        { "username": req.params.parent },
        { $pull: { "childs": { "name": req.params.child } } },
        { "multi": true },
        function (err, obj) {
            //console.log(obj);
            if (err == null && obj.nModified == 1) {
                return res.json({ "succes": true });
            }
            else {
                return res.json({ "succes": false, "err": obj });
            }
        });
    //Parent.findOne({ "username": req.params.parent }, function (err, parent) {
    //    console.log(parent);
    //    if (err == null && parent != null) {
    //        parent.addChild(req.body.child_name, req.body.policy, function (err) {
    //            if (err == null) {
    //                return res.json({ "succes": true });
    //            }
    //            else {
    //                return res.json({ "succes": false, "err": err.message });
    //            }
    //        });
    //    }
    //    else {
    //        return res.json({ "err": "parent not exist" });

    //    }
    //    //return res.json({ "token": parent.generateJWT() });
    //    //return res.json({ "err": "username or password are incorrect" });

    //});
});

router.get('/:parent/selectAddDomain', function (req, res) {
    console.log('selectChildToRemove');
    Parent.findOne({ "username": req.params.parent }, { childs: 1, _id: 0 }, function (err, obj) {
        if (err == null && obj != null) {
            return res.render('selectAddRemoveDomain', { "desc": "Add Domain", "Children": obj.getAllChilds(), "Parent": req.params.parent, "Flow": "addDomain" });
        }
        else {
            return res.render('error'); // error page
        }
    });
});

router.post('/:parent/:child/AddDomain', function (req, res) {
    Parent.findOne({ 'username': req.params.parent }).then(function (parent) {
        for (var i = 0; i < parent.childs.length; i++) {
            if (parent.childs[i].name == req.params.child) {
                parent.childs[i].domains.push(req.body.domain);
            }
        }
        parent.save(function (err) {
            if (err)
                return res.json({ "succes": false, "err": err });
            else
                return res.json({ "succes": true });
        });
        //return res.json({ "succes": false, "err": myDoc });


    });
});

router.get('/:parent/selectRemoveDomain', function (req, res) {
    console.log('selectChildToRemove');
    Parent.findOne({ "username": req.params.parent }, { childs: 1, _id: 0 }, function (err, obj) {
        if (err == null && obj != null) {
            return res.render('selectAddRemoveDomain', { "desc": "Remove Domain", "Children": obj.getAllChilds(), "Parent": req.params.parent, "Flow": "removeDomain" });
        }
        else {
            return res.render('error'); // error page
        }
    });
});

router.post('/:parent/:child/RemoveDomain', function (req, res) {
    Parent.findOne({ 'username': req.params.parent }).then(function (parent) {
        for (var i = 0; i < parent.childs.length; i++) {
            if (parent.childs[i].name == req.params.child) {
                console.log(parent.childs[i].domains.indexOf(req.body.domain));
                parent.childs[i].domains.splice(parent.childs[i].domains.indexOf(req.body.domain));
            }
        }
        parent.save(function (err) {
            if (err)
                return res.json({ "succes": false, "err": err });
            else
                return res.json({ "succes": true });
        });
        //return res.json({ "succes": false, "err": myDoc });


    });
});

router.post('/:parent/:child/AddCategory',async function (req, res) { 
    // the category comes in this format 'CATEGORYNAME,category1,category2,...,categoryX'
    console.log(req.body.category);
    var categories=req.body.category.split(',');
    console.log(categories[0]);
    Parent.findOne({ 'username': req.params.parent }).then(function (parent) {
        for (var i = 0; i < parent.childs.length; i++) {
            if (parent.childs[i].name == req.params.child) {
                parent.childs[i].categories.push(categories[0]);
            }
        }
        parent.save(function (err) {
            if (err)
                console.log('error in paret saving');
        });
    });
    var word = new Word();
    word.baseWord=categories[0];
    await helperWords.addWord(word,req.body.category,res); 
});



router.post('/addRemoveDomain', function (req, res) {
    console.log('addRemoveDomain function in index.js');
    var domain_to_add = req.body.domain;
    var username = req.cookies.username;
    var flow = req.body.Flow;
    var childname = req.body.submit;
    console.log("Domain:" + domain_to_add + " ,Child Name:" + childname + " ,Flow:" + flow);
    switch (flow) {
        case 'addDomain':
            res.redirect(307, '/parents/' + username + '/' + childname + '/AddDomain');
            break;
        case 'removeDomain':
            res.redirect(307, '/parents/' + username + '/' + childname + '/RemoveDomain');
            break;
        default:
            res.end();
            break;
    }
});

router.post('/addOrRemoveChild', function (req, res) {
    console.log('addOrRemoveChild function in index.js');
    var username = req.cookies.username;
    var action = req.body.sub; // the submit button's value contains the method action -- look at selectAddRemoveChild.pug
    switch (action) {
        case "addChild":
            console.log('switch-case: addChild');
            res.redirect(307, '/parents/' + username + '/AddChild');
            break;
        case "removeChild":
            console.log('switch-case: removeChild');
            var childname = req.body.child_name;
            console.log(childname);
            res.redirect(307, '/parents/' + username + '/' + childname + '/RemoveChild');
            break;
        default: // unsupported action
            return res.render('error'); // error page
    }
});



module.exports = router;
