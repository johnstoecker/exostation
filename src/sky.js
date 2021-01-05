import { Color, Group, Path, Point, Raster, view } from 'paper';
import Star from './stars';
import Noise from './noise';
import Moon from './moon';
import Planet from './planet';

function createSky(worldData) {
  let skyContainer = {}
  let sky = new Path.Rectangle({
      topLeft: worldData.topLeft,
      bottomRight: worldData.bottomRightHorizon
  });
  let skyClipper = sky.clone();
  let skyColor1, skyColor2;
  skyColor1 = new Color('black');
  skyColor2 = new Color(Math.random(), Math.random(), Math.random());
  sky.fillColor = {
            gradient: {
                stops: [skyColor1, skyColor2]
            },
            origin: new Point(view.bounds.width/2, 0),
            destination: new Point(view.bounds.width/2, worldData.horizonHeight)
        }

    // sky.fillColor = 'white';
   let skyGroup = new Group();
   skyGroup.addChild(sky);
   skyContainer.starBursts = new Group();

   skyGroup.insertChild(0, skyClipper);

   skyContainer.sky = sky;

   // if (Math.random() < 0.5) {
     let nebula = Noise.createNebulaNoise(view.center.x, view.center.y-100, view.bounds.width * 1.5, 60, skyColor2);
     nebula.rotate(-30);
   // }

   skyContainer.moon = Moon.createMoon(worldData);
   // skyContainer.planet = Planet.createPlanet();

   skyContainer.stars = Star.createStars(worldData, skyContainer.moon);

   skyGroup.addChild(Noise.createLineNoise(view.center.x, view.center.y, view.bounds.width, view.bounds.height, 5));
   //sometimes clouds
   if (Math.random() < 0.5) {
     Noise.createCloudNoise(view.center.x, worldData.horizonHeight - 80, view.bounds.width, 120, skyColor2);
   }

   let skyClicker = new Path.Rectangle(0, 0, view.bounds.width, worldData.horizonHeight);
   skyClicker.fillColor = 'black';
   skyClicker.opacity = 0;
   skyClicker.onClick = function(event) {
     if (!worldData.moonIsBright) {
       worldData.moonIsBright = true;
       worldData.moon.children[1].fillColor = new Color(0.95);
       for(let i=2; i<worldData.moon.children[2].children.length; i++) {
         worldData.moon.children[2].children[i].fillColor = new Color(0.9);
       }
     }
     skyContainer.starBursts.addChild(Star.createStarBurst(event.point));
   }
   skyClicker.onMouseDrag = function(event) {
     skyContainer.starBursts.addChild(Star.createStarBurst(event.point));
     if (!worldData.moonIsBright) {
       worldData.moonIsBright = true;
       worldData.moon.children[1].fillColor = new Color(0.95);
       for(let i=2; i<worldData.moon.children[2].children.length; i++) {
         worldData.moon.children[2].children[i].fillColor = new Color(0.9);
       }
     }
   }

   let moonClicker = new Path.Circle(new Point(worldData.moonX,worldData.moonY), worldData.moonRadius);
   // moonClicker.opacity = 0;
   moonClicker.opacity = 0;
   moonClicker.fillColor = 'black';
   moonClicker.onClick = function(event) {
     skyContainer.starBursts.remove();
     skyContainer.starBursts = new Group();
     skyContainer.starBursts.insertBelow(skyContainer.moon);

     worldData.moonIsBright = false;
     worldData.moon.children[1].fillColor = 'white';
     for(let i=2; i<worldData.moon.children[2].children.length; i++) {
       worldData.moon.children[2].children[i].fillColor = 'white';
     }
   }
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
