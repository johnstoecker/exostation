import { Color, Group, Path, Point, Raster, view } from 'paper';
import Star from './stars';
import Noise from './noise';
import Moon from './moon';

function createSky(worldData) {
  let skyContainer = {}
  let sky = new Path.Rectangle({
      topLeft: worldData.topLeft,
      bottomRight: worldData.bottomRightHorizon
  });
  let skyClipper = sky.clone();
  let skyTypeRandomizer = Math.random();
  let skyColor1, skyColor2;
  skyColor1 = new Color('black');
  skyColor2 = new Color(Math.random(), Math.random(), Math.random());
  // if (skyTypeRandomizer < 0.3) {
  //   skyColor1 = new Color('black');
  //   skyColor2 = new Color('red');
  // } else if(skyTypeRandomizer < 0.6) {
  //   skyColor1 = new Color('black');
  //   skyColor2 = new Color('blue');
  // } else {
  //   skyColor1 = new Color('black');
  //   skyColor2 = new Color('green');
  // }
  sky.fillColor = {
            gradient: {
                stops: [skyColor1, skyColor2]
            },
            origin: new Point(view.bounds.width/2, 0),
            destination: new Point(view.bounds.width/2, worldData.horizonHeight)
        }

   let skyGroup = new Group();
   skyContainer.starBursts = [];
   skyGroup.addChild(Noise.createLineNoise(view.center.x, view.center.y, view.bounds.width, view.bounds.height, 5));
   skyGroup.insertChild(0, skyClipper);
   skyGroup.onClick = function(event) {
     if (!worldData.moonIsBright) {
       worldData.moonIsBright = true;
       worldData.moon.children[1].fillColor = new Color(0.95);
       for(let i=2; i<worldData.moon.children[2].children.length; i++) {
         worldData.moon.children[2].children[i].fillColor = new Color(0.9);
       }
     }
     skyContainer.starBursts.push(Star.createStarBurst(event.point));
   }
   skyGroup.onMouseDrag = function(event) {
     skyContainer.starBursts.push(Star.createStarBurst(event.point));
     if (!worldData.moonIsBright) {
       worldData.moonIsBright = true;
       worldData.moon.children[1].fillColor = new Color(0.95);
       for(let i=2; i<worldData.moon.children[2].children.length; i++) {
         worldData.moon.children[2].children[i].fillColor = new Color(0.9);
       }
     }
   }

   skyContainer.sky = sky;
   skyContainer.moon = Moon.createMoon(worldData);

   skyContainer.moon.onClick = function(event) {
     for (let i=0; i<skyContainer.starBursts.length; i++) {
       skyContainer.starBursts[i].remove();
     }

     worldData.moonIsBright = false;
     worldData.moon.children[1].fillColor = 'white';
     for(let i=2; i<worldData.moon.children[2].children.length; i++) {
       worldData.moon.children[2].children[i].fillColor = 'white';
     }
   }
   skyContainer.stars = Star.createStars(worldData, skyContainer.moon);

   return skyContainer;
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

export default {
  createSky: createSky
}
