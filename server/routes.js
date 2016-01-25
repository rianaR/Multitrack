/**
 * Created by marina on 07/01/16.
 */
var fs = require("fs");

var express = require('express');
var router = express.Router();

var TRACKS_PATH = 'multitrack/';

var song = require('./songDB');
var mix = require('./mixDB');

router.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// routing
router.get('/track', function (req, res) {
    function sendTracks(trackList) {
        if (!trackList)
            return res.send(404, 'No track found');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(trackList));
        res.end();
    }

    getTracks(sendTracks);
});

// routing
router.get('/track/:id', function (req, res) {
    var id = req.params.id;

    function sendTrack(track) {
        if (!track)
            return res.send(404, 'Track not found with id "' + id + '"');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(track));
        res.end();
    }

    getTrack(id, sendTrack);

});

// routing
router.get(/\/track\/(\w+)\/(?:sound|visualisation)\/((\w|.)+)/, function (req, res) {
    res.sendfile(TRACKS_PATH + req.params[0] + '/' + req.params[1]);
});


// routing song
router.get('/song',function(req,res) {
    song.setDB("test");
    song.getSong(function(err, results){
        res.header('Content-Type', "application/json");
        if (err) {
            res.statusCode = 400;
            res.send(JSON.stringify(err));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
    });
});

router.post('/song',function(req,res) {
    song.setDB("test");
    song.postSong(req.body, function(err, result) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.statusCode = 400;
            res.send(JSON.stringify(err));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(result));
        }
    });
});


router.delete('/allSongs', function(req,res) {
    song.setDB("test");
    song.removeAllSongs(function(err,results) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify(err));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
    });
});

router.delete('/song/:id', function(req,res) {
    song.setDB("test");
    song.removeSong(req.params.id, function(err, results) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify(err));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
    });
});


// routing mix
router.get('/mix',function(req,res) {
    mix.getAllMix(function(err, results) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify({error : 1}));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
    });
});

router.get('/mix/:songId',function(req,res) {
    mix.getMixBySong(req.params.songId,function(err, results) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify({error : 1}));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
    });
});

router.post('/mix',function(req,res) {
    mix.postMix(req.body, function(err, results) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify({error : 1}));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(results));
        }
    });

});


router.delete('/allMix', function(req,res) {
    mix.removeAllMix(req.params.id, function(err, deleted) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify({error : 1}));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(deleted));
        }
    });
});

router.delete('/mix/:id', function(req,res) {
    mix.removeMix(req.params.id, function(err, deleted) {
        res.header('Content-Type', "application/json");
        if (err) {
            res.send(JSON.stringify({error : 1}));
        }
        else {
            res.statusCode = 200;
            res.send(JSON.stringify(deleted));
        }
    });
});


function getTracks(callback) {
    getFiles(TRACKS_PATH, callback);
}

function getTrack(id, callback) {
    getFiles(TRACKS_PATH + id, function(fileNames) {
        var track = {
            id: id,
            instruments: []
        };
        fileNames.sort();
        for (var i = 0; i < fileNames.length; i += 2) {
            var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
            track.instruments.push({
                name: instrument,
                sound: instrument + '.mp3',
                visualisation: instrument + '.png'
            });
        }
        callback(track);
    })
}

function getFiles(dirName, callback) {
    fs.readdir(dirName, function(error, directoryObject) {
        callback(directoryObject);
    });
}

module.exports = router;
