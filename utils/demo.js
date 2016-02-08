var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var fs = require("fs");
var assert = require("assert");
var song = require('../server/songDB');
var mixDB = require('../server/mixDB');
var commentDB = require('../server/commentDB');
var userDB = require('../server/userDB');

var songsToAdd = [
    {
        "_id": new ObjectID("56af72de2e23372e947501d6"),
        "artist": "Queen",
        "song": "We Are The Champions",
        "released": 1977,
        "path": "multitrack/queen_champions/",
        "track": [
            {
                "name": "basse",
                "path": "track/queen_champions/sound/basse.mp3"
            },
            {
                "name": "batterie",
                "path": "track/queen_champions/sound/batterie.mp3"
            },
            {
                "name": "guitare",
                "path": "track/queen_champions/sound/guitare.mp3"
            },
            {
                "name": "guitare2",
                "path": "track/queen_champions/sound/guitare2.mp3"
            },
            {
                "name": "piano",
                "path": "track/queen_champions/sound/piano.mp3"
            },
            {
                "name": "voix",
                "path": "track/queen_champions/sound/voix.mp3"
            }
        ]
    },
    {
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
    },
    {
        "_id": new ObjectID("56af72df2e23372e947501d8"),
        "artist": "Deep Purple",
        "song": "Smoke On The Water",
        "released": 1972,
        "path": "multitrack/deep_smoke/",
        "track": [
            {
                "name": "basse",
                "path": "track/deep_smoke/sound/basse.mp3"
            },
            {
                "name": "batterie",
                "path": "track/deep_smoke/sound/batterie.mp3"
            },
            {
                "name": "guitare",
                "path": "track/deep_smoke/sound/guitare.mp3"
            },
            {
                "name": "voix",
                "path": "track/deep_smoke/sound/voix.mp3"
            }
        ]
    },
    {
        "_id": new ObjectID("56af72df2e23372e947501d9"),
        "artist": "Bob Marley",
        "song": "Is This Love",
        "released": 1978,
        "path": "multitrack/bob_love/",
        "track": [
            {
                "name": "basse",
                "path": "track/bob_love/sound/basse.mp3"
            },
            {
                "name": "choeurs1",
                "path": "track/bob_love/sound/choeurs1.mp3"
            },
            {
                "name": "choeurs2",
                "path": "track/bob_love/sound/choeurs2.mp3"
            },
            {
                "name": "extra",
                "path": "track/bob_love/sound/extra.mp3"
            },
            {
                "name": "guitare1",
                "path": "track/bob_love/sound/guitare1.mp3"
            },
            {
                "name": "guitare2",
                "path": "track/bob_love/sound/guitare2.mp3"
            },
            {
                "name": "guitare3",
                "path": "track/bob_love/sound/guitare3.mp3"
            },
            {
                "name": "oooh",
                "path": "track/bob_love/sound/oooh.mp3"
            },
            {
                "name": "orgue",
                "path": "track/bob_love/sound/orgue.mp3"
            },
            {
                "name": "piano",
                "path": "track/bob_love/sound/piano.mp3"
            },
            {
                "name": "rythme",
                "path": "track/bob_love/sound/rythme.mp3"
            },
            {
                "name": "saxo",
                "path": "track/bob_love/sound/saxo.mp3"
            },
            {
                "name": "trombone",
                "path": "track/bob_love/sound/trombone.mp3"
            },
            {
                "name": "voix",
                "path": "track/bob_love/sound/voix.mp3"
            }
        ]
    },
    {
        "_id": new ObjectID("56af72e22e23372e947501da"),
        "artist": "Amy Winehouse",
        "song": "Rehab",
        "released": 2006,
        "path": "multitrack/amy_rehab/",
        "track": [
            {
                "name": "basse",
                "path": "track/amy_rehab/sound/basse.mp3"
            },
            {
                "name": "batterie",
                "path": "track/amy_rehab/sound/batterie.mp3"
            },
            {
                "name": "cuivre",
                "path": "track/amy_rehab/sound/cuivres.mp3"
            },
            {
                "name": "guitare",
                "path": "track/amy_rehab/sound/guitare.mp3"
            },
            {
                "name": "orgue",
                "path": "track/amy_rehab/sound/orgue.mp3"
            },
            {
                "name": "piano",
                "path": "track/amy_rehab/sound/piano.mp3"
            },
            {
                "name": "voix",
                "path": "track/amy_rehab/sound/voix.mp3"
            }
        ]
    }
];

