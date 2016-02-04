var mongo = require('./manageMongo');
var ObjectID = require('mongodb').ObjectId;
var songDB = require('./songDB');
var user = require('./userDB');

var inputValidator = require('./inputValidator');

var commentCollection = "comment";


module.exports = {

    /**
     * Set the database name
     *
     * name is the name of the new database
     **/
    setDB: function(name){
        mongo.setDB(name);
    },

    createComment : function(comment, mixId, userId, callback) {
        //TODO : createComment
    },

    //give the mix collection name
    getMixDB: function(){
        return commentCollection;
    },

    getCommentsByMix : function(mixId, callback) {
        //TODO : getCommentsByMix
    },

    getCommentById : function(commentId, callback) {
        //TODO : getCommentById
    },

    removeComment : function(commentId, callback) {
        //TODO : removeComment
    },

    updateComment : function(updatedComment, callback) {
        //TODO : updateComment
    }

};
