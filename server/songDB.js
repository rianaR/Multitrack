var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var fs = require('fs');
var path = require('path');

var songCollection = "song";

var insertDocument = function(db,doc,collection,callback) {
   db.collection(collection).insertOne(doc, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the "+collection+ " collection.");
    callback(result);
  });
};


module.exports = {
    
    getSong: function (response) {
	
	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    var cursor = db.collection('songDB').find( );
	    result = [];
	    cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
		    result.push(doc);
		} else {
		    callback();
		}
	    });
	    db.close();
	    console.log(result);
	    response.write(JSON.stringify(result))
	});
    },
    
    postSong: function(song,res) {
	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    insertDocument(db,song,songCollection, function() {
		db.close();
	    });
	});

    }
};
