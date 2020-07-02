import { Color, Group, Path, Point } from 'paper';

function createBoat(worldData) {
  let boatPosition = new Point(Math.random() * 20 + 340, Math.random() * 20 + worldData.horizonHeight + 40);
  let boat = new Group();
  boat.addChild(createHull(boatPosition));
  boat.addChild(createSails(boatPosition));
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

export default {
  createBoat: createBoat
}
