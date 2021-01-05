import { Color, Group, Path, Point, Raster, view } from 'paper';
import Star from './stars';
import Noise from './noise';

function createPlanet() {
  let planetGroup = new Group();
  let planetSize = 100;
  let planetLocation = new Point(200, 200);
  let planetSeaColor = new Color('darkblue');
  let planetClipper = new Path.Circle(planetLocation, 50);
  let rasterSizeX = planetSize * 2;
  let rasterSizeY = planetSize * 2;
  let raster = Noise.createNebulaNoise(planetLocation.x, planetLocation.y, 300, 300, planetSeaColor);

  // ring Group

  // planetGroup.addChild(planetClipper);
  planetGroup.addChild(raster);
  // planetGroup.clipped = true;
  return planetGroup;
}


export default {
  createPlanet: createPlanet
}
