var assert = require('assert');
var song = require('../server/songDB');

song.setDB('test');

song1 = {};

function createSongJSON(id){
    return { 
	"_id":id,
	"artist":"Queen",
	"song":"We Are The Champions",
	"released":"1977",
	"path":"multitrack/queen_champions/",
	"track": [
	    {
		"name":"basse",
		"path":"basse.mp3"
	    },
	    {
		"name":"batterie",
		"path":"batterie.mp3"
	    },
	    {
		"name":"guitare",
		"path":"guitare.mp3"
	    },
	    {
		"name":"guitare2",
		"path":"guitare2.mp3"
	    },
	    {
		"name":"piano",
		"path":"piano.mp3"
	    },
	    {
		"name":"voix",
		"path":"voix.mp3"
	    }
	]
    }
}

describe('songDB', function() {

    beforeEach(function(){
	song.removeAllSongs(function(){});

	song1 = createSongJSON(1);

    });

    describe('function test', function() {

	it('should return the song collection name',function(){
	    assert.equal(song.getSongDB(),'song');
	});
	
	it('should empty the collection', function(done) {

	    song.getSong(function(err,results){
		tab = [];
		assert.deepEqual(err,null);
		assert.deepEqual([],tab);
	    done();
	    });
	});

	it('should add a new song', function(done){
	    song.postSong(song1,function(err,results) {
		assert.equal(err,null);

		song.getSong(function(err,results){
		    tab = [];
		    tab.push(song1);
		    assert.equal(err,null);
		    assert.deepEqual(results,tab);
		    done();
		});
	    });
	});
	
	it('should remove a song', function(done){
	    song.postSong(song1,function(err,results) {
		assert.equal(err,null);

		song.removeSong(1, function(err, results) {
		    assert.equal(err,null);

		    song.getSong(function(err,results){
			assert.equal(err,null);
			assert.deepEqual(results,[]);

			done();
		    });
		});
	    });
	});

	
	it('should remove a song in a list of song', function(done){

	    song2 = createSongJSON(2);
	    song3 = createSongJSON(3);

	    song.postSong(song1,function(err,results) {
		assert.equal(err,null);

		song.postSong(song2,function(err,results) {
		    assert.equal(err,null);   

		    song.postSong(song3,function(err,results) {
			assert.equal(err,null);

			song.removeSong(2, function(err, results) {
			    assert.equal(err,null);		    

			    tab = [];
			    tab.push(song1);
			    tab.push(song3);

			    song.getSong(function(err,results){

				assert.equal(err,null);
				assert.deepEqual(results,tab);
				
				done();
			    });
			});
		    });
		});
	    });
	});

	it('should not remove a song in a list of song', function(done){
  
	    song2 = createSongJSON(2);
	    song3 = createSongJSON(3);

	    song.postSong(song1,function(err,results) {
		assert.equal(err,null);


		song.postSong(song2,function(err,results) {
		    assert.equal(err,null);


		    song.postSong(song3,function(err,results) {
			assert.equal(err,null);

			song.removeSong(4, function(err, results) {
//			    assert.equal(results,null);


			    tab = [];
			    tab.push(song1);
			    tab.push(song2);
			    tab.push(song3);

			    song.getSong(function(err,results){
				assert.equal(err,null);
				assert.deepEqual(results,tab);
				done();
			    });
			});			
		    });		
		});			   
	    });


	});

	

	it('should remove all song in the db', function(done){

	    song2 = createSongJSON(2);
	    song3 = createSongJSON(3);
	    
	    song.postSong(song1,function(err,results) {
		assert.equal(err,null);

		song.postSong(song2,function(err,results) {
		    assert.equal(err,null);

		    song.removeAllSongs(function(){});

		    song.getSong(function(err,results){
			assert.equal(err,null);
			assert.deepEqual(results,[]);
			done();
		    });
		});
	    });	    
	});
    });
});

