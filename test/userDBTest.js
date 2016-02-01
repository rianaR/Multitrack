var assert = require('assert');
var user = require('../server/userDB');
var mix = require('../server/mixDB');

user.setDB('test');

describe('userDB test', function() {

    //remove all the mix and all users each time
    beforeEach(function(done){
	mix.removeAllMix(function(){
	    user.removeAllUsers(function(){
		done();
	    });
	});
    });

    it('should not have mixis and users',function(done){
	mix.getAllMix(function(err,results){
	    assert.deepEqual(results,[]);
	    user.getUsers(function(err,results){
		assert.deepEqual(results,[]);
		done();
	    });
	});
    });

});
