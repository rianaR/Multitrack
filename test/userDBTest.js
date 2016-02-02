var assert = require('assert');
var user = require('../server/userDB');
var mix = require('../server/mixDB');
var ObjectID = require('mongodb').ObjectID;

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
	user.addUser("user1","pwd1","normal",function(err, results){
	    assert.equal(err,null);
	    user.addUser("user2","pwd2","normal",function(err, results){
		assert.equal(err,null);
		user.getUsers(function(err, results){
		    assert.equal(err,null);
		    if(results[0].name=="user1"){
			assert.equal(results[0].name,"user1");
			assert.equal(results[0].pwd,"pwd1");
			assert.equal(results[0].right,"normal");
			assert.equal(results[1].name,"user2");
			assert.equal(results[1].right,"normal");
			assert.equal(results[1].pwd,"pwd2");
		    }
		    else{
			assert.equal(results[0].name,"user2");
			assert.equal(results[0].pwd,"pwd2");
			assert.equal(results[0].right,"normal");
			assert.equal(results[1].name,"user1");
			assert.equal(results[1].right,"normal");
			assert.equal(results[1].pwd,"pwd1");
		    }
		    done();
		});
	    });
	});
    });

    it('should post an user',function(done){
	var user1 = {};
	user1.name = "user";
	user1.pwd = "pwd";
	user1.right = "normal";
	user1.mixes = [];
	user1.comments = [];
	user1.connexion = null;
	user1.timeStamp = null;
	
	user.postUser(user1,function(err,results){
	    assert.equal(err,null);
	    user.getUsers(function(err,results){
		assert.equal(err,null);
		assert.equal(results[0].name,"user");
		assert.equal(results[0].pwd,"pwd");
		assert.equal(results[0].right,"normal");
		assert.deepEqual(results[0].mixes,[]);
		assert.deepEqual(results[0].comments,[]);
		assert.equal(results[0].connexion,null);
		assert.equal(results[0].timeStamp,null);
		done();
	    });
	});
    });

    it('should get connection then user then remove him',function(done){
	user.addUser("user1","pwd1","admin",function(err, results){
	    assert.equal(err,null);
	    user.getConnection("user1","pwd1",function(err,connection){
		user.getUser(connection,function(err,user1){
		    assert.equal(err,null);
		    assert.equal(user1.name,"user1");
		    assert.equal(user1.pwd,null);
		    assert.equal(user1.right,"admin");
		    assert.deepEqual(user1.mixes,[]);
		    assert.deepEqual(user1.comments,[]);
		    assert.equal(user1.connection,connection);
		    user.deleteUser(connection,user1._id,function(err,results){
			assert.equal(err,null);
			user.getUsers(function(err,results){
			    assert.equal(err,null);
			    assert.deepEqual(results,[]);
			    done();
			});
		    });
		});
	    });
	});
    });

        it('should be unable to remove the user',function(done){
	user.addUser("user1","pwd1","normal",function(err, results){
	    assert.equal(err,null);
	    user.getConnection("user1","pwd1",function(err,connection){
		user.getUser(connection,function(err,user1){
		    assert.equal(err,null);
		    assert.equal(user1.name,"user1");
		    assert.equal(user1.pwd,null);
		    assert.equal(user1.right,"normal");
		    assert.deepEqual(user1.mixes,[]);
		    assert.deepEqual(user1.comments,[]);
		    assert.equal(user1.connection,connection);
		    user.deleteUser(connection,user1._id,function(err,results){
			assert.equal(err.statusCode,500);
			assert.equal(err.errorMessage,"This connection token does not have the right to delete this user");
			done();

		    });
		});
	    });
	});
    });


    
    it('should get the connection token', function(done){
	user.addUser("user1","pwd1","normal",function(err, results){
	    assert.equal(err,null);
	    user.getConnection("user1","pwd1",function(err,connection){
		user.getUsers(function(err,results){
		    var user1 = results[0];
		    assert.equal(user1.connection,connection);
		    done();
		});    
	    });
	});
    });  
   
    it('should add a mix to an user',function(done){
	user.addUser("user1","pwd1","normal",function(err, results){
	    assert.equal(err,null);
	    user.getConnection("user1","pwd1",function(err,connection){
		assert.equal(err,null);
		var id =new ObjectID("56af746c0f9c57894d37c859");
		user.addMix(connection,id,function(err,results){
		    assert.equal(err,null);
		    user.getUser(connection,function(err,user1){
			assert.equal(err,null);
			assert.equal(user1.connection,connection);
			assert.deepEqual(user1.mixes[0],id);
			done();
		    });
		});
	    });
	});
    });
    

    it('should add a mix to an user then remove it',function(done){
	user.addUser("user1","pwd1","normal",function(err, results){
	    assert.equal(err,null);
	    user.getConnection("user1","pwd1",function(err,connection){
		assert.equal(err,null);
		var id = new ObjectID("56af746c0f9c57894d37c859");
		user.addMix(connection,id,function(err,results){
		    assert.equal(err,null);
		    user.deleteMix(connection,id,function(err,results){
			assert.equal(err,null);
			user.getUser(connection,function(err,user1){
			    assert.equal(err,null);
			    assert.deepEqual(user1.mixes,[]);
			    done();
			});
		    });
		});
	    });
	});
    });
    
});
