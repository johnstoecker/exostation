import { Color, Group,Path,Point,Raster,Size,view,paper } from 'paper';
import Star from './stars';
import Noise from './noise';
import Island from './islands';
import Boat from './boat';
import Sky from './sky';

let worldData = {};

const WIDTH = 700;
//const HEIGHT =

/*
 Planet ideas:
 - sky is totally white

 */



function createWorld() {

  paper.setup('planet-canvas');

  // TODO: phone factor makes this smaller
  worldData.width = 700;
  worldData.height = window.innerHeight;
  worldData.topLeft = new Point(view.bounds.x,view.bounds.y)
  worldData.bottomRight = new Point(view.bounds.width, view.bounds.height)
  worldData.horizonHeight = 500;
  worldData.bottomLeftHorizon = new Point(0, worldData.horizonHeight)
  worldData.bottomRightHorizon = new Point(view.bounds.width, worldData.horizonHeight);


  let skyContainer = Sky.createSky(worldData);
  worldData.moon = skyContainer.moon;
  worldData.sky = skyContainer.sky;
  worldData.stars = skyContainer.stars;
  worldData.sea = createSea(worldData);
  worldData.islands = Island.createIslands(worldData);
  worldData.boat = Boat.createBoat(worldData);

  worldData.sea.onClick = moveBoat;


  view.onFrame = onFrame;

  view.draw();
}

function moveBoat(event) {
  worldData.boatTarget = new Point(event.point.x, event.point.y)
  console.log(worldData.boat.position);
  console.log(worldData.boatTarget);

  worldData.boatAngle = new Point(worldData.boatTarget.x - worldData.boat.position.x, worldData.boatTarget.y - worldData.boat.position.y).getAngleInRadians();
  console.log(worldData.boatAngle);
}

function onFrame(event) {
  let boatSpeed = 0.5;
  // every 10th frame, move the boat
  if(event.count % 3 == 0 && worldData.boatTarget && worldData.boatAngle) {

    // TODO: collision checking with islands
    //dont let the boat sail off the edge
    if ((worldData.boat.position.x < 10 && (worldData.boatAngle > Math.PI/2 || worldData.boatAngle < - Math.PI/2))
      || (worldData.boat.position.x > worldData.width - 10 && (worldData.boatAngle < Math.PI/2 && worldData.boatAngle > -Math.PI/2))
      || (worldData.boat.position.y < worldData.horizonHeight + 10 && worldData.boatAngle < 0)
      || (worldData.boat.position.y > worldData.height - 10 && worldData.boatAngle > 0)) {
      worldData.boatTarget = null;
      worldData.boatAngle = null;
    } else if (worldData.boat.position.isClose(worldData.boatTarget, boatSpeed)) {
      worldData.boat.translate(new Point(worldData.boatTarget.x - worldData.boat.position.x, worldData.boatTarget.y - worldData.boat.position.y))
      worldData.boatTarget = null;
      worldData.boatAngle = null;
    } else {
      worldData.boat.translate(new Point(boatSpeed * Math.cos(worldData.boatAngle), boatSpeed * Math.sin(worldData.boatAngle)))
    }
  }
}

function createSea(worldData) {
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
  let seaNoise = Noise.createLineNoise(boundingBox.center.x, boundingBox.center.y, boundingBox.width, boundingBox.height, 5);
  return seaNoise;
}

export default {
  worldData: worldData,
  createWorld: createWorld
}
