import { Color, Path, Point, view } from 'paper';
import Noise from '../noise';


function createClouds(worldData) {
  //sometimes darkish clouds
  if (Math.random() < 0.3) {
    Noise.createCloudNoise(view.center.x, worldData.horizonHeight - 80, view.bounds.width, 120, worldData.skyColor);
  }
  //sometimes liney clouds
  // if (Math.random() < 0.3) {
  // let numClouds = Math.random() * 10;
  // TODO: get this looking nice
  let numClouds = 0;
  for(var i=0; i< numClouds; i++) {
    let cloud = new Path();
    let cloudPosition = new Point(Math.random()*view.bounds.width,worldData.horizonHeight-300 + Math.random()*200)
    let numCloudPoints = 10;
    let cloudWidth = Math.random()*220+100;
    let cloudHeight = Math.random()*30+10;
    let cloudRoundness = 25;
    let cloudJitter = 10;
    // basic cloud oval shape
    cloud.add(new Point(cloudWidth/2,-Math.random()*cloudJitter));
    cloud.add(new Point(cloudWidth-cloudRoundness-Math.random()*cloudJitter, -Math.random()*cloudJitter));
    cloud.add(new Point(cloudWidth+Math.random()*cloudJitter, cloudHeight/2+Math.random()*cloudJitter/2));
    cloud.add(new Point(cloudWidth-cloudRoundness-Math.random()*cloudJitter, cloudHeight+Math.random()*cloudJitter));
    cloud.add(new Point(cloudWidth/2, cloudHeight+Math.random()*cloudJitter));
    cloud.add(new Point(cloudRoundness+Math.random()*cloudJitter,cloudHeight+Math.random()*cloudJitter));
    cloud.add(new Point(Math.random()*cloudJitter, cloudHeight/2+Math.random()*cloudJitter/2));
    cloud.add(new Point(cloudRoundness+Math.random()*cloudJitter, -Math.random()*cloudJitter));
    // cloud.add(new Point(cloudWidth/2, 0));

    // add a few points to the long part
    // let topCloudComplexity = Math.random() * 3;
    // for(var j=0; j<topCloudComplexity; j++) {
    //   let currentJitter = Math.random() * 10 - 2;
    //   let topCloudPointLocation = (cloudWidth/2)/(topCloudComplexity+1)*(j+1);
    //   console.log(topCloudPointLocation);
    //   cloud.insert(1, new Point(cloudWidth/2 + topCloudPointLocation, currentJitter))
    // }
    //
    cloud.smooth();
    // cloud.fillColor = 'black';
    cloud.fillColor = {
              gradient: {
                  stops: [new Color(worldData.skyColor.red, worldData.skyColor.green, worldData.skyColor.blue,0.05),new Color(worldData.skyColor.red,worldData.skyColor.green,worldData.skyColor.blue,0.5)]
              },
              origin: new Point(cloudPosition.x, cloudPosition.y-cloudHeight/2),
              destination: new Point(cloudPosition.x, cloudPosition.y+cloudHeight/2)
          }

    cloud.position = cloudPosition;
    // cloud.opacity = 0.2;
  }
  // }
}

export default {
  createClouds: createClouds
}
