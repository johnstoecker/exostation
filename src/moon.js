import { Color, Group, Path, Point, Raster, view } from 'paper';
import Star from './stars';
import Noise from './noise';

function createMoon(worldData) {
  let moonGroup = new Group();
  let moonX = Math.random() * 15 + view.bounds.width/2 - 8;
  let moonY = Math.random() * 15 + worldData.horizonHeight - 80;
  let moonRadius = Math.random() * 15 + 35;
  let moon = new Path.Circle(new Point(moonX, moonY), moonRadius);
  // moon.strokeColor = 'white';
  moon.fillColor = 'white';



  let moonClipper = new Path.Circle(new Point(moonX, moonY), moonRadius);
  let rasterSizeX = Math.round(moonRadius*2);
  let rasterSizeY = Math.round(moonRadius*2);
  let raster = Noise.createRedNoise(moonX, moonY, rasterSizeX, rasterSizeY);
  // let raster = Noise.createNoise(moonX, moonY, rasterSizeX, rasterSizeY, 1.5, 35);

  // let moonSpots = []
  // for (let i=0; i<8; i++) {
  //   moonSpots.push(createMoonSpot(moonX, moonY, moonRadius));
  // }

  let moonNoiseGroup = new Group();
  moonNoiseGroup.addChild(raster);
  for (let i=0; i < 6; i++) {
    let moonSpot = createMoonSpot(moonX, moonY, moonRadius);
    moonNoiseGroup.addChild(moonSpot);
    moonNoiseGroup.addChild(Noise.createCircleNoise(moonSpot.position.x, moonSpot.position.y, moonSpot.toShape().radius))
  }
  moonNoiseGroup.insertChild(0, moonClipper);
  moonNoiseGroup.clipped = true;
  moonGroup.addChild(moon);
  moonGroup.addChild(moonNoiseGroup);

  return moonGroup;
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
  createMoon: createMoon
}
