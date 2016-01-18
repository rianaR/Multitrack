var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var fs = require('fs');
var path = require('path');

var songCollection = "song";

var insertDocument = function(db,doc,collection,callback) {
    /*if (doc._id <= 0) {
        callback("Id must be greater than 0", null);
        return;
    }*/
   db.collection(collection).insertOne(doc, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the "+collection+ " collection.");
    callback(result);
  });
};


var findDocuments = function(db, res, collection, callback) {
   var cursor = db.collection(collection).find();
    var result = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
	  result.push(doc);
      } else {
	  res.write(JSON.stringify(result));
          callback();
      }
   });
};

var removeSong = function(db, id, collection, callback) {
    var filter= {};
    filter._id = Number(id);
    db.collection(collection).deleteMany(
      filter,
      function(err, results) {
	  assert.equal(err, null);
	  //console.log(results);
	  console.log("Song id="+id+" deleted.");
          callback();
      }
   );
};

var removeAllSongs = function(db, collection, callback) {
   db.collection(collection).deleteMany({},
      function(err, results) {
	  assert.equal(err, null);
	  console.log("All songs deleted.");
          callback();
      }
   );
};


module.exports = {    

    getSongDB: function(){
	return songCollection;
    },
    
    getSong: function (res,callback) {
	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    findDocuments(db, res,songCollection, function() {
            res.setHeader("Content-Type", "application/json");
            db.close();
            callback();
	    });
	});

    },
    
    postSong: function(song) {
	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    insertDocument(db,song,songCollection, function() {
		db.close();
	    });
	});
    },

    removeSong: function(songId) {
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
	    console.log("Connected correctly to server.");
	    removeSong(db,songId,songCollection, function() {
		db.close();
	    });
	});
    },

    removeAllSongs: function() {
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
	    console.log("Connected correctly to server.");
	    removeAllSongs(db,songCollection, function() {
		db.close();
	    });
	});
    }
    
};
