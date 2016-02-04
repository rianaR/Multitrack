var assert = require('assert');
var fs = require('fs');
var path = require('path');

var mongo = require('./manageMongo');
var ObjectID = require('mongodb').ObjectId;
var songDB = require('./songDB');
var user = require('./userDB');

var inputValidator = require('./inputValidator');

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

        if (!(ObjectID.isValid(songId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : songId is invalid"
                }
            );
        }
        else {
            var object_id = new ObjectID(songId);
            var filter = { "song._id" :  object_id};
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
        if (!(ObjectID.isValid(mixId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : mix id is invalid"
                }
            );
        }
        else {
            var filter = { "_id" : new ObjectID(mixId) };
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

    postMix: function(mix, callback) {
        var mixValidation = inputValidator.validateMix(mix);
        if (!mixValidation.valid) {
            callback({
                statusCode : 400,
                errorMessage : mixValidation.errorMessages
            });
        }
        else {
            var songID = new ObjectID(mix.song_id);
            mongo.findDocumentsByFilter({ "_id" : songID }, songDB.getSongDB(), function(err, results) {
                if (err) {
                    //Le mix n'est asoscié à aucune chanson
                    callback({
                        statusCode : 500,
                        errorMessage : err
                    });
                }
                else {
                    //On remplace l'id de chanson par la chanson entière
                    delete mix.song_id;
                    mix.song = results[0];
                    mix.comments = [];
                    if (mix.hasOwnProperty("_id")) {
                        mix._id = new ObjectID(mix._id);
                        mongo.updateDocument(mix, mixCollection, function(err, results) {
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
                    else {
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
                }

            });
        }
    },


    /**
     * add a mix in the database and associate it to a user
     *
     * connection is the connection token
     * mix is the resource added in the database
     **/
    postUserMix: function(connection, mix, callback) {
        var app = this;
        user.getUser(connection,function(err,user1){
            if(err){
                callback(err);
            }
            else{
                app.postMix(mix,function(err,postedMix){
                    if(err){
                        callback(err);
                    }
                    else{
                        user1.mixes.push(postedMix.insertedId);
                        user.updateUser(user1,function(err,results){
                            callback(err,results);
                        });
                    }
                });
            }
        });
    },


    updateMix: function(updatedMix, callback) {
        var app = this;
        this.getMixByID(String(updatedMix._id), function(err, mixToUpdate) {
            if (err) {
                callback(err);
            }
            else {
                mixToUpdate.effects = updatedMix.effects;
                mixToUpdate.name = updatedMix.name;
                mongo.updateDocument(mixToUpdate,mixCollection,function(err,results){
                    callback(err,results);
                });
            }
        });
    },

    updateUserMix: function(connection, updateMix, callback){
        var app =  this;
        user.getUser(connection,function(err,user1){
            if(err){
                callback(err);
            }
            else{
                if(checkRight(user1,updateMix._id)){
                    app.updateMix(updateMix,callback);
                }
                else{
                    callback(
                        {
                            statusCode : 401,
                            errorMessage : "Unauthorized, you don't have the right to update this mix"
                        }
                    );
                }
            }
        });
    },

    /**
     * remove a mix in the database
     *
     * mixId is the id of the mix that will be removed
     **/
    removeMix: function(mixId, callback) {
        if (!(ObjectID.isValid(mixId))) {
            callback(
                {
                    statusCode : 400,
                    errorMessage : "Invalid request : mix id is invalid"
                }
            );
        }
        else {
            mongo.removeDocument(mixId, mixCollection, function(err, deleted) {
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
     * remove the mix if the user have the rights for it
     *
     * connection is the connection token
     * mixId is the id of the mix
     *
     **/
    removeUserMix: function(connection,mixId, callback){
	var app =  this;
	user.getUser(connection,function(err,user1){
	    if(err){
		callback(err);
	    }
	    else{
		if(checkRight(user1,updateMix._id)){
		    app.removeMix(mixId,callback);
		}
		else{
		    callback(
			{
			    statusCode : 401,
			    errorMessage : "Unauthorized, you don't have the right to update this mix"
			}
		    );
		}
	    }
	});
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

function checkRight(user,mixId){

    if(user.right == "admin"){
	return true;
    }
    else{
	for(var i = 0 ; i<user.mixes.length; i++){
	    if(user.mixes[i].equals(mixId)){
		return true;
	    }
	}
	return false;
    }

}
