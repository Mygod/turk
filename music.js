var startDelay = 6000;

var notes = [];
var start;
var musicPlaying = false;

var player;

window.onload = function() {
  MIDI.loadPlugin(function() {
    console.log("Sound being generated with " + MIDI.lang + ".");
    
    if (window.location.hash === '#' || window.location.hash === '') {
      window.location.hash = '#Rachmaninov%20-%20Flight%20of%20the%20Bumblebee';
    }
  }, "soundfont/acoustic_grand_piano-mp3.js");
};

function switchTo(file) {
  request = new XMLHttpRequest();
  request.responseType = 'arraybuffer';
  request.open("GET", file, true);
  request.onload = function (event) {
    player = MIDI.Player;
    player.timeWarp = 1;

    player.stop();
    musicPlaying = false;
    notes = [];
    timeInSong = -startDelay;
    lastUpdatedTime = null;

    player.currentData = request.response;
    player.loadMidiFile(function() {
      midiData = player.data;

      currentTime = 0;

      for (var i = 0; i < midiData.length; i++) {
        midiDatum = midiData[i];

        midiEvent = midiDatum[0].event;
        interval = midiDatum[1];

        currentTime += interval;

        if (midiEvent.subtype === 'noteOn') {
          notes.push({ note: midiEvent.noteNumber, time: currentTime })
        }
      }

      player.addListener(function(data) {
        resetTimer(data.now);
      });

      start = new Date();

      setTimeout(function() {
        player.start();
      }, startDelay);

      musicPlaying = true;
    }, null, function (e) {
      console.error(e);
    });
  };
  request.send(null);
}
