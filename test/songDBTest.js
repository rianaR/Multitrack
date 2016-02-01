var assert = require('assert');
var song = require('../server/songDB');
var ObjectID = require('mongodb').ObjectID;

song.setDB('test');

song1 = {};

function createSongJSON(id) {
    return {
        "_id": new ObjectID(id),
        "artist": "Queen",
        "song": "We Are The Champions",
        "released": 1977,
        "path": "multitrack/queen_champions/",
        "track": [
            {
                "name": "basse",
                "path": "basse.mp3"
            },
            {
                "name": "batterie",
                "path": "batterie.mp3"
            },
            {
                "name": "guitare",
                "path": "guitare.mp3"
            },
            {
                "name": "guitare2",
                "path": "guitare2.mp3"
            },
            {
                "name": "piano",
                "path": "piano.mp3"
            },
            {
                "name": "voix",
                "path": "voix.mp3"
            }
        ]
    }
}


describe('function test', function () {


    beforeEach(function (done) {
        song.removeAllSongs(function () {
            song1 = createSongJSON("56af72de2e23372e947501d6");
            done();
        });
    });

    it('should return the song collection name', function () {
        assert.equal(song.getSongDB(), 'song');
    });

    it('should empty the collection', function (done) {

        song.getSongs(function (err, results) {
            tab = [];
            assert.deepEqual(err, null);
            assert.deepEqual([], tab);
            done();
        });
    });

    it('should add a new song', function (done) {
        song.postSong(song1, function (err, results) {
            assert.equal(err, null);

            song.getSongs(function (err, results) {
                tab = [];
                tab.push(song1);
                assert.equal(err, null);
                assert.deepEqual(results, tab);
                done();
            });
        });
    });

    it('trying to add an invalid song : invalid artist', function (done) {
        song1.artist = 40;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : artist is missing', function (done) {
        delete song1.artist;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : invalid title', function (done) {
        song1.song = 1;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : invalid year', function (done) {
        song1.released = "1970";
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : invalid path', function (done) {
        song1.path = 1;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : invalid name attribute in track', function (done) {
        song1.track[0].name = 30;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : invalid path attribute in track', function (done) {
        song1.track[0].path = 30;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : forbidden attribute in track', function (done) {
        song1.track[0].invalid = "invalid";
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('trying to add an invalid song : attribute missing in track', function (done) {
        delete song1.track[0].name;
        song.postSong(song1, function (err) {
            assert.notEqual(err, null);
            assert.equal(err.statusCode, 400);
            assert.notEqual(err.errorMessage, null);
            song.getSongs(function (err, results) {
                assert.equal(err, null);
                assert.deepEqual(results, []);
                done();
            });
        });
    });


    it('should remove a song', function (done) {
        song.postSong(song1, function (err, results) {
            assert.equal(err, null);

            song.removeSong("56af72de2e23372e947501d6", function (err, result) {
                assert.equal(err, null);

                song.getSongs(function (err, results) {
                    assert.equal(err, null);
                    assert.deepEqual(results, []);

                    done();
                });
            });
        });
    });


    it('should remove a song in a list of song', function (done) {

        var song2 = createSongJSON("56af72de2e23372e947501d7");
        var song3 = createSongJSON("56af72de2e23372e947501d8");

        song.postSong(song1, function (err, results) {
            assert.equal(err, null);

            song.postSong(song2, function (err, results) {
                assert.equal(err, null);

                song.postSong(song3, function (err, results) {
                    assert.equal(err, null);

                    song.removeSong("56af72de2e23372e947501d7", function (err, results) {
                        assert.equal(err, null);

                        tab = [];
                        tab.push(song1);
                        tab.push(song3);

                        song.getSongs(function (err, results) {

                            assert.equal(err, null);
                            assert.deepEqual(results, tab);

                            done();
                        });
                    });
                });
            });
        });
    });

    it('should not remove a song in a list of song', function (done) {

        var song2 = createSongJSON("56af72de2e23372e947501d7");
        var song3 = createSongJSON("56af72de2e23372e947501d8");

        song.postSong(song1, function (err, results) {
            assert.equal(err, null);


            song.postSong(song2, function (err, results) {
                assert.equal(err, null);


                song.postSong(song3, function (err, results) {
                    assert.equal(err, null);

                    song.removeSong("56af72de2e23372e947501f5", function (err, results) {

                        tab = [];
                        tab.push(song1);
                        tab.push(song2);
                        tab.push(song3);

                        song.getSongs(function (err, results) {
                            assert.equal(err, null);
                            assert.deepEqual(results, tab);
                            done();
                        });
                    });
                });
            });
        });


    });


    it('should remove all song in the db', function (done) {

        var song2 = createSongJSON("56af72de2e23372e947501d7");
        var song3 = createSongJSON("56af72de2e23372e947501d8");

        song.postSong(song1, function (err, results) {
            assert.equal(err, null);

            song.postSong(song2, function (err, results) {
                assert.equal(err, null);

                song.removeAllSongs(function () {

                    song.getSongs(function (err, results) {
                        assert.equal(err, null);
                        assert.deepEqual(results, []);
                        done();
                    });
                });
            });
        });
    });
});


