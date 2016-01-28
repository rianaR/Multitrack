var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var assert = require("assert");
var song = require('../server/songDB');
var mixDB = require('../server/mixDB');

// putting the data into the 'test' database:
MongoClient.connect('mongodb://127.0.0.1:27017/prod', function(err, db) {
    if(err) throw err;
    db.collection(song.getSongDB()).deleteMany({}, function(err, results) {
        console.log("All songs deleted");
        var songData = fs.readFileSync("songData.json");
        var JSONSongData = JSON.parse(songData);
        db.collection(song.getSongDB()).insertMany(JSONSongData, function(err, result) {
            assert.equal(null, err);
            console.log("Number of inserted songs : "+result.insertedCount);
            db.collection(mixDB.getMixDB()).deleteMany({}, function(err, results) {
                console.log("All mixes deleted");
                var mixData = fs.readFileSync("mixData.json");
                var JSONMixData = JSON.parse(mixData);
                db.collection(mixDB.getMixDB()).insertMany(JSONMixData, function(err, result) {
                    assert.equal(null, err);
                    console.log("Number of inserted mixes : " + result.insertedCount);
                    db.close();
                });
            });
        });
    });
});
