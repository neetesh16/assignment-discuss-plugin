var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/ReactDB';
var collection = null;
var db = null;
var jwt = require('jsonwebtoken');
var cert = "hello";
MongoClient.connect(url, function(err, client) {
    if(err)
        console.log("Error Mongo server");
    db = client.db('ReactDB');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/getData', function(req, res, next) {
    res.json({ data: [{
            id:1,
            website:"http:google.com",
            clientid:"0 Rice"
        },{
            id:2,
            website:"http:1.com",
            clientid:"1 Rice"
        },{
            id:3,
            website:"http:2.com",
            clientid:"2 Rice"
        },{
            id:4,
            website:"http:3.com",
            clientid:"3 Rice"
        }

        ] });
});

router.post('/user', function(req, res, next) {
    console.log("");
    console.log(JSON.stringify(req.auth));
    findUser(req.body,function(userObj){
        if(userObj.length==0){
            insertUser(req.body,function (obj) {
                var token = jwt.sign({ user_id: obj._id }, "hello", {

                });
                obj.XAuthToken = token;
                res.json((obj));
            })

        }else{
            var token = jwt.sign({ user_id: userObj[0]._id }, "hello", {

            });
            var user = userObj[0];
            user.XAuthToken = token;
            res.json((user));
            console.log(token);
        }
    })

});

var insertUser = function(user, callback) {
    var collection = db.collection(userCollection);
    collection.insert(user, function(err, result) {
        callback(result.ops[0]);
    });
}
var userCollection = "Users";
var findUser = function(user, callback) {
    var collection = db.collection(userCollection);
    collection.find({"profile.email":user.profile.email}).toArray( function(err, result) {
        callback(result);
    });
}

module.exports = router;
