var context;
var source = null;
var currentSong;

//****** Elements graphiques ************

// Boutons graphiques play pause stop
var buttonPlay, buttonStop, buttonPause;
// Slider volume général
var masterVolumeSlider;
// List of tracks and mute buttons
var divTrack;

// Dessin
var canvas, ctx;
var frontCanvas, frontCtx;

// Sample size in pixels
var SAMPLE_HEIGHT = 100;

// requestAnim shim layer by Paul Irish, like that canvas animation works
// in all browsers
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function init() {
    // Get handles on buttons
    buttonPlay = document.querySelector("#bplay");
    buttonPause = document.querySelector("#bpause");
    buttonStop = document.querySelector("#bstop");

    divTrack = document.getElementById("tracks");


    // canvas where we draw the samples
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext('2d');

    // Create a second canvas
    frontCanvas = document.createElement('canvas');
    frontCanvas.id = 'canvasFront';
    // Add it as a second child of the mainCanvas parent.
    canvas.parentNode.appendChild(frontCanvas);
    // make it same size as its brother
    frontCanvas.height = canvas.height;
    frontCanvas.width = canvas.width;
    frontCtx = frontCanvas.getContext('2d');

    frontCanvas.addEventListener("mousedown", function(event) {
        console.log("mouse click on canvas, let's jump to another position in the song")
        var mousePos = getMousePos(frontCanvas, event);
        // will compute time from mouse pos and start playing from there...
        jumpTo(mousePos);
    })

    // Master volume slider
    masterVolumeSlider = document.querySelector("#masterVolume");

    // Init audio context
    context = initAudioContext();
    
    // Get the list of the songs available on the server and build a 
    // drop down menu
    loadSongList();

    animateTime();
}


function initAudioContext() {
    // Initialise the Audio Context
    // There can be only one!
    var audioContext = window.AudioContext || window.webkitAudioContext;

    var ctx = new audioContext();

    if(ctx === undefined) {
        throw new Error('AudioContext is not supported. :(');
    }

    return ctx;
}
// SOUNDS AUDIO ETC.


function resetAllBeforeLoadingANewSong() {
    // Marche pas, c'est pour tester...
    console.log('resetAllBeforeLoadingANewSong');
    // reset array of tracks. If we don't do this we just add new samples to existing
    // ones... playing two songs at the same time etc.
    tracks = [];

    stopAllTracks();
    buttonPlay.disabled = true;
    divTrack.innerHTML="";
    /*
    samples.forEach(function(s) {
        s.stop(0);
        s.disconnect(0);
    });*/
}

// Partie views des pistes, des graphes (?)

var bufferLoader;
function loadAllSoundSamples(tracks) {


    bufferLoader = new BufferLoader(
            context,
            tracks,
            finishedLoading
            );
    bufferLoader.load();
}
function finishedLoading(bufferList) {
    console.log("finished loading");

    buffers = bufferList;
    buttonPlay.disabled = false;
}

// ######### SONGS
// Charger la liste des chansons de la "base de données"
function loadSongList() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "track", true);

    // Menu for song selection
    var s = $("<select/>");
    s.appendTo("#songs");
    s.change(function(e) {
        console.log("You chose : " + $(this).val());
        currentSong = new Song(
            {name: $(this).val()},
            context
        );
        loadTrackList($(this).val());
    });

    xhr.onload = function(e) {
        var songList = JSON.parse(this.response);

        songList.forEach(function(songName) {
            console.log(songName);

            $("<option />", {value: songName, text: songName}).appendTo(s);
        });
    };
    xhr.send();
}


// ######## TRACKS
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function getTrackName(elem) {
// returns the name without the suffix
    var n = elem.lastIndexOf(".");
    return elem.slice(0, n + 1);
}

// Charger et afficher la liste des pistes d'une chanson
function loadTrackList(songName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "track/" + songName, true);
    xhr.onload = function(e) {
        var track = JSON.parse(this.response);
        // resize canvas depending on number of samples
        resizeSampleCanvas(track.instruments.length);
        var i = 0;

        track.instruments.forEach(function(instrument, trackNumber) {
            // Image
            console.log("on a une image");
            // Render HTMl
            var span = document.createElement('span');
            var imageURL = "track/" + songName + "/visualisation/" + instrument.visualisation;

            span.innerHTML = instrument.name +
                    "<button id='mute" + trackNumber + "' onclick='muteUnmuteTrack(" + trackNumber + ");'>Mute</button><br/>"
                    /*
                    +
                    "<img class='sample' src='" + imageURL + "'/><br/>";
                    */
            drawSampleImage(imageURL, trackNumber, instrument.name);
            divTrack.appendChild(span);

            // Audio
            console.log("on a un fichier audio");

            var url = "track/" + songName + "/sound/" + instrument.sound;
            currentSong.addTrack(instrument.name, url, trackNumber);
            console.log("Ajout piste audio " + instrument.name);
            

        });
        currentSong.loadTracks();
        buttonPlay.disabled = false;
    };
    xhr.send();
}

