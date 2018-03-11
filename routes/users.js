var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/ReactDB';
var collection = null;
var db = null;
var jwt = require('jsonwebtoken');

router.use(function(req, res, next) {

    var token =  req.headers['x-auth-token'];
    console.log(req.headers['x-auth-token']);
    if (token) {
        jwt.verify(token, "hello", function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.',err:err });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

MongoClient.connect(url, function(err, client) {
    if(err)
        console.log("Error Mongo server");
    db = client.db('ReactDB');
});

router.post('/savePlugin', function(req, res, next) {
    var id = req.decoded.user_id;
    data = req.body;
    data.user_id = id;
    console.log(data);
    console.log(data._id.length);
    if(data._id==undefined || data._id.length < 4){

        delete data._id;
    }
    if(data._id!=undefined && data._id.length > 4){
        console.log(data._id.length);
        data._id = new ObjectId(data._id);
    }
    saveUserPlugin(data,function (obj) {
        res.json({response:obj});
    })
});

router.post('/deletePlugin', function(req, res, next) {
    var id = req.decoded.user_id;
    data = req.body;
    data.user_id = id;

    deleteUserPlugin(data,function (obj) {
        res.json({response:obj});
    })
});

router.get('/getPluginList', function(req, res, next) {
    var id = req.decoded.user_id;
    getUserPlugin(id,function (obj) {
        res.json({response:obj});
    })
});

var saveUserPlugin = function(user, callback) {
    var collection = db.collection(collectionName);
    collection.save(user, function(err, result) {
        console.log(result.ops);
        var response = 1;
        if(err)response = 0;
        callback(response);
    });
}
var collectionName = "UserPluginInfo";
var getUserPlugin = function(user, callback) {
    var collection = db.collection(collectionName);
    collection.find({user_id:(user)}).toArray( function(err, result) {
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
