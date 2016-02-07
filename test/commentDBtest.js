var assert = require('assert');

var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

var songDB = require('../server/songDB');
var userDB = require('../server/userDB');
var mixDB = require('../server/mixDB');
var commentDB = require('../server/commentDB');

songDB.setDB("test");
userDB.setDB("test");
mixDB.setDB("test");
commentDB.setDB("test");

var song = {
    "_id": new ObjectID("56af72df2e23372e947501d7"),
    "artist": "James Brown",
    "song": "Get Up",
    "released": 1970,
    "path": "multitrack/jamesbrown_get/",
    "track": [
        {
            "name": "basse",
            "path": "track/jamesbrown_get/sound/basse.mp3"
        },
        {
            "name": "batterie",
            "path": "track/jamesbrown_get/sound/batterie.mp3"
        },
        {
            "name": "extra",
            "path": "track/jamesbrown_get/sound/extra.mp3"
        },
        {
            "name": "guitare",
            "path": "track/jamesbrown_get/sound/guitare.mp3"
        },
        {
            "name": "voix",
            "path": "track/jamesbrown_get/sound/voix.mp3"
        }
    ]
};

var mix = {
    "_id": new ObjectID("56b5bcc98eee7b42127b7fc2"),
    "name": "mix1",
    "user_id": 45,
    "song": song,
    "masterVolume": 0.7,
    "trackEffects": [
        {
            "track": "guitare",
            "volume": 0.1,
            "mute": false
        },
        {
            "track": "batterie",
            "volume": 0.2,
            "mute": true
        },
        {
            "track": "basse",
            "volume": 0.3,
            "mute": false
        },
        {
            "track": "extra",
            "volume": 0.2,
            "mute": false
        },
        {
            "track": "voix",
            "volume": 0.2,
            "mute": false
        }
    ],
    "comments": [
        {
            "_id": new ObjectID("56b4cd215d1b19125ef9a232")
        },
        {
            "_id": new ObjectID("56b4cd9d5d1b19125ef9a233")
        }
    ]
};

var comments = [
    {
        "_id" : new ObjectID("56b4cd215d1b19125ef9a232"),
        "mix_id" : mix._id,
        "user_id" : "",
        "content" : "Mix 1 comment no.2",
        "rate" : 1,
        "updatedAt" : "1454620874"
    },
    {
        "_id" : new ObjectID("56b4cd215d1b19125ef9a233"),
        "mix_id" : mix._id,
        "user_id" : "",
        "content" : "Mix 2 comment no.1",
        "rate" : 2,
        "updatedAt" : "1454620845"
    }
];

var user = {};
user._id = new ObjectID("56b5c1d78fc8d058d2405ad9");
user.name = "user1";
user.pwd = "pwd1";
user.right = "normal";
user.mixes = [
    {
        "_id" : mix._id
    }
];
user.comments = [
    {
        "_id" : comments[0]._id,
    },
    {
        "_id" : comments[1]._id
    }
];
user.connection = null;
user.timeStamp = null;

function dropAllCollections(db, callback) {
    db.collection(songDB.getSongDB()).deleteMany({}, function() {
        db.collection(mixDB.getMixDB()).deleteMany({}, function() {
            db.collection(commentDB.getCommentDB()).deleteMany({}, function() {
                db.collection("user").deleteMany({}, function() {
                    callback();
                });
            });
        });
    });
}

function initDB(callback) {
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        dropAllCollections(db, function() {
            db.collection(songDB.getSongDB()).insertOne(song, function(err) {
                if (err) throw err;
                db.collection(mixDB.getMixDB()).insertOne(mix, function(err) {
                    if (err) throw err;
                    db.collection(commentDB.getCommentDB()).insertMany(comments, function(err) {
                        if (err) throw err;
                        db.collection("user").insertOne(user, function(err) {
                            if (err) throw err;
                            db.close();
                            callback();
                        });
                    });
                });
            });

        })
    });
}

describe("Testing CommentDB - ", function () {

    beforeEach(function (done) {
        initDB(done);
    });

    after(function(done) {
        MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
            if (err) throw err;
            dropAllCollections(db, done);
        });
    });

    it('should remove one comment', function (done) {
        commentDB.removeComment("56b4cd215d1b19125ef9a232", function(err, results) {
            assert.equal(err, null);
            assert.equal(results.deletedCount, 1);
            done();
        })
    });

    it('should remove all comments', function (done) {
        commentDB.removeAllComments(function(err, results) {
            assert.equal(err, null);
            assert.equal(results.deletedCount, 2);
            done();
        })
    });

    it('should add a comment',function (done) {
        var commentToAdd = {
            "user_id" : user._id.toHexString(),
            "mix_id" : mix._id.toHexString(),
            "content" : "Awesome mix, I could to listen to it all day long...",
            "rate" : 5
        };
        commentDB.createComment(commentToAdd, function(err, insertResults) {
            assert.equal(err, null);
            assert.equal(insertResults.insertedCount, 1);
            var insertedCommentId = String(insertResults.insertedId);
            mixDB.getMixByID(commentToAdd.mix_id, function(err, mix) {
                assert.equal(err, null);
                mix.comments.forEach(function(comment) {
                    if (comment._id.toHexString() == insertedCommentId) {
                        assert.ok(true);
                        done();
                    }
                });
                assert.ok(false);
                done();
            });
        });
    });

    it ("should get all comments by ids", function(done) {
        var commentIds = ["56b4cd215d1b19125ef9a232", "56b4cd215d1b19125ef9a233"];
        commentDB.getCommentsByIds(commentIds, function(err, comments) {
            assert.equal(err, null);
            assert.equal(comments.length, 2);
            assert.ok(commentIds.indexOf(comments[0]._id.toHexString()) != -1)
            assert.ok(commentIds.indexOf(comments[1]._id.toHexString()) != -1)
            done();
        })
    });

    it ("should add a comment to an user",function(done) {

	done();
    });
    

});
