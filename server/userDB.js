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
	var filter = {}
	filter.userId = Number(userId);
	mongo.findDocumentsByFilter(filter, userCollection, function(err, results) {
            callback(err, results);
	});
    },

    /**
     * Add or update an user
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
     * right is user rights (admin or normal)
     **/
    addUser: function(name,right,callback){
	var user = {}
	user.name = name;
	user.right = right;
	user.mixis = [];
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
	filter._id = Number(userId);
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
    deleteMix: function(userId,mixId){
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
