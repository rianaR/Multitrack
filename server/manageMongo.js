var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
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
					db.close();
					if (err) {
						callback(err);
					}
					else {
						console.log("Inserted a document into the " + collection + " collection.");
						callback(null, result);
					}
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
					}
					if (doc != null) {
						result.push(doc);
					} else {
						callback(null, result);
						db.close();
					}
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
    findDocumentsByFilter: function(db, res, filter, collection, callback) {
	var cursor = db.collection(collection).find(filter);
	var result = [];
	cursor.each(function(err, doc) {
	    assert.equal(err, null);
	    if (doc != null) {
		result.push(doc);
	    } else {
		res.write(JSON.stringify(result));
		callback();
	    }
	});
    },

    /**
     *   remove a document from the database
     *
     *   db is the mongodb client
     *   id is the id of the document to remove
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    removeDocument: function(db, filter, collection, callback) {
		MongoClient.connect(url, function(err, db) {
			if (err) {
				callback(err);
			}
			else {
				console.log("Connected correctly to server.");
				db.collection(collection).deleteMany(
					filter,
					function(err, results) {
						if (err) {
							callback(err);
						}
						else {
							console.log("Document deleted in "+collection);
							callback(null, results);
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
    removeAllDocuments: function(db, collection, callback) {
	db.collection(collection).deleteMany({},
					     function(err, results) {
						 assert.equal(err, null);
						 console.log("All songs deleted.");
						 callback();
					     }
					    );
    }

};
