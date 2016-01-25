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
    getMixBySong: function (songId,callback) {
	    var filter = {}
	    filter.songId = Number(songId);
	    mongo.findDocumentsByFilter(filter, mixCollection, function(err, results) {
            callback(err, results);
	    });
    },

    /**
     * write the mix contained in the mixCollection in res
     *
     * res is the response 
     * callback must be called at the end of the method
     **/
    getAllMix: function (callback) {
	    mongo.findDocuments(mixCollection, function(err, results) {
            callback(err, results);
	    });
    },
    
    /**
     * add a mix in the database
     *
     * mix is the resource added in the database
     **/
    postMix: function(mix, callback) {
	    mongo.insertDocument(mix, mixCollection, function(err, results) {
			callback(err, results);
	    });
    },

    /**
     * remove a mix in the database
     *
     * mixId is the id of the mix that will be removed
     **/
    removeMix: function(mixId, callback) {
	    var filter= {};
	    filter._id = Number(mixId);
	    mongo.removeDocument(filter,mixCollection, function(err, deleted) {
			callback(err, deleted);
	    });
    },

    /**
     * Remove all the mix from the database
     **/
    removeAllMix: function(callback) {
	    mongo.removeAllDocuments(db,mixCollection, function(err, deleted) {
			callback(err, deleted);
	    });
    }
    
};
