import world from './world';
import audio from './audio';

window.onload = function() {
  world.createWorld();
  // audio.playPause();
  document.getElementById("playButton").addEventListener("click", audio.playPause);
  document.getElementById("pauseButton").addEventListener("click", audio.playPause);
}
