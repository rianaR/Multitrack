var assert = require('assert');
var fs = require('fs');
var path = require('path');

var mongo = require('./manageMongo');
var ObjectID = require('mongodb').ObjectID;
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
     * callback must be called at the end of the method
     **/
    getSongs: function (callback) {
        mongo.findDocuments(songCollection, function(err, results) {
            callback(err, results);
        });
    },

    /**
     *   insert a document into the database with verifications
     *
     *   song is the song to insert
     *   callback must be called at the end of the method
     **/
    postSong: function(song, callback) {
        var songValidation = inputValidator.validateSong(song);
        if (!songValidation.valid) {
            callback({
                statusCode : 400,
                errorMessage : songValidation.errorMessages
            });
        }
        else {
            mongo.insertDocument(song, songCollection, function (err, result) {
                if (err) {
                    callback({
                        statusCode : 500,
                        errorMessage : err
                    });
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
        if (!(ObjectID.isValid(songId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : song id is invalid"
                }
            );
        }
        mongo.removeDocument(songId,songCollection, function(err, results) {
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
