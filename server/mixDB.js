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
	if(!(ObjectID.isValid(mixId.toString()))){
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
		mongo.findDocuments(mixCollection,function(err,res){
		    if (err) {
			callback({
                            errorMessage : err
			});
                    }
		    else if(results.length!=1){
			callback({
			    errorMessage : "Invalid ID, no matching found"
			});
		    }
                    else {
			callback(null, results[0]);
                    }
		});
            });
        }
    },

    postMix: function(mix, callback) {
        var mixDB = this;
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
                else if (mix.hasOwnProperty("_id")) {
                    mixDB.updateMix(mix, function(err, results) {
                        if (err) {
                            callback({
                                statusCode : 500,
                                errorMessage : err
                            });
                            return;
                        }
/*                        if (results.modifiedCount == 0) {
                            callback({
                                statusCode : 400,
                                errorMessage : "The mix has not been updated because it was not found"
                            });
                            return;
                        }*/
                        callback(null, results);
                    });
                }
                else {
                    //On remplace l'id de chanson par la chanson entière
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
		mix.owner = user1._id.toString();
		app.postMix(mix,function(err,postedMix){
		    if(err){
			callback(err);
		    }
		    else{
			user1.mixes.push(postedMix.insertedId);
			user.updateUser(user1,function(err,results){
				callback(err,postedMix);
			});
		    }
		});
	    }
	});
    },


    updateMix: function(updatedMix, callback) {

	var app = this;
        mongo.updateDocument(updatedMix,mixCollection,function(err,results){
            callback(err,results);
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
		if(checkRight(user1,mixId)){
		    app.getMixByID(mixId,function(err,mix1){
			app.removeMix(String(mixId),function(err, results){
			    if(err){
				callback(err);
			    }
			    else{
				if(err){
				    callback(err);
				}
				else{
				    user.getUserById(mix1.owner,function(err,owner){
					if(err){
					    callback(err);
					}
					var tab = []
					for(var i=0;i<owner.mixes.length;i++){
					    if(! owner.mixes[i].equals(mixId)){
						tab.push(owner.mixes[i]);
					    }
					}
					owner.mixes = tab;
					user.updateUser(owner,function(err,results){
					    callback(err);
					});
					
				    });
				}
			    }
			});
		    });
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
