function Track(name, url) {

    this.name = name;
    this.url = url;

    this.volumeNode = null;
    this.buffer = null;
    this.sample = null;

    this.muted=false;
}

Track.prototype.setVolume = function(value) {
    if( this.volumeNode != undefined)
        this.volumeNode.gain.value = value;
};

Track.prototype.muteUnmute = function() {
    if (this.volumeNode != undefined) {
        this.muted = !this.muted;
        this.volumeNode.gain.value = (this.muted ? 0 : 1);
    }
};