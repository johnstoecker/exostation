import { Color, Group,Path,Point,Raster,Size,view,paper } from 'paper';
import Noise from './noise';
import Island from './islands';
import Boat from './boat';

let worldData = {};

const WIDTH = 700;
//const HEIGHT =

/*
 Planet ideas:
 - sky is totally white

 */



function createWorld() {

  paper.setup('planet-canvas');

  worldData.width = 700;
  worldData.topLeft = new Point(view.bounds.x,view.bounds.y)
  worldData.bottomRight = new Point(view.bounds.width, view.bounds.height)
  worldData.horizonHeight = 500;
  worldData.bottomLeftHorizon = new Point(0, worldData.horizonHeight)
  worldData.bottomRightHorizon = new Point(view.bounds.width, worldData.horizonHeight);

  createSky();
  createSea();
  worldData.moon = createMoon();
  createStars(worldData);
  Island.createIslands(worldData);
  Boat.createBoat(worldData);
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
   skyGroup.addChild(Noise.createLineNoise(view.center.x, view.center.y, view.bounds.width, view.bounds.height, 5));
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
  let boundingBox = sea.bounds;
  Noise.createLineNoise(boundingBox.center.x, boundingBox.center.y, boundingBox.width, boundingBox.height, 5);
}

function createStars(worldData) {
  let starColor = new Color(0.6);
  for (let i=0; i<20; i++) {
    let starSize = Math.floor(Math.random() * 2 + 1);
    let starPosition = new Point(Math.random() * WIDTH, Math.random() * worldData.horizonHeight);
    if (starPosition.getDistance(worldData.moon.position) < worldData.moon.radius + 30
      || starPosition.y > worldData.horizonHeight - 15) {
      continue;
    }
    let myCircle = new Path.Circle(starPosition, starSize);
    myCircle.strokeColor = starColor;
    myCircle.fillColor = starColor;
    deformStar(starPosition, starSize);
  }
}

// deform star horizontal lines
function deformStar(starPosition, starSize) {
  let starDeformColor = new Color(0.6, 0.5);
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

//TODO: deform star with Path.arc that makes rings
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
  let raster = Noise.createRedNoise(moonX, moonY, rasterSizeX, rasterSizeY);
  // let raster = Noise.createNoise(moonX, moonY, rasterSizeX, rasterSizeY, 1.5, 35);

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
  return moon.toShape();
}


function createMoonSpot(moonX, moonY, moonRadius) {
  let moonSpotX = Math.random() * moonRadius * 2 + moonX - moonRadius;
  let moonSpotY = Math.random() * moonRadius * 2 + moonY - moonRadius;
  let moonSpotRadius = Math.random() * moonRadius / 5;
  let moonSpot = new Path.Circle(new Point(moonSpotX, moonSpotY), moonSpotRadius);
  moonSpot.fillColor = 'white';
  return moonSpot;
}


export default {
  worldData: worldData,
  createWorld: createWorld
}
