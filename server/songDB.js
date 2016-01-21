var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/prod';
var fs = require('fs');
var path = require('path');

var mongo = require('./manageMongo');

var songCollection = "song";


module.exports = {    

    /**
     * Set a new database
     *
     * name is the name of the new database
     **/
    setDB: function(name){
	url = 'mongodb://localhost:27017/'+name;
    }

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
	    mongo.findDocuments(db, res,songCollection, function() {
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
	    mongo.insertDocument(db,song,songCollection, function() {
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
	    var filter= {};
	    filter._id = Number(songId);
	    mongo.removeDocument(db,filter,songCollection, function() {
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
	    mongo.removeAllDocuments(db,songCollection, function() {
		db.close();
	    });
	});
    }
    
};
