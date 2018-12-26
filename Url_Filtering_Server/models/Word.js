
var mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;

var SimilarWordScheme = mongoose.Schema({
    simillarword: String,
    ratio: SchemaTypes.Number
}, { versionKey: false });

var WordsSchema = mongoose.Schema({
    baseWord: { type: String, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },
    simillarwords: [SimilarWordScheme]
}, { versionKey: false });

mongoose.model('Word', WordsSchema);
mongoose.model('SimilarWord', SimilarWordScheme);