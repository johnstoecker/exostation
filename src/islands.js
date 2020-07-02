import { Color, Group, Path, Point } from 'paper';
import Noise from './noise';


function createIslands(worldData) {
  let islandColor = 'grey';
  let islandRockiness = 5
  //sometimes won't have that many if they generate too close
  let numIslands = 5;
  let tempIslandYs = [];
  //this is the easiest way of ensuring islands draw with correct z-index. 80/20
  for (let i=0; i<numIslands; i++) {
    tempIslandYs.push(Math.random() * (window.innerHeight - worldData.horizonHeight) + worldData.horizonHeight);
  }
  tempIslandYs.sort();
  // take out ones that are too close
  let prevY = tempIslandYs[0];
  let prevX = Math.random() * worldData.width - 200 + 100
  let islandCoords = [[prevX, prevY]];
  for (let i=1; i<tempIslandYs.length; i++) {
    let islandX = Math.random() * worldData.width - 200 + 100;
    if (tempIslandYs[i] - prevY < 15 && Math.abs(islandX - prevX) < 200) {
      numIslands -= 1;
    } else {
      islandCoords.push([islandX, tempIslandYs[i]])
      prevY = tempIslandYs[i];
      prevX = islandX
    }
  }
  // islands
  // TODO: this should come in front of the moon
  for (let i=0; i<numIslands; i++) {
    let x = islandCoords[i][0];
    let y = islandCoords[i][1];
    //islands get darker as they move away from the sun
    let islandColorValue = 0.2 + (1-y/window.innerHeight);
    // console.log(y);
    let islandWidth = Math.random() * 200 + 200;
    let islandHeight = Math.random() * 100 + 100;
    let islandSegments = Math.floor(Math.random() * 4 + 5);
    // direction to build the island towards
    let direction = 1;

    if (x < worldData.width/2) {
      direction = -1;
    }

    let path = new Path();

    //path.strokeColor = new Color(islandColorValue);
    path.add(new Point(x, y));
    for (let j=1; j<islandSegments; j++){
      let jitter = (Math.random() - 0.5) * islandHeight/islandSegments/4 * islandRockiness;
      // the x coordinate of the current curve segment point
      let islandSegmentX = x + islandWidth/islandSegments * j * direction;
      // y coordinate of the current curve segment point -- could be a local maximum, or curve inflection point
      let islandSegmentY = y - islandHeight/islandSegments * j;
      if (j > islandSegments/2) {
        islandSegmentY = y - islandHeight/islandSegments * (islandSegments - j);
      }
      let jitteredSegmentY = islandSegmentY;
      //sometimes dont have a peak
      if (jitteredSegmentY > islandHeight/3 && Math.random() > 0.3) {
        jitteredSegmentY -= islandHeight/islandSegments;
      }
      if (jitteredSegmentY + jitter < y) {
        jitter = jitter /4;
      }
      jitteredSegmentY = jitteredSegmentY + jitter;
      // jitter more than 0 means we have a peak
      // console.log(islandSegmentX.toString() + " " + islandSegmentY.toString())
      path.add(new Point(islandSegmentX, jitteredSegmentY));
    }

    let pathsDown = []
    //console.log(path.segments.length);
    for (let j=1; j<path.segments.length-1; j++) {
      let point = path.segments[j].point;
      // on local maxima, draw a path down to simulate a ridge
      if(point.y < path.segments[j-1].point.y && point.y < path.segments[j+1].point.y) {
        pathsDown.push(drawPathDown(point.x, point.y, y, islandColorValue, worldData.width/2));
      }
      // pathPoints
    }


    path.add(new Point(x+islandWidth * direction,y));

    //build the foothills
    for (let j=pathsDown.length-1; j>=0;j--) {
      path.add(pathsDown[j].segments[pathsDown[j].segments.length - 1].point)
    }
    path.add(new Point(x, y));

    path.smooth();

    let pathClipper = path.clone();

    path.fillColor = new Color(islandColorValue);
    path.strokeColor = new Color(islandColorValue + 0.1);
    path.strokeWidth = 2;

    let islandNoiseGroup = new Group();

    for (let j=0; j<pathsDown.length; j++) {
      let pathDownNoiseGroup = new Group();
      let pathDownClipper = pathsDown[j].clone();
      pathDownClipper.add(new Point(x, y+20));
      pathDownClipper.add(new Point(x, y - islandHeight+20));
      let pathDownBounder = pathDownClipper.bounds;
      console.log(pathDownBounder.center.x);
      pathDownNoiseGroup.addChild(Noise.createMarbleNoise(pathDownBounder.center.x, pathDownBounder.center.y, pathDownBounder.width, pathDownBounder.height));
      pathDownNoiseGroup.insertChild(0, pathDownClipper);
      pathDownNoiseGroup.clipped = true;
      islandNoiseGroup.addChild(pathDownNoiseGroup);
    }


    let boundingBox = pathClipper.bounds;
    islandNoiseGroup.addChild(Noise.createRedNoise(boundingBox.center.x, boundingBox.center.y, boundingBox.width, boundingBox.height))
    // islandNoiseGroup.addChild(Noise.createNoise(boundingBox.center.x, boundingBox.center.y, boundingBox.width, boundingBox.height, 12, 10));
    // islandNoiseGroup.addChild(Noise.createMarbleNoise(boundingBox.center.x, boundingBox.center.y, boundingBox.width, boundingBox.height));
    islandNoiseGroup.insertChild(0, pathClipper);
    islandNoiseGroup.clipped = true;


    // bumpy islands
    // let myCircle = new Path.Circle(new Point(Math.random() * WIDTH, Math.random() * 300 + worldData.horizonHeight), Math.random() * 20 + 40);
    // myCircle.strokeColor = 'green';
    // // myCircle.selected = true;
    // myCircle.fillColor = 'green';
    //
    // myCircle.removeSegment(3);
  }
}

function drawPathDown(x, y, targetY, islandColorValue, lightSourceX) {
  let pathSimplicity = 20;
  let pathWaviness = 15;
  //path in general trends this much
  let pathTrend = 5;
  let pathDirection = (x > lightSourceX ? 1 : -1)
  let pathSegments = Math.floor((targetY-y)/pathSimplicity + Math.random()*3);

  let pathSegmentHeight = (targetY - y)/pathSegments;
  let path = new Path();

  let currentY = y;
  let currentX = x;
  path.add(new Point(currentX, currentY));
  for(let i=0; i< pathSegments + 1; i++) {
    currentY += pathSegmentHeight;
    // dont let the first one get too out of bounds
    if (i==0) {
      pathWaviness = 5;
    }
    currentX = x+(pathTrend*i*pathDirection) + (Math.random()-1)*pathWaviness;//+= Math.random() * pathWaviness * pathDirection;
    path.add(new Point(currentX, currentY));
  }
  // add a foot of the island
  path.smooth();
  path.strokeColor = new Color(islandColorValue + 0.1);
  path.strokeWidth = 2;
  return path;
}

export default {
  createIslands: createIslands
}
