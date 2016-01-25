var Validator = require("jsonschema").Validator;
var validator = new Validator();

var NO_ERROR = 0;
var ERROR_BAD_ID = 1;

var fields = ["_id", "artist", "song", "released", "path", "track"];

var InputValidator = {
    validateSong: function (song) {
        var songSchema = {
            "type" : "Object",
            "properties" : {
                "artist" : { "type" : "string" },
                "song" : { "type" : "string" },
                "released" : {  }
            }
        };
        var result = {
            valid : true
        };
        var keys = Object.keys(song);
        for (var i = 0; i < fields.length; i++) {
            if (keys.indexOf(fields[i]) == -1) {
                result.valid = false;
                result.errorMessage = fields[i]+" field is missing.";
                return result;
            }
        }



    }
};

module.exports = InputValidator;