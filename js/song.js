function Song(name, tracks, currentTime, volume, played, paused, stopped) {
    this.name = name;
    this.tracks = tracks;
    this.currentTime = currentTime;
    this.volume = volume;
    this.played = played;
    this.paused = paused;
    this.stopped = stopped;
};

Song.prototype.play = function() {
    this.played=true;
    this.paused=false;
    this.stopped=false;
};

Song.prototype.stop = function() {
    this.played=false;
    this.paused=false;
    this.stopped=true;
};

Song.prototype.pause = function() {
    this.played=false;
    this.paused=true;
    this.stopped=false;
};

Song.prototype.loadDecodedBuffers = function(){

};

Song.prototype.buildGraph = function(){

};