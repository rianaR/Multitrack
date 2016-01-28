var assert = require('assert');
var mix = require('../server/mixDB');

mix.setDB('test');

describe("mix test",function(){

       
    beforeEach(function(done){
	mix.removeAllMixes(function(){
	    done();
	});
    });

    it('should not have mix',function(done) {
	mix.removeAllMixes(function(){
	    assert.deepEqual
	    done();
	});
    });

    it('should add and get a mix',function(done) {
	
	mix1 = { _id:1, songId:1 }
	mix.postMix(mix1,function(err,results){
	    assert.equal(err,null);
	    mix.getMixBySong(1,function(err,results){
		assert.equal(err,null);
		tab = [];
		tab.push(mix1);
		assert.deepEqual(results,tab);
		done();
	    });
	});
    });

    it('should get all mix',function(done) {
	
	mix1 = { _id:1 };
	mix2 = { _id:2 };
	
	mix.postMix(mix1,function(err,results){
	    assert.equal(err,null);
	    
	    mix.postMix(mix2,function(err,results){
	    
		mix.getAllMixes(function(err, results){
		    assert.equal(err,null);
		    tab = [];
		    tab.push(mix1);
		    tab.push(mix2);
		    assert.deepEqual(results,tab);
		    done();
		});
	    });
	});
    });

    it('should remove a mix',function(done) {
	
	mix1 = { _id:1 };
	mix2 = { _id:2 };
	
	mix.postMix(mix1,function(err,results){
	    assert.equal(err,null);
	    
	    mix.postMix(mix2,function(err,results){
		assert.equal(err,null);
		
		mix.removeMix(1,function(err,results){

		    mix.getAllMixes(function(err, results){
			assert.equal(err,null);
			tab = [];
			tab.push(mix2);
			assert.deepEqual(results,tab);
			done();
		    });
		});
	    });
	});
    });

});
