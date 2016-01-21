var assert = require('assert');

module.exports = {
    /**
     *   insert a document into the database
     *
     *   db is the mongodb client
     *   doc is the song to insert
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    insertDocument : function(db,doc,collection,callback) {
	//check if the json is correct
	if (doc._id <= 0) {
	    console.log("JSON incorrect : id<0");
            //ici le callback n'a pas pas d'argument cela ne génère pas d'erreur mais cela ne fait rien
	    callback("Id must be greater than 0", null);
	}
	//insert the mix if json is correct
	else{
	    db.collection(collection).insertOne(doc, function(err, result) {
		assert.equal(err, null);
		console.log("Inserted a document into the "+collection+ " collection.");
		callback(result);
	    });
	}
	
    },



    /**
     *   find a document into the database
     *
     *   db is the mongodb client
     *   res is res where method wil write the result
     *   collection is the name of the table in mongodb
     *   callback must be called at the end of the method
     **/
    findDocuments: function(db, res, collection, callback) {
	var cursor = db.collection(collection).find();
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
	db.collection(collection).deleteMany(
	    filter,
	    function(err, results) {
		assert.equal(err, null);
		//console.log(results);
		console.log("Document deleted in "+collection);
		callback();
	    }
	);
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

}