function loadSong(song) {
    currentSong = new Song(
        {name: song},
        context
    );
    loadTrackList(song);
}

//*******************************************

//Partie gestion des pistes (pause, play, stop, mute/unmute, position dans les pistes)

function playAllTracks(startTime) {
    currentSong.play();

    buttonPlay.disabled = true;
    buttonStop.disabled = false;
    buttonPause.disabled = false;

    console.log("start all tracks startTime =" + startTime);
}

function stopAllTracks() {
    currentSong.stop();
    buttonStop.disabled = true;
    buttonPause.disabled = true;
    buttonPlay.disabled = false;
}

function pauseAllTracks() {
    if (!currentSong.paused) {
        currentSong.pause();
        buttonPause.innerHTML = "Resume";
    } else {
        currentSong.play();
        buttonPause.innerHTML = "Pause";
    }
}

function setMasterVolume() {

    var fraction = parseInt(masterVolumeSlider.value) / parseInt(masterVolumeSlider.max);
    // Let's use an x*x curve (x-squared) since simple linear (x) does not
    // sound as good.
    if (currentSong != undefined) {
        currentSong.setMasterVolume(fraction*fraction);
    }
}
function changeMasterVolume() {
    setMasterVolume();
}


function muteUnmuteTrack(trackNumber) {
    //mute / unmute button
    var b = document.querySelector("#mute" + trackNumber);

    currentSong.muteUnmuteTrack(trackNumber);
    b.innerHTML = (b.innerHTML == "Unmute" ? "Mute" : "Unmute");
}

//*********************************************

// Partie représentation graphique de la piste et déplacement dans la piste

function getMousePos(canvas, evt) {
    // get canvas position
    var obj = canvas;
    var top = 0;  
    var left = 0;
 
    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    // return relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {
        x:mouseX,
        y:mouseY
    };
 }

 function jumpTo(mousePos) {
    console.log("in jumpTo x = " + mousePos.x + " y = " + mousePos.y);
    // width - totalTime
    // x - ?
       stopAllTracks();
    var totalTime = currentSong.getDuration();
    var startTime = (mousePos.x * totalTime) / frontCanvas.width;
    currentSong.elapsedTimeSinceStart = startTime;
    playAllTracks(startTime);
 }

function animateTime() {
    if (currentSong && !currentSong.paused) {
        frontCtx.clearRect(0, 0, canvas.width, canvas.height);
        frontCtx.fillStyle = 'white';
        frontCtx.font = '14pt Arial';
        frontCtx.fillText(currentSong.elapsedTimeSinceStart.toPrecision(4), 100, 20);

        // at least one track has been loaded
        if (currentSong.tracks[0] != undefined) {
            var totalTime = currentSong.getDuration();
            var x = currentSong.elapsedTimeSinceStart * canvas.width / totalTime;

            // Draw the time on the front canvas
            frontCtx.strokeStyle = "white";
            frontCtx.lineWidth = 3;
            frontCtx.beginPath();
            frontCtx.moveTo(x, 0);
            frontCtx.lineTo(x, canvas.height);
            frontCtx.stroke();

            currentSong.updateTime();
        }
    }
    requestAnimFrame(animateTime);
}

function drawSampleImage(imageURL, trackNumber, trackName) {
    var image = new Image();

    image.onload = function() {
        // SAMPLE_HEIGHT pixels height
        var x = 0;
        var y = trackNumber * SAMPLE_HEIGHT;
        ctx.drawImage(image, x, y, canvas.width, SAMPLE_HEIGHT);

        ctx.strokeStyle = "white";
        ctx.strokeRect(x, y, canvas.width, SAMPLE_HEIGHT);

        ctx.font = '14pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(trackName, x + 10, y + 20);
    }
    image.src = imageURL;
}

function resizeSampleCanvas(numTracks) {
    canvas.height = SAMPLE_HEIGHT * numTracks;
    frontCanvas.height = canvas.height;
}
function clearAllSampleDrawings() {
    //ctx.clearRect(0,0, canvas.width, canvas.height);
}
