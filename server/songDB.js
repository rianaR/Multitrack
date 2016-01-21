var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var fs = require('fs');
var path = require('path');

var songCollection = "song";

/**
*   insert a document into the database
*
*   db is the mongodb client
*   doc is the song to insert
*   collection is the name of the table in mongodb
*   callback must be called at the end of the method
**/
var insertDocument = function(db,doc,collection,callback) {
    //check if the json is correct
    if (doc._id <= 0) {
	console.log("id<0");
        callback("Id must be greater than 0", null);
    }
    //insert the song if json is correct
    else{
	console.log("insert");
	db.collection(collection).insertOne(doc, function(err, result) {
	    assert.equal(err, null);
	    console.log("Inserted a document into the "+collection+ " collection.");
	    callback(result);
	});
    }
};



/**
*   find a document into the database
*
*   db is the mongodb client
*   res is res where method wil write the result
*   collection is the name of the table in mongodb
*   callback must be called at the end of the method
**/
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

/**
*   remove a document from the database
*
*   db is the mongodb client
*   id is the id of the document to remove
*   collection is the name of the table in mongodb
*   callback must be called at the end of the method
**/
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

/**
*   remove all from the database
*
*   db is the mongodb client
*   collection is the name of the table in mongodb
*   callback must be called at the end of the method
**/
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

    //give the song collection name
    getSongDB: function(){
	return songCollection;
    },
    
    /**
     * write the song contained in the songCollection in res
     *
     * res is the response 
     * callback must be called at the end of the method
     **/
    getSong: function (res,callback) {
	MongoClient.connect(url, function(err,db) {
        if (err) {
            console.error(err);
        }
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    findDocuments(db, res,songCollection, function() {
            db.close();
            callback();
	    });
	});

    },
    
    /**
     * add a song in the database
     *
     * song is the resource added in the database
     **/
    postSong: function(song) {
	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    insertDocument(db,song,songCollection, function() {
		db.close();
	    });
	});
    },

    /**
     * remove a song in the database
     *
     * songId is the id of the song that will be removed
     **/
    removeSong: function(songId) {
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
	    console.log("Connected correctly to server.");
	    removeSong(db,songId,songCollection, function() {
		db.close();
	    });
	});
    },

    /**
     * Remove all the song from the database
     **/
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
