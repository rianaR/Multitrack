var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var fs = require("fs");
var assert = require("assert");
var song = require('../server/songDB');
var mixDB = require('../server/mixDB');

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

var mixesToAdd = [
    {
        "name": "mix1",
        "user_id": 45,
        "song": {
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
        "masterVolume" : 0.7,
        "trackEffects" : [
            {
                "track": "guitare",
                "volume" : 0.8,
                "mute" : true
            },
            {
                "track": "batterie",
                "volume": 0.3,
                "mute": true
            }
        ],
        "comments": [
            {
                "user": {
                    "user_id": 12,
                    "pseudo": "pseudo1"
                },
                "comment": "Awesome!!"
            },
            {
                "user": {
                    "user_id": 16,
                    "pseudo": "pseudo2"
                },
                "comment": "Boring mix..."
            }
        ]
    },
    {
        "name": "mix2",
        "user_id": 45,
        "song": {
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
        "masterVolume" : 0.7,
        "trackEffects" : [
            {
                "track": "guitare",
                "volume" : 0.8,
                "mute" : true
            },
            {
                "track": "batterie",
                "volume": 0.3,
                "mute": true
            }
        ],
        "comments": [
            {
                "user": {
                    "user_id": 12,
                    "pseudo": "pseudo1"
                },
                "comment": "Awesome!!"
            },
            {
                "user": {
                    "user_id": 16,
                    "pseudo": "pseudo2"
                },
                "comment": "Boring mix..."
            }
        ]
    }
];

// putting the data into the 'test' database:
MongoClient.connect('mongodb://127.0.0.1:27017/prod', function(err, db) {
    if(err) throw err;
    db.collection(song.getSongDB()).deleteMany({}, function(err, results) {
        console.log("All songs deleted");
        db.collection(song.getSongDB()).insertMany(songsToAdd, function(err, result) {
            assert.equal(null, err);
            console.log("Number of inserted songs : "+result.insertedCount);
            db.collection(mixDB.getMixDB()).deleteMany({}, function(err, results) {
                console.log("All mixes deleted");
                db.collection(mixDB.getMixDB()).insertMany(mixesToAdd, function(err, result) {
                    assert.equal(null, err);
                    console.log("Number of inserted mixes : " + result.insertedCount);
                    db.close();
                });
            });
        });
    });
});
