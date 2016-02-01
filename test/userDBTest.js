var assert = require('assert');
var user = require('../server/userDB');
var mix = require('../server/mixDB');

user.setDB('test');

describe('userDB test', function() {

    //remove all the mix and all users each time
    beforeEach(function(done){
	mix.removeAllMixes(function(){
	    user.removeAllUsers(function(){
		done();
	    });
	});
    });

    it('should not have mixes and users',function(done){
	mix.getAllMixes(function(err,results){
	    assert.equal(err,null);
	    assert.deepEqual(results,[]);
	    user.getUsers(function(err,results){
		assert.equal(err,null);
		assert.deepEqual(results,[]);
		done();
	    });
	});
    });

    it('should add two users then return them',function(done){
	user.addUser("user1","normal",function(err, results){
	    assert.equal(err,null);
	    user.addUser("user2","normal",function(err, results){
		assert.equal(err,null);
		user.getUsers(function(err, results){
		    assert.equal(err,null);
		    if(results[0].name=="user1"){
			assert.equal(results[0].name,"user1");
			assert.equal(results[0].right,"normal");
			assert.equal(results[1].name,"user2");
			assert.equal(results[1].right,"normal");
		    }
		    else{
			assert.equal(results[0].name,"user2");
			assert.equal(results[0].right,"normal");
			assert.equal(results[1].name,"user1");
			assert.equal(results[1].right,"normal");
		    }
		    done();
		});
	    });
	});
    });

    

});
