var NO_ERROR = 0;
var ERROR_BAD_ID = 1;

var InputValidator = {
    validateSong: function (song) {
        //Vérifier que le JSON est correct
        /*
         id : nombre > 0
         released : année est un nombre
         tracks : name et path même base
         */
        return {
            valid : true,
            errorCode : NO_ERROR,
            errorMessage : "Song ID ok"
        };
    }
};

module.exports = InputValidator;