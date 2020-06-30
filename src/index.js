// import scene from './scene'

// import sunsetAudio from './audio'

import world from './world';

window.onload = function() {
  world.createWorld();

  // change these settings
  // var patternSize = 64,
  //     patternScaleX = 3,
  //     patternScaleY = 1,
  //     patternRefreshInterval = 4,
  //     patternAlpha = 25; // int between 0 and 255,
  //
  // var patternPixelDataLength = patternSize * patternSize * 4,
  //     patternCanvas,
  //     patternCtx,
  //     patternData,
  //     frame = 0;
  //
  // // create a canvas which will be used as a pattern
  // function initGrain() {
  //     patternCanvas = document.createElement('canvas');
  //     patternCanvas.width = patternSize;
  //     patternCanvas.height = patternSize;
  //     patternCtx = patternCanvas.getContext('2d');
  //     patternData = patternCtx.createImageData(patternSize, patternSize);
  // }
  //
  // // put a random shade of gray into every pixel of the pattern
  // function update() {
  //     var value;
  //
  // }
  //
  // // fill the canvas using the pattern
  // function draw() {
  //     ctx.clearRect(0, 0, viewWidth, viewHeight);
  //
  //     ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
  //     ctx.fillRect(0, 0, viewWidth, viewHeight);
  // }
  //
  // function loop() {
  //     if (++frame % patternRefreshInterval === 0) {
  //         update();
  //         draw();
  //     }
  //
  //     requestAnimationFrame(loop);
  // }


}


// window.addEventListener('load', function() {
//   // window.addEventListener("keypress", keypress, false);
//   // window.addEventListener("click", sunsetAudio.playPause);
//   // document.getElementById("playButton").addEventListener("click", sunsetAudio.playPause);
//   // document.getElementById("pauseButton").addEventListener("click", sunsetAudio.playPause);
//   // document.getElementById("nextButton").addEventListener("click", sunsetAudio.nextStream);
//   // document.getElementById("dolphinButton").addEventListener("click", scene.spawnDolphin);
//
//   function keypress(e) {
//     // spacebar
//     if (e.keyCode == 32) {
//       sunsetAudio.playPause();
//     }
//     // 'd'
//     if (e.keyCode == 100) {
//       scene.spawnDolphin();
//     }
//
//     // 't'
//     if (e.keyCode == 116) {
//       // toggle instructions
//       if (document.getElementById('visualizerInfo').style.visibility == "hidden") {
//         document.getElementById('visualizerInfo').style.visibility = "visible";
//       } else {
//         document.getElementById('visualizerInfo').style.visibility = "hidden";
//       }
//     }
//   }
// })
