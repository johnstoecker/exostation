import { Color, Path, Point } from 'paper';

function createStars(worldData) {
  let starColor = new Color(0.6);
  for (let i=0; i<20; i++) {
    let starSize = Math.floor(Math.random() * 2 + 1);
    let starPosition = new Point(Math.random() * worldData.width, Math.random() * worldData.horizonHeight);
    if (starPosition.getDistance(worldData.moon.position) < worldData.moon.radius + 30
      || starPosition.y > worldData.horizonHeight - 15) {
      continue;
    }
    let myCircle = new Path.Circle(starPosition, starSize);
    myCircle.strokeColor = starColor;
    myCircle.fillColor = starColor;
    deformStar(starPosition, starSize);
  }
}

// deform star horizontal lines
function deformStar(starPosition, starSize) {
  let starDeformColor = new Color(0.6, 0.5);
  // how much line glitch the stars have
  let deformityScaling = 1.5;
  let center = starSize/2;
  for (let i=0; i< starSize; i++) {
    let yOffset = 2 + Math.random() * (starSize*2-2);
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


export default {
  createStars: createStars
}
