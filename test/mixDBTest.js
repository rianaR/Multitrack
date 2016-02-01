var assert = require('assert');
var mix = require('../server/mixDB');
var songDB = require('../server/songDB');
var ObjectID = require('mongodb').ObjectID;

mix.setDB('test');
songDB.setDB('test');

var song1 = {
    "_id": new ObjectID("56af742e4ec4a781cef3d568"),
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
}

describe("mix test", function () {


    beforeEach(function (done) {
        mix.removeAllMixes(function () {
            done();
        });
    });


    it('should not have mix',function(done) {
	mix.removeAllMixes(function(){
	    mix.getAllMixes(function(err, results){
		assert.deepEqual(results,[]);
		done();
	    });
	});
    });

    it('should add and get a mix', function (done) {
        songDB.postSong(song1, function(err) {
            assert.equal(err,null);
            mix1 = {
                "_id": new ObjectID("56af746c0f9c57894d37c859"),
                "name": "mix1",
                "user_id": 45,
                "song_id": new ObjectID("56af742e4ec4a781cef3d568"),
                "effects": [
                    {
                        "track": "guitare",
                        "name": "volume",
                        "value": 0.3
                    },
                    {
                        "track": "batterie",
                        "name": "mute",
                        "value": 1
                    }
                ]
            };
            mix.postMix(mix1, function (err, results) {
                assert.equal(err, null);
                mix.getMixBySong("56af742e4ec4a781cef3d568", function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results[0]._id.toHexString(), mix1._id.toHexString());
                    done();
                });
            });
        });
    });

    it('should get all mix', function (done) {

        mix1 = {
            "_id" : "56af754df0500975b6dfc63c",
            "name": "mix1",
            "user_id": 45,
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume" : 0.7,
            "trackEffects" : [
                {
                    "track": "guitare",
                    "volume" : 0.8,
                    "mute" : 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        mix2 = {
            "_id" : "56af754df0500975b6dfc64d",
            "name": "mix2",
            "user_id": 45,
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume" : 0.7,
            "trackEffects" : [
                {
                    "track": "guitare",
                    "volume" : 0.8,
                    "mute" : 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };

        mix.postMix(mix1, function (err, results) {
            assert.equal(err, null);

            mix.postMix(mix2, function (err, results) {

                mix.getAllMixes(function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results[0]._id, mix1._id);
                    assert.equal(results[1]._id, mix2._id);
                    done();
                });
            });
        });
    });

    it('should remove a mix', function (done) {

        mix1 = {
            "_id" : new ObjectID("56af754df0500975b6dfc63c"),
            "name": "mix1",
            "user_id": 45,
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume" : 0.7,
            "trackEffects" : [
                {
                    "track": "guitare",
                    "volume" : 0.8,
                    "mute" : 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        mix2 = {
            "_id" : new ObjectID("56af754df0500975b6dfc64d"),
            "name": "mix2",
            "user_id": 45,
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume" : 0.7,
            "trackEffects" : [
                {
                    "track": "guitare",
                    "volume" : 0.8,
                    "mute" : 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };

        mix.postMix(mix1, function (err, results) {
            assert.equal(err, null);

            mix.postMix(mix2, function (err, results) {
                assert.equal(err, null);

                mix.removeMix("56af754df0500975b6dfc63c", function (err, res) {
                    assert.equal(err, null);
                    assert.equal(res.result.ok, 1);
                    mix.getAllMixes(function (err, results) {
                        assert.equal(err, null);
                        assert.equal(results.length, 1);
                        assert.equal(results[0]._id.toHexString(), mix2._id.toHexString());
                        done();
                    });
                });
            });
        });
    });

});
