var Validator = require("jsonschema").Validator;

var NO_ERROR = 0;
var ERROR_BAD_ID = 1;


var InputValidator = {
    validateSong: function (song) {
        //Description d'un document song
        var songSchema = {
            "id" : "/Song",
            "type" : "Object",
            "properties" : {
                "artist" : { "type" : "string", "required": true },
                "song" : { "type" : "string", "required": true },
                "released" : { "type" : "integer", "required": true },
                "path" : { "type" : "string", "required": true },
                "track" : {
                    "type": "array",
                    "required": true,
                    "items": {
                        "properties" :{
                            "name" : { "type" : "string", "required" : true},
                            "path" : { "type" : "string", "required": true }
                        },
                        "additionalProperties": false
                    }
                }
            }
        };

        //Données renvoyées dans le return
        var result = {
            valid : false,
            errorMessages : []
        };

        //Validation
        var validator = new Validator();
        var validatorResult = validator.validate(song, songSchema);
        //Tableau errors vide = pas d'erreurs de validation
        if (validatorResult.errors.length == 0) {
            result.valid = true;
        }
        else {
            result.valid = false;
            validatorResult.errors.forEach(function(error, index) {
                result.errorMessages.push(error.stack);
            });
        }

        return result;
    }
};

module.exports = InputValidator;