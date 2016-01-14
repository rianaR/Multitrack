var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var fs = require('fs');
var path = require('path');

var songDB = "song";

module.exports = {
    
    getSong: function () {
	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    var result = {}
	    var cursor = db.collection('songDB').find( );
	    cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
		    console.dir(doc);
		} else {
		    callback();
		}
	    });

	    db.close();
	    
	});
    },
    
    postSong: function(song) {

	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    
	    db.collection(songBD).insertOne(song, function(err, result) {
		assert.equal(err, null);
		console.log("Inserted a document into the restaurants collection.");
		callback(result);
	    });

	    db.close();
	    
	});
    }
};
