var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/prod';
var assert = require('assert');

module.exports = {
	/**
	 * Set a new database
	 *
	 * name is the name of the new database
	 **/
	setDB: function(name){
		url = 'mongodb://localhost:27017/'+name;
	},

    /**
     *   insert a document into the database
     *
     *   db is the mongodb client
     *   doc is the song to insert
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    insertDocument : function(doc,collection,callback) {
		MongoClient.connect(url, function(err,db) {
			if (err) {
				callback(err);
				db.close();
			}
			else {
				console.log("Connected correctly to server.");
				db.collection(collection).insertOne(doc, function (err, result) {
					if (err) {
						callback(err);
					}
					else {
						console.log("Inserted a document into the " + collection + " collection.");
						callback(null, result);
					}
					db.close();
				});
			}

		});
    },



    /**
     *   find a document into the database
     *
     *   db is the mongodb client
     *   res is res where method wil write the result
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    findDocuments: function(collection, callback) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				callback(err);
				db.close();
			}
			else {
				var cursor = db.collection(collection).find();
				var result = [];
				cursor.each(function (err, doc) {
					if (err) {
						callback(err);
						db.close();
					}
					else {
						if (doc != null) {
							result.push(doc);
						} else {
							callback(null, result);
							db.close();
						}
					}
				});
			}
		});
    },

    
    /**
     *   find a document into the database
     *
	 *
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    findDocumentsByFilter: function(filter, collection, callback) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				callback(err);
				db.close();
			}
			else {
				var cursor = db.collection(collection).find(filter);
				var result = [];
				cursor.each(function (err, doc) {
					if (err) {
						callback(err);
						db.close();
					}
					if (doc != null) {
						result.push(doc);
					} else {
						callback(err, result);
						db.close();
					}
				});
			}
		});
    },

    /**
     *   remove a document from the database
     *
     *   id is the id of the document to remove
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    removeDocument: function(id, collection, callback) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				db.close();
				callback(err);
			}
			else {
				console.log("Connected correctly to server.");
				var object_id = new ObjectID(id);
				db.collection(collection).deleteMany(
					{"_id" : object_id },
					function(err, deleted) {
						if (err) {
							console.log("Error on deleting document");
							callback(err);
						}
						else {
							console.log("Document in "+collection+"has been deleted");
							callback(null, deleted);
						}
					}
				);
			}
		});
    },

    /**
     *   remove all from the database
     *
     *   db is the mongodb client
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    removeAllDocuments: function(collection, callback) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				callback(err);
			}
			else {
				console.log("Connected correctly to server.");
				db.collection(collection).deleteMany({},
					function (err, deleted) {
						if (err) {
							console.log("Error on deleting all documents");
							callback(err);
						}
						else {
							console.log("All documents in "+collection+"have been deleted");
							callback(err, deleted);
						}
						db.close();
					}
				);
			}
		});
    }

};
