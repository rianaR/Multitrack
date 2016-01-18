var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var assert = require("assert");

// putting the data into the 'test' database:
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    db.collection('songs').deleteMany({}, function(err, results) {
        var data = fs.readFileSync("data.json");
        var JSONData = JSON.parse(data);
        db.collection('songs').insertMany(JSONData, function(err, result) {
            assert.equal(null, err);
            console.log("Number of inserted documents : "+result.insertedCount);
            db.close();
        });
    });
});