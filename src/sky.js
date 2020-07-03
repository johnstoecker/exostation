import { Color, Group, Path, Point, Raster, view } from 'paper';
import Star from './stars';
import Noise from './noise';

function createSky(worldData) {
  let skyContainer = {}
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
   skyContainer.moon = createMoon(worldData);

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
  createSky: createSky
}
