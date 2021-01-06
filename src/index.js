import world from './world';
import audio from './audio';
import feed from './issFeed';
import metadata from './metadata';

window.onload = function() {
  world.setupCanvas();
  world.createWorld();
  const width  = window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth;
  if (width > 767) {
    // feed.startISSFeed();
  }
  if (width > 1023) {
    // metadata.getCurrentSong();
    // setInterval(metadata.getCurrentSong(), 30000);
  }
  // audio.playPause();
  document.getElementById("playButton").addEventListener("click", audio.play);
  document.getElementById("pauseButton").addEventListener("click", audio.pause);

  document.getElementById("receive-broadcast-button").addEventListener("click", feed.startISSFeed);

  document.getElementById("questionMark").addEventListener("click", toggleShowAbout, false);
  window.addEventListener('click', windowClickListener, false);

  function windowClickListener (event) {
    if (!document.getElementById("aboutContainer").contains(event.target) &&
    !document.getElementById("questionMark").contains(event.target)) {
      document.getElementById("aboutContainer").style.visibility = "hidden";
    }
  }

  function toggleShowAbout () {
    if (document.getElementById("aboutContainer").style.visibility == "visible") {
      document.getElementById("aboutContainer").style.visibility = "hidden";
    } else {
      document.getElementById("aboutContainer").style.visibility = "visible";
    }
  }
}
