import { Color, Group,Path,Point,Raster,Size,view,paper } from 'paper';

import SimplexNoise from 'simplex-noise';

let worldData = {};

let simplex = new SimplexNoise()

const WIDTH = 700;
//const HEIGHT =

/*
 Planet ideas:
 - sky is totally white

 */



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
  let sky = new Path.Rectangle({
      topLeft: worldData.topLeft,
      bottomRight: worldData.bottomRightHorizon
  });
  let skyClipper = sky.clone();
  sky.fillColor = {
            gradient: {
                stops: ['lightred', 'red']
            },
            origin: new Point(view.bounds.width/2, 0),
            destination: new Point(view.bounds.width/2, worldData.horizonHeight)
        }

   let skyGroup = new Group();
   skyGroup.addChild(createLineNoise(view.center.x, view.center.y, view.bounds.width, view.bounds.height, 5));
   skyGroup.insertChild(0, skyClipper);
}

function createSea() {
  let sea = new Path.Rectangle({
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
  let starColor = 'white';
  for (let i=0; i<20; i++) {
    let starSize = Math.floor(Math.random() * 5 + 2);
    let starPosition = new Point(Math.random() * WIDTH, Math.random() * worldData.horizonHeight);
    let myCircle = new Path.Circle(starPosition, starSize);
    myCircle.strokeColor = starColor;
    myCircle.fillColor = starColor;
    deformStar(starPosition, starSize);
  }
}

// deform star horizontal lines
function deformStar(starPosition, starSize) {
  let starDeformColor = new Color(1, 0.5);
  // how much line glitch the stars have
  let deformityScaling = 1.5;
  let center = starSize/2;
  for (let i=0; i< starSize; i++) {
    let yOffset = 2 + Math.random() * (starSize*2-2);
    // make the stars have a cool effect where the deform lines are thicker in the center
    let xScaleFromYOffset = yOffset;
    if (xScaleFromYOffset > starSize) {
      xScaleFromYOffset = starSize*2 - xScaleFromYOffset
    }
    let sourceY = starPosition.y - starSize + yOffset;
    let sourceX = starPosition.x - starSize - xScaleFromYOffset *deformityScaling + Math.random() * starSize;
    let targetX = starPosition.x + Math.random() * (starSize + xScaleFromYOffset*deformityScaling);
    let myDeformPath = new Path.Line(new Point(sourceX, sourceY), new Point(targetX, sourceY));
    myDeformPath.strokeColor = starDeformColor;
  }
}

function deformStarArc(starPosition, starSize) {
  let starDeformColor = 'blue';
  // how big the ring is
  let deformityScaling = 1;
  let center = starSize/2;
  let yOffset = 2 + Math.random() * (starSize*2-2);
  let xScaleFromYOffset = center;
  if (xScaleFromYOffset > starSize) {
    xScaleFromYOffset = starSize*2 - xScaleFromYOffset
  }
  let sourceY = starPosition.y - starSize + yOffset;
  let sourceX = starPosition.x - starSize - xScaleFromYOffset *deformityScaling + Math.random() * starSize;
  let targetX = starPosition.x + Math.random() * (starSize + xScaleFromYOffset*deformityScaling);
  let myDeformPath = new Path.Line(new Point(sourceX, sourceY), new Point(targetX, sourceY));
  myDeformPath.strokeColor = starDeformColor;
}

//TODO: deform star with Path.arc that makes rings

function createStars2() {
  // stars
  for (let i=0; i<20; i++) {
    let starSize = 3//Math.floor(Math.random() * 5 + 2);
    let starPosition = new Point(Math.random() * WIDTH, Math.random() * worldData.horizonHeight);
    // let myCircle = new Path.Circle(, );
    // myCircle.strokeColor = 'white';
    // myCircle.fillColor = 'white';
    let raster = new Raster(new Size(starSize, starSize));
    let imageData = raster.createImageData(new Size(starSize, starSize));
    for (let j=0; j< starSize * starSize; j++) {
      let value = 255;
      let x = j % starSize;
      let y = Math.floor(j / starSize);
      let center = (starSize) / 2
      let radius = (starSize) / 2
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
      let offset = j*4;
      imageData.data[offset] = value;
      imageData.data[offset + 1] = value;
      imageData.data[offset + 2] = value;
      imageData.data[offset + 3] = value;
    }
    raster.setImageData(imageData, new Point(0,0));
    raster.position = starPosition
  }
}

// line noise function
// makes a lines of noise
function createLineNoise(x, y, width, height, alpha) {
  let lininess = 13;
  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let prevRandom = Math.random() * 255;
  let nextRandom;
  for(let i = 0; i < width * height; i++) {
      let offset = i * 4;
      nextRandom = prevRandom + (Math.random() - 0.5) * lininess;
      let value = Math.max(Math.min(nextRandom, 255), 0);
      prevRandom = nextRandom;
      // dont let it get too far out of bounds
      if (prevRandom < -20){
        prevRandom = -10;
      } else if (prevRandom > 275) {
        prevRandom = 265;
      }


      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = alpha;
  }
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  return raster;
}


// red noise function
// make white noise reddish by averaging two adjacent random numbers
function createRedNoise(x, y, width, height) {
  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let alpha = 35;
  let prevRandom = Math.random() * 255;
  let nextRandom;
  // just noise
  for(let i = 0; i < width * height; i++) {
      let offset = i * 4;
      nextRandom = Math.random() * 255;
      let value = (prevRandom + nextRandom)/2;
      prevRandom = nextRandom;
      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = alpha;
  }
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  return raster;
}

// perlin noise function
// make white noise reddish by averaging two adjacent random numbers
function createNoise(x, y, width, height, waviness, alpha) {
  // the higher this goes, the more intricate the noise patterns are
  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let prevRandom = Math.random() * 255;
  let nextRandom;
  // just noise
  let i = 0;
  for (let y=0; y<height; y++) {
    for (let x=0; x< width; x++) {
      let offset = i * 4;

      let value2d = simplex.noise2D(x/width*waviness, y/height*waviness)

      // All noise functions return values in the range of -1 to 1.
      // var noiseValue = noise.simplex2(x / width*waviness, y / height*waviness);
      // ... or noise.simplex3 and noise.perlin3:
      // var value = noise.simplex3(x / 100, y / 100, time);
      // image[x][y].r = Math.abs(value) * 256; // Or whatever. Open demo.html to see it used with canvas.

      let value = Math.abs(value2d)*2 * 255;
      prevRandom = nextRandom;
      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = alpha;

      i += 1;
    }
  }
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  return raster;
}


function createMoon() {
  let moonX = Math.random() * 15 + view.bounds.width/2 - 8;
  let moonY = Math.random() * 15 + worldData.horizonHeight - 80;
  let moonRadius = Math.random() * 15 + 35;
  let moon = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // moon.strokeColor = 'white';
  moon.fillColor = 'white';



  let moonClipper = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // let moonClipper = new Path.Rectangle(new Point(moonX, moonY), 30, 30)
  // let url = './noise-99.png';
  // let raster = new Raster(url);
  console.log(moonRadius);
  let rasterSizeX = Math.round(moonRadius*2);
  let rasterSizeY = Math.round(moonRadius*2);
  let raster = createRedNoise(moonX, moonY, rasterSizeX, rasterSizeY);
  // let raster = createNoise(moonX, moonY, rasterSizeX, rasterSizeY, 1.5, 35);

  // let moonSpots = []
  // for (let i=0; i<8; i++) {
  //   moonSpots.push(createMoonSpot(moonX, moonY, moonRadius));
  // }

  let moonGroup = new Group();
  moonGroup.addChild(raster);
  for (let i=0; i < 6; i++) {
    moonGroup.addChild(createMoonSpot(moonX, moonY, moonRadius));
  }
  moonGroup.insertChild(0, moonClipper);

  moonGroup.clipped = true;
}


function createMoonSpot(moonX, moonY, moonRadius) {
  let moonSpotX = Math.random() * moonRadius * 2 + moonX - moonRadius;
  let moonSpotY = Math.random() * moonRadius * 2 + moonY - moonRadius;
  let moonSpotRadius = Math.random() * moonRadius / 5;
  let moonSpot = new Path.Circle(new Point(moonSpotX, moonSpotY), moonSpotRadius);
  moonSpot.fillColor = 'white';
  return moonSpot;
}

function createIslands() {
  let islandColor = 'grey';
  let islandRockiness = 5
  //sometimes won't have that many
  let numIslands = 5;
  let islandHeights = [];
  //this is the easiest way of ensuring islands draw with correct z-index. 80/20
  for (let i=0; i<numIslands; i++) {
    islandHeights.push(Math.random() * (window.innerHeight - worldData.horizonHeight) + worldData.horizonHeight);
  }
  islandHeights.sort();
  // islands
  // TODO: this should come in front of the moon
  for (let i=0; i<numIslands; i++) {
    let y = islandHeights[i];
    //islands get darker as they move away from the sun
    let islandColorValue = 0.2 + (1-y/window.innerHeight);
    console.log(islandColorValue);
    // console.log(y);
    let x = Math.random() * WIDTH - 200 + 100;
    let islandWidth = Math.random() * 200 + 200;
    let islandHeight = Math.random() * 100 + 100;
    let islandSegments = Math.floor(Math.random() * 4 + 5);
    // direction to build the island towards
    let direction = 1;

    if (x < WIDTH/2) {
      direction = -1;
    }

    let path = new Path();

    //path.strokeColor = new Color(islandColorValue);
    path.add(new Point(x, y));
    for (let j=1; j<islandSegments; j++){
      let jitter = (Math.random() - 0.5) * islandHeight/islandSegments/4 * islandRockiness;
      let islandSegmentX = x + islandWidth/islandSegments * j * direction;

      let islandSegmentY = y - islandHeight/islandSegments * j;
      if (j > islandSegments/2) {
        islandSegmentY = y - islandHeight/islandSegments * (islandSegments - j);
      }
      //sometimes dont have a peak
      if (islandSegmentY > islandHeight/3 && Math.random() > 0.3) {
        islandSegmentY -= islandHeight/islandSegments;
      }
      if (islandSegmentY + jitter < y) {
        jitter = jitter /4;
      }
      // console.log(islandSegmentX.toString() + " " + islandSegmentY.toString())
      path.add(new Point(islandSegmentX, islandSegmentY + jitter));
    }
    path.add(new Point(x+islandWidth * direction,y));
    path.smooth();

    let pathClipper = path.clone();

    path.fillColor = new Color(islandColorValue);


    let islandNoiseGroup = new Group();
    let boundingBox = pathClipper.bounds;
    islandNoiseGroup.addChild(createNoise(boundingBox.center.x, boundingBox.center.y, boundingBox.width, boundingBox.height, 12, 10));
    islandNoiseGroup.insertChild(0, pathClipper);
    islandNoiseGroup.clipped = true;


    // let myCircle = new Path.Circle(new Point(Math.random() * WIDTH, Math.random() * 300 + worldData.horizonHeight), Math.random() * 20 + 40);
    // myCircle.strokeColor = 'green';
    // // myCircle.selected = true;
    // myCircle.fillColor = 'green';
    //
    // myCircle.removeSegment(3);
  }
}



export default {
  worldData: worldData,
  createWorld: createWorld
}
