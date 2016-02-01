//user has an name, pwd, id, right, mixId, commentId, connexionToken, timestamp
var mongo = require('./manageMongo');
var userCollection = "user";

function createGuid()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

module.exports = {

    /**
     * Set a new database
     *
     * name is the name of the new database
     **/
    setDB: function(name){
        mongo.setDB(name);
    },

    /**
     * Give all the users
     **/
    getUsers: function(callback){
	mongo.findDocuments(userCollection, function(err, results) {
            callback(err, results);
	});
    },

    /**
     *
     * Give the user which match with userId
     *
     * userId is the _id of the user
     **/
    getUser: function(userId,callback){

	var filter = { _id : userId };
	mongo.findDocumentsByFilter(filter, userCollection, function(err, results) {
	    callback(err, results);	    
	});
	
    },

    /**
     * Add or update an user (not recommended, you should use addUser)
     *
     * user is the jsObject which contains all information about user : _id, name and mixis id
     *
     **/
    postUser: function(user,callback){
	mongo.insertDocument(user,userCollection,function(err,results){
	    callback(err,results);
	});
    },

    /**
     * Add an user with his name and right
     *
     * name is the user name
     * pwd is the password

     * right is user rights (admin or normal)
     **/
    addUser: function(name,pwd,right,callback){
	var user = {}
	user.name = name;
	user.pwd = pwd;
	user.right = right;
	user.mixes = [];
	user.comments = [];
	user.connection = null;
	user.timeStamp = null;
	
	mongo.insertDocument(user,userCollection,function(err,results){
	    callback(err,results);
	});
    },


    /**
     * Delete an user by its id
     *
     * userId is the _id of the user
     **/
    deleteUser: function(userId,callback){
	var filter = {};
	filter._id = userId;
	mongo.removeDocument(filter,userCollection, function(err,results){
	    callback(err,results);
	});
    },

    /**
     * Remove all users 
     **/
    removeAllUsers: function(callback){
	mongo.removeAllDocuments(userCollection, function(err, deleted) {
	    callback(err, deleted);
	});
    },

    /**
     * Create a token of connection for the user if 
     *
     * user is the user name
     * pwd is the user password
     *
     * callback return the connection token
     **/
    getConnection: function(user, pwd, callback){
	var filter = { "user": user, "pwd":pwd };
	mongo.findDocumentsByFilter(filter, userCollection, function(err, results) {
	    if(err){
		callback({
                    statusCode : 500,
                    errorMessage : err
                });
	    }
	    else if(results.length == 0){
		callback({
                    statusCode : 500,
                    errorMessage : "The combination of the user and the password is undefined"
                });
		
	    }
	    else{
		var user = results[0];
		user.connection = createGuid();
		user.timeStamp = (Date.now() / 1000 | 0);
		callback(null,user.connection);
	    }
	});
    },

    checkConnection: function(connection, callback){
	var filter = { "connection" : connection };
	mongo.findDocumentsByFilter(filter, userCollection, function(err, results) {
	    if(err){
		callback({
                    statusCode : 500,
                    errorMessage : err
                });
	    }
	    else if(results.length == 0){
		callback({
                    statusCode : 500,
                    errorMessage : "The connection token is undefined"
                });
		
	    }
	    else{
		var user = results[0];
		if( (user.timeStamp+3600) <  (Date.now() / 1000 | 0) ){
		    callback({
			statusCode : 500,
			errorMessage : "The connection token expired"
                    });
		}
		else{
		    callback(null,user);
		}
	    }
	});
    },

    /**
     * Add a mix to an user
     *
     * userId is the _id of the user
     * mixId is the _id of the mix
     **/
    addMix: function(userId,mixId,callback){
	getUser(userId,function(err,result){
	    if(err==null){
		result.mixis.push(mixId);
		postUser(result,function(err,results){
		    callback(err,results);
		});
	    }
	    else{
		callback(err,null)
	    }
	});
    },

    /**
     *
     * Delete a mix of a user
     *
     * userId is the _id of the user
     * midId is the _id of the mix
     *
     **/
    deleteMix: function(userId,mixId,callback){
	getUser(userId,function(err,result){
	    if(err==null){
		result.mixis.push(mixId);
		postUser(result,function(err,results){
		    callback(err,results);
		});
	    }
	    else{
		callback(err,null)
	    }
	});
    }    
}
