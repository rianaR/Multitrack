var assert = require('assert');
var fs = require('fs');
var path = require('path');

var mongo = require('./manageMongo');
var inputValidator = require('./inputValidator');

var songCollection = "song";


module.exports = {
    setDB : function(name) {
        mongo.setDB(name);
    },
    //give the song collection name
    getSongDB: function(){
	    return songCollection;
    },
    
    /**
     * get all songs from database
     *
     * res is the response 
     * callback must be called at the end of the method
     **/
    getSong: function (callback) {
        mongo.findDocuments(songCollection, function(err, results) {
            callback(err, results);
        });
    },

    /**
     *   insert a document into the database with verifications
     *
     *   song : song to insert
     *   callback must be called at the end of the method
     **/
    postSong: function(song, callback) {
        var songValidation = inputValidator.validateSong(song);
        if (!songValidation.valid) {
            callback(songValidation.errorMessage);
        }
        else {
            mongo.insertDocument(song, songCollection, function (err, result) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
    },

    /**
     * remove a song in the database
     *
     * songId is the id of the song that will be removed
     **/
    removeSong: function(songId, callback) {
        var filter= {};
        filter._id = Number(songId);
        mongo.removeDocument(filter,songCollection, function(err, results) {
            callback(err, results);
        });
    },

    /**
     * Remove all the song from the database
     **/
    removeAllSongs: function(callback) {
        mongo.removeAllDocuments(songCollection, function(err, results) {
            callback(err, results);
        });
    }
};
