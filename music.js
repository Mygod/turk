var startDelay = 6000;

var notes = [];
var start;
var musicPlaying = false;

var player;

window.onload = function() {
  MIDI.loadPlugin({
    onsuccess: function() {
      if (window.location.hash === '#' || window.location.hash === '') {
        window.location.hash = '#Rachmaninov%20-%20Flight%20of%20the%20Bumblebee';
      }
    },
    instruments: [ 'acoustic_grand_piano' ],
    soundfontUrl: '/bower_components/midi-js-soundfonts/FluidR3_GM/'
  });

  $('#filePicker').change(function (e) {
    if (e.target.files.length !== 1) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      playArrayBuffer(e.target.result);
    };
    reader.onerror = function (e) {
      console.error(e);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  });
};

function playArrayBuffer(buffer) {
  player = MIDI.Player;
  player.timeWarp = 1;

  player.stop();
  for (var i = 0; i < 16; ++i) MIDI.channels[i].instrument = 0; // reset
  musicPlaying = false;
  notes = [];
  timeInSong = -startDelay;
  lastUpdatedTime = null;

  player.currentData = buffer;
  player.loadMidiFile(function() {
    midiData = player.data;

    currentTime = 0;
    var instruments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < midiData.length; i++) {
      midiDatum = midiData[i];

      event = midiDatum[0].event;
      interval = midiDatum[1];

      currentTime += interval;

      switch (event.subtype) {
        case 'noteOn':
          notes.push({
            note: event.noteNumber,
            time: currentTime,
            instrument: instruments[event.channel]
          });
          break;
        case 'programChange':
          instruments[event.channel] = event.programNumber;
          break;
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
}

function switchTo(file) {
  request = new XMLHttpRequest();
  request.responseType = 'arraybuffer';
  request.open("GET", file, true);
  request.onload = function () {
    playArrayBuffer(request.response);
  };
  request.send(null);
}

function playLocal() {
  $('#filePicker').click();
}

function playOnline() {
  var url = prompt('Enter URL:');
  if (url) switchTo(url);
}
