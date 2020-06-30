import { Group,Path,Point,Raster,Size,view,paper } from 'paper';

var worldData = {};

function createWorld() {

  paper.setup('planet-canvas');

  worldData.topLeft = new Point(view.bounds.x,view.bounds.y)
  worldData.bottomRight = new Point(view.bounds.width, view.bounds.height)
  worldData.horizonHeight = 500;
  worldData.bottomLeftHorizon = new Point(0, worldData.horizonHeight)
  worldData.bottomRightHorizon = new Point(view.bounds.width, worldData.horizonHeight);

  createSky();
  createSea();
  createStars();
  createMoon();
  createIslands();
}

function createSky() {
  var sky = new Path.Rectangle({
      topLeft: worldData.topLeft,
      bottomRight: worldData.bottomRightHorizon,
      // Fill the path with a gradient of three color stops
      // that runs between the two points we defined earlier:
      fillColor: {
          gradient: {
              stops: ['lightred', 'red']
          },
          origin: new Point(view.bounds.width/2, 0),
          destination: new Point(view.bounds.width/2, worldData.horizonHeight)
      }
  });
}

function createSea() {
  var sea = new Path.Rectangle({
      topLeft: worldData.bottomLeftHorizon,
      bottomRight: worldData.bottomRight,
      // Fill the path with a gradient of three color stops
      // that runs between the two points we defined earlier:
      fillColor: {
          gradient: {
              stops: ['lightblue', 'blue']
          },
          origin: new Point(view.bounds.width/2, worldData.horizonHeight),
          destination: new Point(view.bounds.width/2, view.bounds.height)
      }
  });
}

function createStars() {
  var starColor = 'white';
  for (var i=0; i<20; i++) {
    var starSize = Math.floor(Math.random() * 5 + 2);
    var starPosition = new Point(Math.random() * 700, Math.random() * worldData.horizonHeight);
    var myCircle = new Path.Circle(starPosition, starSize);
    myCircle.strokeColor = starColor;
    myCircle.fillColor = starColor;
    deformStar(starPosition, starSize);
  }
}

// deform star horizontal lines
function deformStar(starPosition, starSize) {
  var starDeformColor = 'white';
  // how much line glitch the stars have
  var deformityScaling = 1.5;
  var center = starSize/2;
  for (var i=0; i< starSize; i++) {
    var yOffset = 2 + Math.random() * (starSize*2-2);
    // make the stars have a cool effect where the deform lines are thicker in the center
    var xScaleFromYOffset = yOffset;
    if (xScaleFromYOffset > starSize) {
      xScaleFromYOffset = starSize*2 - xScaleFromYOffset
    }
    var sourceY = starPosition.y - starSize + yOffset;
    var sourceX = starPosition.x - starSize - xScaleFromYOffset *deformityScaling + Math.random() * starSize;
    var targetX = starPosition.x + Math.random() * (starSize + xScaleFromYOffset*deformityScaling);
    var myDeformPath = new Path.Line(new Point(sourceX, sourceY), new Point(targetX, sourceY));
    myDeformPath.strokeColor = starDeformColor;
  }
}

function deformStarArc(starPosition, starSize) {
  var starDeformColor = 'blue';
  // how big the ring is
  var deformityScaling = 1;
  var center = starSize/2;
  var yOffset = center - Math.random()

  var yOffset = 2 + Math.random() * (starSize*2-2);
  var xScaleFromYOffset = center;
  if (xScaleFromYOffset > starSize) {
    xScaleFromYOffset = starSize*2 - xScaleFromYOffset
  }
  var sourceY = starPosition.y - starSize + yOffset;
  var sourceX = starPosition.x - starSize - xScaleFromYOffset *deformityScaling + Math.random() * starSize;
  var targetX = starPosition.x + Math.random() * (starSize + xScaleFromYOffset*deformityScaling);
  var myDeformPath = new Path.Line(new Point(sourceX, sourceY), new Point(targetX, sourceY));
  myDeformPath.strokeColor = starDeformColor;
}

//TODO: deform star with Path.arc that makes rings

