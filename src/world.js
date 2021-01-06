import { Color, Group,Path,Point,Raster,Size,view,paper,project } from 'paper';
import Star from './atmosphere/stars';
import Noise from './noise';
import Island from './surface/islands';
import Boat from './surface/boat';
import Sky from './atmosphere/sky';
import Portal from './surface/portal';

let worldData = {};
window.worldData = worldData;
const MAX_WIDTH = 700;

//const HEIGHT =

/*
 Planet ideas:
 - sky is totally white
 - multiple moons
 - nebulae

 */


function setupCanvas() {
  paper.setup('planet-canvas');

  // TODO: phone factor makes this smaller
  console.log(window.innerWidth);
  if (window.innerWidth < 1024) {
    worldData.width = window.innerWidth;
  } else {
    worldData.width = 700;
  }
  worldData.height = window.innerHeight;
  worldData.topLeft = new Point(view.bounds.x,view.bounds.y)
  worldData.bottomRight = new Point(view.bounds.width, view.bounds.height)
  worldData.horizonHeight = 500;
  worldData.bottomLeftHorizon = new Point(0, worldData.horizonHeight)
  worldData.bottomRightHorizon = new Point(view.bounds.width, worldData.horizonHeight);
  view.draw();
}

function createWorld() {
  Noise.reseedNoise();
  let skyContainer = Sky.createSky(worldData);
  worldData.moon = skyContainer.moon;
  worldData.sky = skyContainer.sky;
  worldData.stars = skyContainer.stars;
  worldData.sea = createSea(worldData);
  worldData.portal = Portal.createPortal(worldData);
  worldData.islandsContainer = Island.createIslands(worldData);
  worldData.boat = Boat.createBoat(worldData);

  worldData.sea.onClick = moveBoat;
  worldData.portal.onClick = moveBoat;
  setTimeout(() => {view.onFrame = onFrame;}, 200);

}

function destroyWorld() {
  view.onFrame = null;
  project.activeLayer.clear();
  let x = new Path.Rectangle(0, 0, view.bounds.width, view.bounds.height);
  x.fillColor = 'lightgrey';
}

function moveBoat(event) {
  worldData.boat.getChildren()[2].opacity = 100;
  worldData.boatTarget = new Point(event.point.x, event.point.y)
  console.log(worldData.boat.position);
  console.log(worldData.boatTarget);

  worldData.boatAngle = new Point(worldData.boatTarget.x - worldData.boat.position.x, worldData.boatTarget.y - worldData.boat.position.y).getAngleInRadians();
  console.log(worldData.boatAngle);
}

function stopBoat() {
  worldData.boatTarget = null;
  worldData.boatAngle = null;
  if (worldData.boat && worldData.boat.getChildren().length > 2) {
    worldData.boat.getChildren()[2].opacity = 0;
  }
}

function onFrame(event) {
  if (!(worldData.boat || worldData.boat.getChildren() < 3)) {
    return;
  }
  let boatSpeed = 5;

  if(worldData.boat.intersects(worldData.portal.getChildren()[1]) && (worldData.boat.position.y - worldData.portal.position.y < 4)) {
    stopBoat();
    worldData.boat.removeChildren();
    setTimeout(destroyWorld, 200);
    setTimeout(createWorld, 400);
  }

  if(event.count % 3 == 0 && worldData.boatTarget && worldData.boatAngle) {

    //dont let the boat sail off the edge
    if ((worldData.boat.position.x < 10 && (worldData.boatAngle > Math.PI/2 || worldData.boatAngle < - Math.PI/2))
      || (worldData.boat.position.x > worldData.width - 10 && (worldData.boatAngle < Math.PI/2 && worldData.boatAngle > -Math.PI/2))
      || (worldData.boat.position.y < worldData.horizonHeight + 5 && worldData.boatAngle < 0)
      || (worldData.boat.position.y > worldData.height - 10 && worldData.boatAngle > 0)) {
        stopBoat();
    } else if (worldData.boat.position.isClose(worldData.boatTarget, boatSpeed)) {
      worldData.boat.translate(new Point(worldData.boatTarget.x - worldData.boat.position.x, worldData.boatTarget.y - worldData.boat.position.y))
      stopBoat();
    } else {
      let canMove = true;
      let iPosDebug = 0;
      let xDelta = boatSpeed * Math.cos(worldData.boatAngle);
      let yDelta = boatSpeed * Math.sin(worldData.boatAngle);
      worldData.boat.translate(new Point(xDelta, yDelta))
      for(let i=0; i<worldData.islandsContainer.length; i++) {
        if(worldData.boat.children[0].intersects(worldData.islandsContainer[i].path)
          || (worldData.islandsContainer[i].path.contains(worldData.boat.children[0].bounds.bottomLeft))
          || (worldData.islandsContainer[i].path.contains(worldData.boat.children[0].bounds.bottomRight))) {
          if(worldData.boat.children[0].bounds.bottomLeft.y > worldData.islandsContainer[i].y) {
            canMove = false;
          }
        }
      }
      //dont let the boat pass through an island
      //naive implementation -- just move it backward
      if (!canMove) {
        worldData.boat.translate(new Point(-xDelta, -yDelta));
        stopBoat();
      }

    }
    updateBoatZIndex();
  }
}

function updateBoatZIndex() {
  for (let i=worldData.islandsContainer.length-1; i>=0; i--) {
    if (worldData.boat.bounds.bottomLeft.y <=worldData.islandsContainer[i].y ){
      worldData.boat.insertBelow(worldData.islandsContainer[i].path);
    } else {
      worldData.boat.insertAbove(worldData.islandsContainer[i].path);
      break;
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
  setupCanvas: setupCanvas,
  createWorld: createWorld
}
