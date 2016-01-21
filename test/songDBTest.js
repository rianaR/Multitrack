var assert = require('assert');
var song = require('../server/songDB');

song.setDB('test');

describe('songDb', function() {
    describe('removeAllSongs', function() {
	it('should return the song collection name',function(){
	    assert.equal(song.getSongDB(),'song');
	});
	/**
	it('should empty the collection', function() {
	    song.removeAllSongs();
	    var res = {}
	    assert.equal(song.getSong(res,function(){}),[]);
	});*/
    });
});
