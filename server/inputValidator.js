var Validator = require("jsonschema").Validator;

var NO_ERROR = 0;
var ERROR_BAD_ID = 1;


var InputValidator = {
    validateSong: function (song) {
        var songSchema = {
            "id" : "/Song",
            "type" : "Object",
            "properties" : {
                "artist" : { "type" : "string" },
                "song" : { "type" : "string" },
                "released" : { "type" : "integer", "minimum" : 1  },
                "path" : { "type" : "string" },
                "track" : {
                    "type": "array",
                    "items": {
                        "properties" :{
                            "name" : { "type" : "string" },
                            "path" : { "type" : "string" }
                        }
                    }
                }
            }
        };
        var result = {
            valid : true
        };
        /*
        var validator = new Validator();
        result.errorMessage = validator.validate(song, songSchema);

        if (validator.validate(song, songSchema)) {
            result.valid = true;
            result.errorMessage = "Song is OK"
        }
        else {
            result.valid = false;
            result.errorMessage = "Problem with song"

        }
        */

        return result;
    }
};

module.exports = InputValidator;