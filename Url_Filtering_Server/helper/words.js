var mongoose = require('mongoose');
var Word = mongoose.model('Word');
var request = require("request-promise");
var SimilarWord = mongoose.model('SimilarWord');

var addTheWord = function(word,res){
    console.log('addTheWord with param:'+word.baseWord);
    word.save(function (err) {
        if(err){
            return res.json({ "result": "Error in adding to DB" });  
        }
        else{
            return res.json({ "result": "Added Successfully to DB" });  
        }
    });
}

var count_word = async function(word){
    console.log('AddWordToDB with param:'+word.baseWord);
    var ret = await Word.count({baseWord: word.baseWord}, function(err, c) {
        if(err){
            return -1;
        }
        return c;
    });
    return ret;
} 

var addWord = async function(word,categories,res){
    var main_topic=categories.split(',')[0];
    console.log('main topic:'+main_topic);
    console.log('addWord with param:'+categories);
    var cnt= await count_word(main_topic);
    console.log('Number of appears for the word '+main_topic+" is:"+cnt.toString());
    if(cnt!=0){ //error or already in db
        res.send("error or already in db");
    }
    //Word needs to be added
    
    word= await get_similar_words(word,categories);
    addTheWord(word,res);
    
    //res.send(word);
}
var get_similar_words = async function(word,categories){
    var ret= await callAPI_mostsimilarity(categories,20);
    // Flask app formet to MongoDB format
    for(var i=0;i<ret.length;i++){
        var tmp=new SimilarWord();
        tmp.simillarword=ret[i][0];
        tmp.ratio=ret[i][1];
        word.simillarwords.push(tmp);
    }
    return word;
}
var callAPI_mostsimilarity = async function(word,num_close_words){
    var options = {
        uri: "<Word2Vec_SERVER_DOMAIN_NAME>/most_similarity",
        method: "GET",
        qs: {  // Query string like ?key=value&...
            word : word,
            x: num_close_words
        },
        json: true
    }
    try {
        var result = await request(options);
        console.log(result);
        return result;
    } catch (err) {
        console.error(err);
    }
}
module.exports = {
    addWord:addWord,
    callAPI_mostsimilarity:callAPI_mostsimilarity
}

