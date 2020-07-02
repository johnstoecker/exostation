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

  worldData.width = 700;
  worldData.topLeft = new Point(view.bounds.x,view.bounds.y)
  worldData.bottomRight = new Point(view.bounds.width, view.bounds.height)
  worldData.horizonHeight = 500;
  worldData.bottomLeftHorizon = new Point(0, worldData.horizonHeight)
  worldData.bottomRightHorizon = new Point(view.bounds.width, worldData.horizonHeight);

  let skyContainer = Sky.createSky(worldData);
  worldData.moon = skyContainer.moon;
  worldData.sky = skyContainer.sky;
  worldData.stars = skyContainer.stars;
  createSea();
  Island.createIslands(worldData);
  worldData.boat = Boat.createBoat(worldData);

  view.onFrame = onFrame;

  view.draw();
}

function onFrame(event) {
  // every 10th frame, move the boat
  if(event.count % 3 == 0) {
    worldData.boat.translate(new Point(0.3,0))
  }
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

export default {
  worldData: worldData,
  createWorld: createWorld
}
