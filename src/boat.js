import { Color, Path, Point } from 'paper';

function createBoat(worldData) {
  let boat = {
    x: Math.random() * 20 + 340,
    y: Math.random() * 20 + worldData.horizonHeight + 40
  };
  boat.hull = createHull(boat);
  boat.sails = createSails(boat);
}

function createSails(boat) {
  let sails = new Path();
  sails.add(new Point(boat.x-1, boat.y - 5));
  sails.add(new Point(boat.x+1, boat.y+6));
  sails.add(new Point(boat.x+6, boat.y + 6));
  sails.add(new Point(boat.x, boat.y - 5));
  sails.add(new Point(boat.x-6, boat.y+6));
  sails.add(new Point(boat.x-3, boat.y+6));
  sails.add(new Point(boat.x-1, boat.y - 5));
  sails.strokeColor = 'red';
  sails.strokeWidth = 0.5;
  sails.fillColor = 'white';
  return sails;
}

function createHull(boat) {
  let hull = new Path();
  let hullLowerLeft = new Point(boat.x - 4, boat.y + 10);
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
