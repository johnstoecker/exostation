import { Color, Group, Path, Point, Raster, view } from 'paper';
import Star from './stars';
import Noise from '../noise';

function createPlanet(worldData) {

  let numPlanets = Math.random() * 3;
  let allPlanets = new Group();
  for (var i=0; i<numPlanets; i++) {
    let planetGroup = new Group();
    let planetSize = Math.floor(Math.random() * 80+20);
    let planetLocation = new Point(Math.random()*view.bounds.width,Math.random()*(worldData.horizonHeight-200));
    let planetClipper = new Path.Circle(new Point(planetLocation.x, planetLocation.y), planetSize/2);
    planetGroup.addChild(planetClipper);
    // let planetBaseCircle = new Path.Circle(new Point(planetLocation.x, planetLocation.y), planetSize/2);
    // planetBaseCircle.fillColor = new Color(Math.random(), Math.random(), Math.random());
    // planetGroup.addChild(planetBaseCircle);
    // change main turbulence if planet is bigger or smaller.
    // makes the features seem like they fit
    let groundTurbulence = 32;
    if (planetSize < 50) {
      groundTurbulence = 16;
    }
    let planetGround = Noise.createNebulaNoise(planetLocation.x, planetLocation.y, planetSize, planetSize, new Color(Math.random(), Math.random(), Math.random()), {turbulence: 32});
    planetGroup.addChild(planetGround);
    let skyTurbulence = 64;
    if (planetSize < 50) {
      skyTurbulence = 32;
    }
    Noise.reseedNoise();
    let planetSky = Noise.createNebulaNoise(planetLocation.x, planetLocation.y, planetSize, planetSize, worldData.skyColor, {alphaMask: true, turbulence: skyTurbulence});
    planetGroup.addChild(planetSky);
    planetGroup.clipped = true;
    allPlanets.addChild(planetGroup);
  }

  // ring Group

  return allPlanets;
}


export default {
  createPlanet: createPlanet
}
