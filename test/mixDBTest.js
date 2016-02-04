var assert = require('assert');
var mix = require('../server/mixDB');
var songDB = require('../server/songDB');
var ObjectID = require('mongodb').ObjectID;
var user = require('../server/userDB');

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
};

var song2 = {
    "_id": new ObjectID("56af742e4ec4a781cef3d569"),
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
            songDB.removeAllSongs( function () {
                songDB.postSong(song1, function(err) {
                    assert.equal(err, null);
                    songDB.postSong(song2, function(err) {
                        assert.equal(err, null);
                        done();
                    })
                });
            });
        });
    });


    it('should not have mix', function (done) {
        mix.removeAllMixes(function () {
            mix.getAllMixes(function (err, results) {
                assert.deepEqual(results, []);
                done();
            });
        });
    });

    it('should fail to add mix : invalid song id', function(done) {
        var invalidMix = {
            "name": "invalidMix",
            "user_id": "token",
            "song_id": "56af742e4ec4a781cef3d",

            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        mix.postMix(invalidMix, function (err) {
            assert.ok(err != null);
            mix.getAllMixes(function (err, results) {
                assert.equal(err, null);
                assert.equal(results.length, 0);
                done();
            });
        });
    });

    it('should add and get a mix', function (done) {
        var mix1 = {
            "name": "mix1",
            "user_id": "token",
            "song_id": "56af742e4ec4a781cef3d568",
            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        mix.postMix(mix1, function (err, results) {
            var mix1Id=""+results.insertedId;
            assert.equal(err, null);
            mix.getMixByID(mix1Id, function (err, result) {
                assert.equal(err, null);
                assert.equal(result._id.toHexString(), mix1Id);
                done();
            });
        });
    });

    it('should get all mix', function (done) {

        var mix1 = {
            "name": "mix1",
            "user_id": "token",
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        var mix2 = {
            "name": "mix2",
            "user_id": "token",
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
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
                mix.getAllMixes(function (err, results) {
                    assert.equal(err, null);
                    assert.equal(results.length, 2);
                    done();
                });
            });
        });
    });

    it('should update a mix', function (done) {
        var mix1 = {
            "name": "mix1",
            "user_id": "token",
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        mix.postMix(mix1, function (err, results) {
            var mix1Id = String(results.insertedId);
            assert.equal(err, null);
            var updatedMix = {
                "_id": mix1Id,
                "name": "mix1",
                "user_id": "token",
                "song_id": "56af72df2e23372e947501d8",
                "masterVolume": 0.5,
                "trackEffects": [
                    {
                        "track": "guitare",
                        "volume": 0.8,
                        "mute": 1
                    },
                    {
                        "track": "batterie",
                        "volume": 0.3,
                        "mute": 1
                    }
                ]
            };
            mix.postMix(updatedMix, function (err, results) {
                console.log(results);
                assert.equal(err, null);
                mix.getMixByID(String(results.ops[0]._id), function (err, result) {
                    assert.equal(err, null);
                    assert.equal(result.masterVolume, 0.5);
                    done();
                });
            });
        });

    });

    it('should remove a mix', function (done) {

        var mix1 = {
            "name": "mix1",
            "user_id": "token",
            "song_id": "56af72df2e23372e947501d8",
            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };
        var mix2 = {
            "name": "mix2",
            "user_id": "token",
            "song_id": "56af742e4ec4a781cef3d569",
            "masterVolume": 0.7,
            "trackEffects": [
                {
                    "track": "guitare",
                    "volume": 0.8,
                    "mute": 1
                },
                {
                    "track": "batterie",
                    "volume": 0.3,
                    "mute": 1
                }
            ]
        };

        mix.postMix(mix1, function (err, results) {
            var mix1Id = results.insertedId;
            assert.equal(err, null);

            mix.postMix(mix2, function (err, results) {
                assert.equal(err, null);
                //using id of post
                mix.removeMix(""+results.insertedId, function (err, res) {
                    assert.equal(err, null);
                    assert.equal(res.result.ok, 1);
                    assert.equal(res.result.n, 1);
                    mix.getAllMixes(function (err, results) {
                        assert.equal(err, null);
                        assert.equal(results.length, 1);
                        assert.equal(results[0]._id.toHexString(), mix1Id);
                        done();
                    });
                });
            });
        });
    });

    it('should add a mix in the mixDB and in userDB', function (done) {
	user.addUser("user1","pwd","normal",function(err,results){
	    assert.equal(err, null);
	    user.getConnection("user1","pwd",function(err,connection){
		assert.equal(err, null);
		mix1 = {
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
		mix.postUserMix(connection,mix1, function (err, results) {
		    assert.equal(err, null);
		    mix.getAllMixes(function (err, mixes) {
			assert.equal(err, null);
			user.getUser(connection,function(err,user1){
			    assert.equal(err, null);
			    assert.deepEqual(user1.mixes[0],mix1._id);
			    assert.deepEqual(mixes[0],mix1);
			    done()
			});
		    });
		});
	    });
	});
    });

    it('should update the mix when the right match', function (done) {
	user.addUser("user1","pwd","normal",function(err,results){
	    assert.equal(err, null);
	    user.addUser("user2","pwd","normal",function(err,results){
		assert.equal(err, null);
		user.addUser("admin","pwd","admin",function(err,results){
		    assert.equal(err, null);
		    user.getConnection("user1","pwd",function(err,connection){
			assert.equal(err, null);
			mix1 = {
			    "name": "mix1",
			    "user_id": "token",
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
			user.getUser(connection, function(err, user1){
			    mix.postUserMix(connection,mix1, function (err, results) {
				assert.equal(err, null);
				mix1.name = "mix2";
				mix.updateUserMix(connection,mix1,function(err,results) {
				    assert.equal(err, null);
				    mix.getAllMixes(function(err,mixes){
					assert.equal(err, null);
					assert.equal(mixes[0].name,"mix2");
					user.getConnection("user2","pwd",function(err,connection){
					    assert.equal(err,null);
					    mix1.name = "mix3";
					    mix.updateUserMix(connection,mix1,function (err, results){
						assert.equal(err.statusCode, 401);
						assert.equal(err.errorMessage,"Unauthorized, you don't have the right to update this mix");
	    					user.getConnection("admin","pwd",function(err,connection){
						    assert.equal(err,null);
						    mix1.name = "mix4";
						    mix.updateUserMix(connection,mix1,function (err, results){
							assert.equal(err,null);
							mix.getAllMixes(function(err,mixes){
							    assert.equal(err, null);
							    assert.equal(mixes[0].name,"mix4");
							    done();
							});
						    });
						});
					    });
					});
				    });
				});
			    });
			});
		    });
		});
	    });
	});
    });	    
});
