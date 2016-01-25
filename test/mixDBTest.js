var assert = require('assert');
var mix = require('../server/mixDB');

mix.setDB('test');

describe("mix test",function(){

       
    beforeEach(function(done){
	mix.removeAllMix(function(){
	    done();
	});
    });

    it('should not have mix',function(done) {
	mix.removeAllMix(function(){
	    assert.deepEqual
	    done();
	});
    });

});
