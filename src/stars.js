import { Color, Path, Point } from 'paper';

function createStars(worldData, moonGroup) {
  let moon = moonGroup.children[0].toShape();
  for (let i=0; i<20; i++) {
    let { starColor, starSize } = getStarColorAndSize();
    let starPosition = new Point(Math.random() * worldData.width, Math.random() * worldData.horizonHeight);
    if (starPosition.getDistance(moon.position) < moon.radius + 30
      || starPosition.y > worldData.horizonHeight - 15) {
      continue;
    }
    let myCircle = new Path.Circle(starPosition, starSize);
    myCircle.strokeColor = starColor;
    myCircle.fillColor = starColor;
    deformStar(starPosition, starSize,  starColor);
  }
}

// generate a star color
function getStarColorAndSize() {
  let starColor;
  let starSize = Math.random();
  const mainColorRandomizer = Math.random();
  // white
  if (mainColorRandomizer < 0.6) {
    starColor = new Color(0.7 + Math.random()/5);
    starSize = Math.floor(Math.random() * 2 + 1);
  // red
  } else if(mainColorRandomizer < 0.75) {
    starColor =  new Color(0.6, 0.1, 0.25);
    //blue
  } else if (mainColorRandomizer < 0.9) {
    starColor = new Color(0.1, 0.25, 1);
  //green
  } else {
    starColor = new Color(0.25, 1, 0.1);
  }
  return { starSize: starSize, starColor: starColor }
}

// deform star horizontal lines
function deformStar(starPosition, starSize, starColor) {
  let starDeformColor = new Color(starColor.red, starColor.green, starColor.blue, 0.5);
  // how much line glitch the stars have
  let deformityScaling = 1.5;
  let center = starSize/2;
  for (let i=0; i< starSize; i++) {
    let yOffset = starSize + Math.random() * (starSize*2-2);
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

function createStarBurst(position) {
  let starBurstSize = 3;
  let starBurst = new Path();
  starBurst.add(new Point(position.x+starBurstSize, position.y));
  starBurst.add(new Point(position.x+starBurstSize/4, position.y-starBurstSize/4));
  starBurst.add(new Point(position.x, position.y-starBurstSize));
  starBurst.add(new Point(position.x-starBurstSize/4, position.y-starBurstSize/4));
  starBurst.add(new Point(position.x-starBurstSize, position.y));
  starBurst.add(new Point(position.x-starBurstSize/4, position.y+starBurstSize/4));
  starBurst.add(new Point(position.x, position.y+starBurstSize));
  starBurst.add(new Point(position.x+starBurstSize/4, position.y+starBurstSize/4));
  starBurst.smooth();
  starBurst.fillColor = 'yellow';
  return starBurst;
}


export default {
  createStars: createStars,
  createStarBurst: createStarBurst
}
