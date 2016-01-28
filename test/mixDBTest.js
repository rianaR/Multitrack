var assert = require('assert');
var mix = require('../server/mixDB');
var songDB = require('../server/songDB');

mix.setDB('test');
songDB.setDB('test');

var song1 = {
    "_id": 1,
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

    it('should not have mix', function (done) {
        mix.removeAllMixes(function () {
            assert.deepEqual
            done();
        });
    });

    it('should add and get a mix', function (done) {
        songDB.postSong(song1, function(err) {
            assert.equal(err,null);
            mix1 = {
                "_id": 5,
                "name": "mix1",
                "user_id": 45,
                "song_id": 1,
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
                mix.getMixBySong(1, function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results[0]._id, mix1._id);
                    done();
                });
            });
        });
    });

    it('should get all mix', function (done) {

        mix1 = {_id: 1};
        mix2 = {_id: 2};

        mix.postMix(mix1, function (err, results) {
            assert.equal(err, null);

            mix.postMix(mix2, function (err, results) {

                mix.getAllMixes(function (err, results) {
                    assert.equal(err, null);
                    tab = [];
                    tab.push(mix1);
                    tab.push(mix2);
                    assert.deepEqual(results, tab);
                    done();
                });
            });
        });
    });

    it('should remove a mix', function (done) {

        mix1 = {_id: 1};
        mix2 = {_id: 2};

        mix.postMix(mix1, function (err, results) {
            assert.equal(err, null);

            mix.postMix(mix2, function (err, results) {
                assert.equal(err, null);

                mix.removeMix(1, function (err, results) {

                    mix.getAllMixes(function (err, results) {
                        assert.equal(err, null);
                        tab = [];
                        tab.push(mix2);
                        assert.deepEqual(results, tab);
                        done();
                    });
                });
            });
        });
    });

});
