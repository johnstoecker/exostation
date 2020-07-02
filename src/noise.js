// Fun Noise Generators!!!
import { Color, Raster, Size, Point } from 'paper';

import SimplexNoise from 'simplex-noise';
let simplex = new SimplexNoise()



// line noise function
// makes a lines of noise
function createLineNoise(x, y, width, height, alpha) {
  let lininess = 13;
  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let prevRandom = Math.random() * 255;
  let nextRandom;
  for(let i = 0; i < width * height; i++) {
      let offset = i * 4;
      nextRandom = prevRandom + (Math.random() - 0.5) * lininess;
      let value = Math.max(Math.min(nextRandom, 255), 0);
      prevRandom = nextRandom;
      // dont let it get too far out of bounds
      if (prevRandom < -20){
        prevRandom = -10;
      } else if (prevRandom > 275) {
        prevRandom = 265;
      }


      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = alpha;
  }
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  return raster;
}


function turbulence(x, y, size)
{
  let value = 0.0
  let initialSize = size;

  while(size >= 1)
  {
    value += simplex.noise2D(x/size, y/size)// * size;
    // value += smoothNoise(x / size, y / size) * size;
    size /= 2.0;
  }

  return(128.0 * value / initialSize);
}


function createMarbleNoise(x, y, width, height) {

  //xPeriod and yPeriod together define the angle of the lines
  //xPeriod and yPeriod both 0 ==> it becomes a normal clouds or turbulence pattern
  let xPeriod = 20.0; //defines repetition of marble lines in x direction
  let yPeriod = 20.0; //defines repetition of marble lines in y direction
  //turbPower = 0 ==> it becomes a normal sine pattern
  let turbPower = 20.0; //makes twists
  let turbSize = 32.0; //initial size of the turbulence

  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let alpha = 35;
  let prevRandom = Math.random() * 255;
  let nextRandom;
  // just noise
  let i = 0;
  for (let y=0; y<height; y++) {
    for (let x=0; x< width; x++) {
      let offset = i * 4;

      let xyValue = x * xPeriod / width + y * yPeriod / height + turbPower * turbulence(x, y, turbSize) / 256.0;
      // console.log(xyValue);
      let sineValue = 256 * Math.abs(Math.sin(xyValue * 3.14159));
      //color.r = color.g = color.b = Uint8(sineValue);
      // pset(x, y, color);

      // nextRandom = Math.random() * 255;
      let value = sineValue;
      prevRandom = nextRandom;
      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = alpha;
      i = i+1;
    }
  }
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  return raster;
}


// red noise function
// make white noise reddish by averaging two adjacent random numbers
function createRedNoise(x, y, width, height) {
  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let alpha = 35;
  let prevRandom = Math.random() * 255;
  let nextRandom;
  // just noise
  for(let i = 0; i < width * height; i++) {
      let offset = i * 4;
      nextRandom = Math.random() * 255;
      let value = (prevRandom + nextRandom)/2;
      prevRandom = nextRandom;
      imageData.data[offset]      = value;
      imageData.data[offset + 1]  = value;
      imageData.data[offset + 2]  = value;
      imageData.data[offset + 3]  = alpha;
  }
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  return raster;
}


// returns a mix of the two colors in the ratio given
// ratio = 0, all colorA
// ratio = 1, all colorB
// ratio is not a great word for this
function mixColors(colorA, colorB, ratio) {
  return new Color(colorA.red * (1-ratio) + colorB.red * ratio
  , colorA.green * (1-ratio) + colorB.green * ratio
  , colorA.blue * (1-ratio) + colorB.blue * ratio);
}

// perlin noise function
// make white noise reddish by averaging two adjacent random numbers
function createNoise(x, y, width, height, waviness, alpha) {
  // scale up then down for retina screens
  width = width *2;
  height = height*2;
  //rock colors
  let rockColor0 = new Color(55,55,55);
  let rockColor1 = new Color(155, 195, 25);
  let rockColor2 = new Color(75, 145, 95);
  let rockColor3 = new Color(185, 35, 45);

  waviness = 5;
  // the higher this goes, the more intricate the noise patterns are
  let raster = new Raster(new Size(width, height));
  raster.setSize(new Size(width, height));
  let imageData = raster.createImageData(new Size(width, height));

  let prevRandom = Math.random() * 255;
  let nextRandom;
  // just noise
  let i = 0;
  let negCount = 0;
  let creviceCount = 0;
  let color1Count = 0;
  let color2Count = 0;
  for (let y=0; y<height; y++) {
    for (let x=0; x< width; x++) {
      let offset = i * 4;

      let value2d = simplex.noise2D(x/width*waviness, y/height*waviness)/2 + 0.5

      // All noise functions return values in the range of -1 to 1.
      // var noiseValue = noise.simplex2(x / width*waviness, y / height*waviness);
      // ... or noise.simplex3 and noise.perlin3:
      // var value = noise.simplex3(x / 100, y / 100, time);
      // image[x][y].r = Math.abs(value) * 256;

      // crevice
      let color;
      if(value2d < 0.25) {
        creviceCount+=1;
          color = mixColors(rockColor1, rockColor2, value2d);
      } else if(value2d > 0.25 && value2d <0.5) {
        color1Count+=1;
          color = mixColors(rockColor2, rockColor0,  (value2d-0.25) /0.25 );
      }else{
        color2Count+=1;
          color = mixColors(rockColor0, rockColor3,  (value2d-0.5) /0.5 );
      }


      let value = Math.abs(value2d) * 155;
      prevRandom = nextRandom;
      imageData.data[offset]      = color.red;
      imageData.data[offset + 1]  = color.green;
      imageData.data[offset + 2]  = color.blue;
      imageData.data[offset + 3]  = 255//alpha;

      i += 1;
    }
    // without this there is 1 artifact per row
    i -=1;
  }
  console.log('negs!: '+negCount);
  console.log('crevices: ' + creviceCount);
  console.log('color1s: '+color1Count);
  console.log('color2s: '+color2Count);
  raster.setImageData(imageData, new Point(0, 0));
  raster.position = new Point(x, y);
  raster.opacity = 1;
  raster.scale(0.5);
  return raster;
}

export default {
  createNoise:createNoise,
  createLineNoise: createLineNoise,
  createRedNoise: createRedNoise,
  createMarbleNoise: createMarbleNoise
}
