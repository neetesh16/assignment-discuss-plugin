var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'template.js');
var md5 = require('md5');
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/ReactDB';
var collection = null;
var db = null;
var jwt = require('jsonwebtoken');
var format = require("string-template")
router.get('/', function(req, res, next) {
    var apiKey = req.query.apiKey;
    var referer = (req.headers.referer);
    console.log(apiKey);
    console.log(referer);
    getPluginById(apiKey,function(result){
        console.log(result);
        if(result.length > 0 && result[0].website===referer){
            fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
                if (!err) {
                    var ret = format(data, {
                        apiKey: apiKey
                    })
                    res.setHeader('content-type', 'application/javascript; charset=utf-8');
                    res.send(ret);
                }
            });

        }else{
            res.setHeader('content-type', 'application/javascript; charset=utf-8');
            res.send("alert('Error Wrong Credentials');");
        }
    })



});

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


MongoClient.connect(url, function(err, client) {
    if(err)
        console.log("Error Mongo server");
    db = client.db('ReactDB');
});

router.get('/comments', function(req, res, next) {
    var apiKey = req.query.apiKey;
    getPluginComments(apiKey,function (obj) {
        res.json({response:obj});
    })
});

router.post('/savecomments', function(req, res, next) {
    var apiKey = req.query.apiKey;
    console.log(apiKey);
    console.log(req.body);
    var data = req.body;
    data.plugin_id = apiKey;
    data.timestamp = new Date().getTime();
    savePluginComments(data,function (obj) {
        res.json({response:obj});
    })
});


var savePluginComments = function(data, callback) {
    var collection = db.collection(collectionName);
    collection.save(data, function(err, result) {
        console.log(result.ops);
        var response = 1;
        if(err)response = 0;
        callback(response);
    });
}
var collectionName = "PluginComments";
var collectionUserPlugin = "UserPluginInfo";
var getPluginComments = function(apiKey, callback) {
    var collection = db.collection(collectionName);
    collection.find({plugin_id:(apiKey)}).sort({timestamp:1}).limit(100).toArray( function(err, result) {
        callback(result);
    });
}

var getPluginById = function(apiKey, callback) {
    var collection = db.collection(collectionUserPlugin);
    collection.find({_id:new ObjectId(apiKey)}).toArray( function(err, result) {
        callback(result);
    });
}

var deleteUserPlugin = function(data, callback) {
    var collection = db.collection(collectionName);
    collection.remove({user_id:data.user_id,_id:new ObjectId(data._id)},function(err, result) {
        var response = 1;
        if(err)response = 0;
        callback(response);
    });
}

module.exports = router;
