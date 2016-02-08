var Validator = require("jsonschema").Validator;
var ObjectID = require('mongodb').ObjectId;

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
    },
    validateMix : function(mix) {
        //Verifying user_id and object_id

        if (mix.hasOwnProperty("_id") && !ObjectID.isValid(mix._id)) {
            return {
                valid : false,
                errorMessages : "mix id is invalid"
            }
        }

        var mixSchema = {
            "id" : "/Mix",
            "type" : "Object",
            "properties" : {
                "_id" : { "required" : false },
		"owner":{ "type" : "string", "required":false },
                "name" : { "type" : "string", "required": true },
                "song_id" : { "required" : true },
                "masterVolume" : { "type": "number", "required": true },
		"comments" : { "type":"array", "required":false },
                "trackEffects" : {
                    "type": "array",
                    "required": true,
                    "items": {
                        "properties" :{
                            "track" : { "type" : "string", "required" : true },
                            "volume": { "type" : "number", "required" : true },
                            "mute": { "type" : "boolean", "required" : true }
                        }
                    }
                }
            },
            "additionalProperties": false
        };

        //Données renvoyées dans le return
        var result = {
            valid : false,
            errorMessages : []
        };

        //Validation
        var validator = new Validator();

        var validatorResult = validator.validate(mix, mixSchema);
        //Tableau errors vide = pas d'erreurs de validation
        if (validatorResult.errors.length == 0) {
            if (!ObjectID.isValid(mix.song_id)) {
                result = {
                    valid : false,
                    errorMessages : "song id is invalid"
                };
            }
            else {
                result.valid = true;
            }
        }
        else {
            result.valid = false;
            validatorResult.errors.forEach(function(error) {
                result.errorMessages.push(error.stack);
            });
        }

        return result;
    },

    validateComment : function(comment) {
        var commentSchema = {
            "id" : "/Comment",
            "type" : "Object",
            "properties" : {
                "_id" : {"type" : "string", "required" : false },
                "user_id" : { "type" : "string", "required" : true },
                "mix_id" : {"type" : "string", "required" : true },
                "content" : { "type" : "string", "required" : true },
                "rate" : { "type": "integer", "required": true }
            },
            "additionalProperties": false
        };

        //Validation de la structure de comment
        var validator = new Validator();
        var validatorResult = validator.validate(comment, commentSchema);
        if (!(validatorResult.errors.length == 0)) {
            var errorMessages = [];
            validatorResult.errors.forEach(function(error) {
                errorMessages.push(error.stack);
            });
            return {
                valid : false,
                errorMessages : errorMessages
            }
        }

        //Besoin de vérifier "à la main" que les ObjectID sont valides
        if (!ObjectID.isValid(comment.user_id)) {
            return {
                valid : false,
                errorMessages : "user id is invalid"
            }
        }

        if (!ObjectID.isValid(comment.mix_id)) {
            return {
                valid : false,
                errorMessages : "mix id is invalid"
            }
        }

        return {
            valid : true,
            errorMessages : []
        }
    }
};

module.exports = InputValidator;
