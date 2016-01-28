var assert = require('assert');
var fs = require('fs');
var path = require('path');

var mongo = require('./manageMongo');
var songDB = require('./songDB');

var mixCollection = "mix";


module.exports = {    

    /**
     * Set a new database
     *
     * name is the name of the new database
     **/
    setDB: function(name){
        mongo.setDB(name);
    },

    //give the mix collection name
    getMixDB: function(){
	return mixCollection;
    },
       

    /**
     * write the mix which match with the songId contained in the mixCollection in res 
     *
     * songId is the id of the song which match with the mix
     * callback must be called at the end of the method
     **/
    getMixBySong: function (songId, callback) {
        if (isNaN(Number(songId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : songId is invalid"
                }
            );
        }
        else {
            var filter = { "song._id" : Number(songId) };
            mongo.findDocumentsByFilter(filter, mixCollection, function(err, results) {
                if (err) {
                    callback({
                        statusCode : 500,
                        errorMessage : err
                    });
                }
                else {
                    callback(null, results);

                }
            });
        }
    },

    /**
     * write the mix contained in the mixCollection in res
     *
     * res is the response 
     * callback must be called at the end of the method
     **/
    getAllMixes: function (callback) {
	    mongo.findDocuments(mixCollection, function(err, results) {
            if (err) {
                callback({
                    errorMessage : err
                });
            }
            else {
                callback(null, results);

            }
	    });
    },

    getMixByID: function (mixId, callback) {
        if (isNaN(Number(mixId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : mixID is invalid"
                }
            );
        }
        else {
            var filter = { "_id" : Number(mixId) };
            mongo.findDocumentsByFilter(filter, mixCollection, function(err, results) {
                if (err) {
                    callback({
                        errorMessage : err
                    });
                }
                else {
                    callback(null, results[0]);
                }
            });
        }
    },
    
    /**
     * add a mix in the database
     *
     * mix is the resource added in the database
     **/
    postMix: function(mix, callback) {
        mongo.findDocumentsByFilter({_id : mix["song_id"]}, songDB.getSongDB(), function(err, results) {
            if (err) {
                callback({
                    statusCode : 500,
                    errorMessage : err
                });
            }
            else {
                delete mix.song_id;
                mix.song = results[0];
                mix.comments = [];
                mongo.insertDocument(mix, mixCollection, function(err, results) {
                    if (err) {
                        callback({
                            statusCode : 500,
                            errorMessage : err
                        });
                    }
                    else {
                        callback(null, results);
                    }
                });
            }

        });
    },

    updateMix: function(updatedMix, callback) {
        this.getMixByID({"_id" : updatedMix._id}, function(err, mixToUpdate) {
            if (err) {
                callback(err);
            }
            else {
                mixToUpdate.effects = updatedMix.effects;
                mixToUpdate.name = updatedMix.name;
                this.postMix(mixToUpdate, callback);
            }
        });
    },

    /**
     * remove a mix in the database
     *
     * mixId is the id of the mix that will be removed
     **/
    removeMix: function(mixId, callback) {
	    var filter= {};
        if (isNaN(Number(mixId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : songId is invalid"
                }
            );
        }
        else {
            filter._id = Number(mixId);
            mongo.removeDocument(filter,mixCollection, function(err, deleted) {
                if (err) {
                    callback({
                        statusCode : 500,
                        errorMessage : err
                    });
                }
                else {
                    callback(null, deleted);
                }
            });
        }

    },

    /**
     * Remove all the mix from the database
     **/
    removeAllMixes: function(callback) {
	    mongo.removeAllDocuments(mixCollection, function(err, deleted) {
            if (err) {
                callback({
                    statusCode : 500,
                    errorMessage : err
                });
            }
            else {
                callback(null, deleted);
            }
	    });
    }
    
};
