var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

//var UserSchema = new mongoose.Schema({
//    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
//    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
//    childes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
//    //following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//    hash: String,
//    salt: String
//}, { timestamps: true });
var ParentSchema = mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    childs: [{ name: String, domains: Array, categories: Array }]
}, { versionKey: false });

ParentSchema.plugin(uniqueValidator, { message: 'is already taken.' });

ParentSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('base64');
    return this.hash === hash;
};

ParentSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('base64');
};

ParentSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, process.env.SECRET);
};

//ParentSchema.methods.addChild = function (child_name, policy, callback) {
//    var child = new Object();
//    child.name = child_name;
//    child.policy = policy;
//    this.childs.push(child);
//    this.save(callback);
//};

ParentSchema.methods.getAllChilds = function () {
    var childs = new Array();
    if (this == null || this.childs == null)
        return childs;
    for (var i = 0; i < this.childs.length; i++) {
        var child = new Object();
        child.name = this.childs[i].name;
        child.domains = this.childs[i].domains;
        childs.push(child);
    }
    return childs;

};

ParentSchema.methods.getChildDomains = function (child_name) {
    var domains = new Array();
    if (this == null || this.childs == null)
        return domains;
    var idx = -1;
    for (var i = 0; i < this.childs.length; i++) {
        if (this.childs[i].name == child_name) {
            idx = i;
            break;
        }
    }
    if (idx == -1)
        return domains;
    for (var j = 0; j < this.childs[idx].domains.length; j++)
        domains.push(this.childs[idx].domains[j]);
    return domains;

};

mongoose.model('Parent', ParentSchema);
