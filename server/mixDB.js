var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/prod';
var fs = require('fs');
var path = require('path');

var mongo = require('./manageMongo');

var mixCollection = "mix";


module.exports = {    

    /**
     * Set a new database
     *
     * name is the name of the new database
     **/
    setDB: function(name){
	url = 'mongodb://localhost:27017/'+name;
    },

    //give the mix collection name
    getMixDB: function(){
	return mixCollection;
    },
       

    /**
     * write the mix which match with the songId contained in the mixCollection in res 
     *
     * res is the response 
     * songId is the id of the song which match with the mix
     * callback must be called at the end of the method
     **/
    getMixBySong: function (res,songId,callback) {
	MongoClient.connect(url, function(err,db) {
        if (err) {
            console.error(err);
        }
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    var filter = {}
	    filter.songId = Number(songId);
	    mongo.findDocumentsByFilter(db, res,filter,mixCollection, function() {
            db.close();
            callback();
	    });
	});

    },

    /**
     * write the mix contained in the mixCollection in res
     *
     * res is the response 
     * callback must be called at the end of the method
     **/
    getAllMix: function (res,callback) {
	MongoClient.connect(url, function(err,db) {
        if (err) {
            console.error(err);
        }
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    mongo.findDocuments(db, res,mixCollection, function() {
            db.close();
            callback();
	    });
	});

    },
    
    /**
     * add a mix in the database
     *
     * mix is the resource added in the database
     **/
    postMix: function(mix) {

	MongoClient.connect(url, function(err,db) {
	    assert.equal(null,err);
	    console.log("Connected correctly to server.");
	    mongo.insertDocument(db,mix,mixCollection, function() {
		db.close();
	    });
	});

    },

    /**
     * remove a mix in the database
     *
     * mixId is the id of the mix that will be removed
     **/
    removeMix: function(mixId) {
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
	    console.log("Connected correctly to server.");
	    var filter= {};
	    filter._id = Number(mixId);
	    mongo.removeDocument(db,filter,mixCollection, function() {
		db.close();
	    });
	});
    },

    /**
     * Remove all the mix from the database
     **/
    removeAllMix: function() {
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
	    console.log("Connected correctly to server.");
	    mongo.removeAllDocuments(db,mixCollection, function() {
		db.close();
	    });
	});
    }
    
};
