var mongo = require('./manageMongo');
var ObjectID = require('mongodb').ObjectId;
var mixDB = require('./mixDB');
var userDB = require('./userDB');

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

    //give the mix collection name
    getCommentDB: function(){
        return commentCollection;
    },

    createComment : function(comment, mixId, userId, callback) {
        //TODO : createComment
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
