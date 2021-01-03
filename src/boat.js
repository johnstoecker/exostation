import { Color, Group, Path, Point } from 'paper';

function createBoat(worldData) {
  let boatPosition = new Point(Math.random() * 20 + 340, Math.random() * 20 + worldData.horizonHeight + 40);
  let boat = new Group();
  boat.addChild(createHull(boatPosition));
  boat.addChild(createSails(boatPosition));
  boat.addChild(createWaves(boatPosition));
  return boat;
}

function createSails(boatPosition) {
  let sails = new Path();
  sails.add(new Point(boatPosition.x-1, boatPosition.y - 5));
  sails.add(new Point(boatPosition.x+1, boatPosition.y+6));
  sails.add(new Point(boatPosition.x+6, boatPosition.y + 6));
  sails.add(new Point(boatPosition.x, boatPosition.y - 5));
  sails.add(new Point(boatPosition.x-6, boatPosition.y+6));
  sails.add(new Point(boatPosition.x-3, boatPosition.y+6));
  sails.add(new Point(boatPosition.x-1, boatPosition.y - 5));
  sails.strokeColor = 'red';
  sails.strokeWidth = 0.5;
  sails.fillColor = 'white';
  return sails;
}

function createHull(boatPosition) {
  let hull = new Path();
  let hullLowerLeft = new Point(boatPosition.x - 4, boatPosition.y + 10);
  hull.add(hullLowerLeft);
  hull.add(new Point(hullLowerLeft.x + 8, hullLowerLeft.y));
  hull.add(new Point(hullLowerLeft.x + 12, hullLowerLeft.y-3));
  hull.add(new Point(hullLowerLeft.x - 4, hullLowerLeft.y-3));
  hull.add(new Point(hullLowerLeft));
  hull.strokeColor = 'brown';
  hull.strokeWidth = 0.5;
  hull.fillColor = 'lightbrown';
  return hull;
}

function createWaves(boatPosition) {
  let waves = new Group();
  let wavesLeft = new Path();
  wavesLeft.add(new Point(boatPosition.x - 6, boatPosition.y + 10));
  wavesLeft.add(new Point(boatPosition.x - 5, boatPosition.y + 11));
  wavesLeft.add(new Point(boatPosition.x - 3, boatPosition.y + 11));
  wavesLeft.smooth();
  wavesLeft.strokeColor = new Color('white');
  wavesLeft.strokeWidth = 0.5;

  let wavesRight = new Path();
  wavesRight.add(new Point(boatPosition.x + 6, boatPosition.y + 10));
  wavesRight.add(new Point(boatPosition.x + 5, boatPosition.y + 11));
  wavesRight.add(new Point(boatPosition.x + 3, boatPosition.y + 11));
  wavesRight.smooth();
  wavesRight.strokeColor = new Color('white');
  wavesRight.strokeWidth = 0.5;

  waves.addChild(wavesLeft);
  waves.addChild(wavesRight);
  waves.opacity = 0;
  return waves;
}

function removeWaves() {

}

export default {
  createBoat: createBoat
}
