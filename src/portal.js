import { Color, Group, Path, Point } from 'paper';

function createPortal(worldData) {
  let portalPosition = new Point(Math.random() * 20 + 340, Math.random() * 8 + worldData.horizonHeight);
  let portalGroup = new Group();
  const portalBounds = new Path.Rectangle(portalPosition.x - 15, portalPosition.y - 15, 30, 22);
  portalBounds.opacity = 0;
  let portal = new Path.Circle(portalPosition, 10).intersect(portalBounds);
  let portalGlow = new Path.Circle(portalPosition, 15).intersect(portalBounds);
  portal.fillColor = 'black';
//
  portalGlow.fillColor = {
          gradient: {
              stops: ['blue', 'blue', 'blue', 'blue', new Color(0,0,1, 0.2)],
              radial: true
          },
          origin: portalPosition,
          destination: new Point(portalPosition.x+15, portalPosition.y)
      }
  portalGroup.addChild(portalGlow);
  portalGroup.addChild(portal);
  return portalGroup;
}

export default {
  createPortal: createPortal
}
