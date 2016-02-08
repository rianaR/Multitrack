//user has an name, pwd, id, right, mixId, commentId, connexionToken, timestamp
var mongo = require('./manageMongo');
var userCollection = "user";
var ObjectID = require('mongodb').ObjectId;

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

    getUserById: function(userId,callback){
	mongo.findDocumentsByFilter( { "_id" : new ObjectID(userId) },userCollection ,function(err,result){
	    if(err){
		callback(err);
	    }
	    else{
		if(result.length!=1){
		    callback({
			statusCode : 201,
			errorMessage : "Invalid ID, cannot find an user with this ID"
		    });
		}
		else{
		    callback(err,result[0]);
		}
	    }
	});
    },
    
    /**
     * udpate an the content of an user
     *
     * user is the object with the new values
     *
     **/
    updateUser: function(user,callback){
	mongo.updateDocument(user,userCollection,function(err,results){
	    callback(err,results);
	});
    },


    /**
     * Delete an user by its id
     *
     * userId is the _id of the user
     **/
    deleteUser: function(connection,userId,callback){
	this.getUser(connection,function(err, user1){
	    if(user1.right != "admin"){
		callback({
                    statusCode : 500,
                    errorMessage : "This connection token does not have the right to delete this user"
                });
	    }
	    else{
		mongo.removeDocument(userId,userCollection, function(err,results){
		    callback(err,results);
		});
	    }
	});
    },

    /**
     * Remove all users 
     **/
    removeAllUsers: function(callback){
	mongo.removeAllDocuments(userCollection, function(err, deleted) {
	    if(err){
		callback({
		    errorMessage : err
		});
	    }
	    else{
		callback(err, deleted);
	    }
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
    getConnection: function(name, pwd, callback){
	var filter = { "name": name, "pwd":pwd };
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
		var user1 = results[0];
		user1.connection = createGuid();
		user1.timeStamp = (Date.now() / 1000 | 0);
		mongo.updateDocument(user1,userCollection,function(err,results){
		    callback(null,user1.connection);
		});
	    }
	});  
    },

    

    /**
     *  give the user according to the connection, for security reason, pwd is set to null
     *
     *  connection is the connection token
     *
     **/
    getUser: function(connection, callback){
	var filter = { "connection" : connection };
	mongo.findDocumentsByFilter(filter, userCollection, function(err, results) {
	    if(err){
		callback({
                    statusCode : 500,
                    errorMessage : err
                });
	    }
	    else if(results.length == 0){
		console.log("res",results);
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
     * connection is the connection token of the user
     * mixId is the _id of the mix
     **/
    addMix: function(connection,mixId,callback){
	var obj = this;
	this.getUser(connection,function(err,user1){
	    if(err==null){
		user1.mixes.push(mixId);
		obj.updateUser(user1,function(err,results){
		    callback(err,results);
		});
	    }
	    else{
		callback(err,null)
	    }
	});
    },

    /**
     * Delete a mix of a user
     *
     * userId is the _id of the user
     * midId is the _id of the mix
     *
     **/
    deleteMix: function(connection,mixId,callback){
	var obj = this;
	this.getUser(connection,function(err,user1){
	    if(err==null){
		var mixes = [];
		for(var i=0;i<user1.mixes.length;i++){
		    if(! user1.mixes[i].equals(mixId)){
			mixes.push(user1.mixes[i]);
		    }
		}
		user1.mixes = mixes;
		obj.updateUser(user1,function(err,results){
		    callback(err,results);
		});
	    }
	    else{
		callback(err,null)
	    }
	});
    }    
}
