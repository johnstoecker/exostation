// import scene from './scene'

// import sunsetAudio from './audio'

import { Group,Path,Point,Raster,Size,view,paper } from 'paper';

window.onload = function() {
  paper.setup('planet-canvas');

  var topLeft = new Point(view.bounds.x,view.bounds.y)
  var bottomRight = new Point(view.bounds.width, view.bounds.height)
  var horizonHeight = 500;
  var bottomLeftHorizon = new Point(0, horizonHeight)
  var bottomRightHorizon = new Point(view.bounds.width, horizonHeight);

  var sky = new Path.Rectangle({
      topLeft: topLeft,
      bottomRight: bottomRightHorizon,
      // Fill the path with a gradient of three color stops
      // that runs between the two points we defined earlier:
      fillColor: {
          gradient: {
              stops: ['lightred', 'red']
          },
          origin: new Point(view.bounds.width/2, 0),
          destination: new Point(view.bounds.width/2, horizonHeight)
      }
  });

  var sea = new Path.Rectangle({
      topLeft: bottomLeftHorizon,
      bottomRight: bottomRight,
      // Fill the path with a gradient of three color stops
      // that runs between the two points we defined earlier:
      fillColor: {
          gradient: {
              stops: ['lightblue', 'blue']
          },
          origin: new Point(view.bounds.width/2, horizonHeight),
          destination: new Point(view.bounds.width/2, view.bounds.height)
      }
  });

  // stars
  for (var i=0; i<20; i++) {
    var myCircle = new Path.Circle(new Point(Math.random() * 700, Math.random() * horizonHeight), Math.random() * 3);
    myCircle.strokeColor = 'white';
    myCircle.fillColor = 'white';
  }

  var moonX = Math.random() * 15 + view.bounds.width/2 - 8;
  var moonY = Math.random() * 15 + horizonHeight - 80;
  var moonRadius = Math.random() * 15 + 35;
  // var moon = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // moon.strokeColor = 'white';
  // moon.fillColor = 'white';



  var moonClipper = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // var url = './noise-99.png';
  // var raster = new Raster(url);
  var raster = new Raster(new Size(moonRadius, moonRadius), new Point(moonX, moonY));
  var imageData = raster.createImageData(new Size(moonRadius, moonRadius));

  var moonNoiseAlpha = 1;
  // Make everything red
  for(var i = 0; i < moonRadius * moonRadius; i++) {
      var offset = i * 4;
      var value = (Math.random() * 255);
      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = moonNoiseAlpha;
  }

  raster.setImageData(imageData, new Point(0, 0));



  // raster.opacity = 0.1;
  raster.position = new Point(moonX,moonY);

  // var moonGroup = new Group(moonClipper, raster);
  // moonGroup.clipped = true;

  // var subRaster = raster.getSubRaster(new Circle(moonX, moonY, moonRadius));
  // subRaster.position = new Point(moonX,moonY);


  // Use clipMask to create a custom polygon clip mask:
  // var path = new Path.Rectangle(150,150,100,150);
  // path.clipMask = true;


  // islands
  // TODO: this should come in front of the moon
  for (var i=0; i<6; i++) {
    var myCircle = new Path.Circle(new Point(Math.random() * 700, Math.random() * 300 + horizonHeight), Math.random() * 20 + 40);
    myCircle.strokeColor = 'green';
    // myCircle.selected = true;
    myCircle.fillColor = 'green';

    myCircle.removeSegment(3);
  }



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