function createStars2() {
  // stars
  for (var i=0; i<20; i++) {
    var starSize = 3//Math.floor(Math.random() * 5 + 2);
    var starPosition = new Point(Math.random() * 700, Math.random() * worldData.horizonHeight);
    // var myCircle = new Path.Circle(, );
    // myCircle.strokeColor = 'white';
    // myCircle.fillColor = 'white';
    var raster = new Raster(new Size(starSize, starSize));
    var imageData = raster.createImageData(new Size(starSize, starSize));
    for (var j=0; j< starSize * starSize; j++) {
      var value = 255;
      var x = j % starSize;
      var y = Math.floor(j / starSize);
      var center = (starSize) / 2
      var radius = (starSize) / 2
      console.log(x.toString() + " " + y.toString())
      console.log(center)
      console.log(radius)
      if (Math.abs(x - center) * Math.abs(x - center) + Math.abs(y - center) * Math.abs(y - center) < radius * radius) {
        console.log('no');
        value = 255;
        // fudge a little bit on the edges so its not perfectly round
      } else if (Math.abs(x - center) * Math.abs(x - center) + Math.abs(y - center) * Math.abs(y - center) < radius * radius + 1 && Math.random() < 0.4) {
        console.log('yes')
        value= 0//255;
      } else {
        console.log('yes')
        value = 0;
      }
      var offset = j*4;
      imageData.data[offset] = value;
      imageData.data[offset + 1] = value;
      imageData.data[offset + 2] = value;
      imageData.data[offset + 3] = value;
    }
    raster.setImageData(imageData, new Point(0,0));
    raster.position = starPosition
  }
}

function createMoon() {
  var moonX = Math.random() * 15 + view.bounds.width/2 - 8;
  var moonY = Math.random() * 15 + worldData.horizonHeight - 80;
  var moonRadius = Math.random() * 15 + 35;
  var moon = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // moon.strokeColor = 'white';
  moon.fillColor = 'white';



  var moonClipper = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // var moonClipper = new Path.Rectangle(new Point(moonX, moonY), 30, 30)
  // var url = './noise-99.png';
  // var raster = new Raster(url);
  console.log(moonRadius);
  var rasterSizeX = Math.round(moonRadius*2);
  var rasterSizeY = Math.round(moonRadius*2);
  var raster = new Raster(new Size(rasterSizeX, rasterSizeY));
  raster.setSize(new Size(rasterSizeX, rasterSizeY));
  var imageData = raster.createImageData(new Size(rasterSizeX, rasterSizeY));

  var moonNoiseAlpha = 35;
  // just noise
  for(var i = 0; i < rasterSizeX * rasterSizeY; i++) {
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
  raster.opacity = 1;

  // var moonSpots = []
  // for (var i=0; i<8; i++) {
  //   moonSpots.push(createMoonSpot(moonX, moonY, moonRadius));
  // }

  var moonGroup = new Group();
  moonGroup.addChild(raster);
  for (var i=0; i < 6; i++) {
    moonGroup.addChild(createMoonSpot(moonX, moonY, moonRadius));
  }
  moonGroup.insertChild(0, moonClipper);

  moonGroup.clipped = true;
}


function createMoonSpot(moonX, moonY, moonRadius) {
  var moonSpotX = Math.random() * moonRadius * 2 + moonX - moonRadius;
  var moonSpotY = Math.random() * moonRadius * 2 + moonY - moonRadius;
  var moonSpotRadius = Math.random() * moonRadius / 5;
  var moonSpot = new Path.Circle(new Point(moonSpotX, moonSpotY), moonSpotRadius);
  moonSpot.fillColor = 'white';
  return moonSpot;
}

function createIslands() {
  // islands
  // TODO: this should come in front of the moon
  for (var i=0; i<6; i++) {
    var myCircle = new Path.Circle(new Point(Math.random() * 700, Math.random() * 300 + worldData.horizonHeight), Math.random() * 20 + 40);
    myCircle.strokeColor = 'green';
    // myCircle.selected = true;
    myCircle.fillColor = 'green';

    myCircle.removeSegment(3);
  }
}



export default {
  worldData: worldData,
  createWorld: createWorld
}