var mix1 = {
    "name": "mix1",
    "owner": "56b5c1d78fc8d058d2405ad9",
    "song_id":  "56af72df2e23372e947501d7",
    "masterVolume" : 0.7,
    "trackEffects" : [
        {
            "track": "guitare",
            "volume" : 0.1,
            "mute" : false
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
    "comments": []
};

var mix2 = {
    "name": "mix2",
    "owner": "56b5c1d78fc8d058d2405ad9",
    "song_id":  "56af72df2e23372e947501d7",
    "masterVolume" : 0.7,
    "trackEffects" : [
        {
            "track": "guitare",
            "volume" : 0.1,
            "mute" : false
        },
        {
            "track": "batterie",
            "volume": 0.2,
            "mute": false
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
            "mute": true
        }
    ],
    "comments":[]
}


var comment1 = {
    "_id" : new ObjectID("56b4cd215d1b19125ef9a232"),
    "mix_id" : "",
    "user_id" : new ObjectID("56b5c1d78fc8d058d2405ad9"),
    "content" : "Mix 1 comment no.2",
    "rate" : 1,
    "updatedAt" : "1454620874"
};
var comment2 = {
    "_id" : new ObjectID("56b4cd215d1b19125ef9a233"),
    "mix_id" : "",
    "user_id" : new ObjectID("56b5c1d78fc8d058d2405ad9"),
    "content" : "Mix 2 comment no.1",
    "rate" : 2,
    "updatedAt" : "1454620845"
};

var comment3 = {
    "_id" : new ObjectID("56b4cd215d1b19125ef9a234"),
    "mix_id" : "",
    "user_id" : new ObjectID("56b5c1d78fc8d058d2405ad9"),
    "content" : "Mix 2 comment no.2",
    "rate" : 3,
    "updatedAt" : "1454619457"
};

var comment4 ={
    "_id" : new ObjectID("56b4cd215d1b19125ef9a235"),
    "mix_id" : "",
    "user_id" : new ObjectID("56b5c1d78fc8d058d2405ad9"),
    "content" : "Mix 1 comment no.1",
    "rate" : 4,
    "updatedAt" : "1454618456"
}


// putting the data into the 'prod' database:
MongoClient.connect('mongodb://127.0.0.1:27017/prod', function(err, db) {
    if(err) throw err;
    db.collection(song.getSongDB()).deleteMany({}, function(err, results) {
        console.log("All songs deleted");
        db.collection(song.getSongDB()).insertMany(songsToAdd, function(err, result) {
            assert.equal(null, err);
            console.log("Number of inserted songs : "+result.insertedCount);
	    userDB.addUser("user","user","normal",function(err,results){
		assert.equal(null,err);
		console.log('User "user" added');
		userDB.addUser("admin","admin","admin",function(err,results){
		    assert.equal(null,err);
		    console.log('User "admin" added');
		    userDB.getConnection("user","user",function(err,token){
			assert.equal(null,err);
			mixDB.postUserMix(token,mix1,function(err,result){
			    assert.equal(null,err);
			    mixDB.postUserMix(token,mix2,function(err,result){
				assert.equal(null,err);
				console.log("mix inserted");
				commentDB.removeAllComments(function(err,results){
                                    assert.equal(null,err);
				    console.log("comments deleted");
				    db.close();
				});
                            });
                        });
                    });
                });
            });
        });
    });
});
