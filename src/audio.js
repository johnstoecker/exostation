var exostationAudio = {
  paused: false,
  audio: undefined,
  audioContext: undefined,
  mediaElementSource: undefined,
  analyzer: undefined,
  anaylzerBytes: undefined
};


//http://hirschmilch.de:7000/listen.pls?sid=3&t=.m3u
//http://95.217.39.141:9125/listen.pls?sid=1&t=.m3u
//http://192.99.17.12:4516/listen.pls?sid=1&t=.m3u
//http://149.56.157.81:5104/listen.pls?sid=1&t=.m3u jrfmnetwork.com JR.FM Chill/Lounge Radio

//https://www.internet-radio.com/servers/tools/playlistgenerator/?u=http://192.99.35.215:5078/listen.pls?sid=1&t=.m3u
// Chill Cafe
// Rainy Days In Tokyo Lofi Hip Hop Jazzhop Chillhop Mix - Beats to chillstudyrelax [2cSj]
// https://a1airadionetwork.com DEFUNCT!

// http://aska.ru-hoster.com:8053/stream

var streams = [
  { name: "Chill", src: "http://aska.ru-hoster.com:8053/stream", details: "http://lifechillmusic.com" }
];

var currentStreamIndex = 0;

// function nextStream() {
//   currentStreamIndex = (currentStreamIndex + 1) % streams.length;
//   if (!exostationAudio.paused) {
//     playPause();
//   }
//   if (exostationAudio.audio) {
//     stopStream();
//   }
//   playPause();
// }

function play() {
  document.getElementById("video-player").src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1";
  document.getElementById("playButton").style.display = 'none';
  document.getElementById("pauseButton").style.display = 'block';
}

function pause() {
  document.getElementById("video-player").src="https://www.youtube.com/embed/5qap5aO4i9A?mute=1";
  document.getElementById("playButton").style.display = 'block';
  document.getElementById("pauseButton").style.display = 'none';
}

// for internet radio
function playPause2() {
  if (document.getElementById("radioStream")) {
    if (exostationAudio.paused) {
      document.getElementById("radioStream").play();
      exostationAudio.paused = false;
      document.getElementById("playButton").style.display = 'none';
      document.getElementById("pauseButton").style.display = 'block';
    } else {
      document.getElementById("radioStream").pause();
      exostationAudio.paused = true;
      document.getElementById("playButton").style.display = 'block';
      document.getElementById("pauseButton").style.display = 'none';

    }
    return;
  } else {
    document.getElementById("playButton").style.display = 'none';
    document.getElementById("pauseButton").style.display = 'block';
    startStream()
  }
}

function stopStream() {
   var elem = document.getElementById("radioStream");
   return elem.parentNode.removeChild(elem);
   exostationAudio.scriptProcessorNode.disconnect(exostationAudio.audioContext.destination);
   delete exostationAudio.audio;
   delete exostationAudio.audioContext;
   delete exostationAudio.mediaElementSource;
   delete exostationAudio.analyzer;
   delete exostationAudio.analyzerBytes;
   delete exostationAudio.scriptProcessorNode;
}

function startStream() {
  // // Create a new instance of an audio object and adjust some of its properties
  let chillAudio = new Audio();

  chillAudio.src = streams[currentStreamIndex].src;
  console.log("loading " + streams[currentStreamIndex].details);
  // document.getElementById("currentStation").innerHTML = streams[currentStreamIndex].name;
  // exostationAudio.audio.crossOrigin = "anonymous";
  // exostationAudio.audio.controls = false;
  // exostationAudio.audio.style.position = "absolute"
  // exostationAudio.audio.style.bottom = "10px"
  chillAudio.volume = 0.5
  chillAudio.id = "radioStream"
  document.getElementById('audio_box').appendChild(chillAudio);

  exostationAudio.audio = chillAudio;
  chillAudio.play();
}

export default {
  exostationAudio: exostationAudio,
  play: play,
  pause: pause
}
