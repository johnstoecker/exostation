// #define noiseWidth 320
// #define noiseHeight 240
//
// double noise[noiseHeight][noiseWidth]; //the noise array
//
// void generateNoise();
// double smoothNoise(double x, double y);
// double turbulence(double x, double y, double size);
//
// int main(int argc, char *argv[])
// {
//   screen(noiseWidth, noiseHeight, 0, "Random Noise");
//   generateNoise();
//
//   Uint8 L;
//   ColorRGB color;
//
//   for(int y = 0; y < h; y++)
//   for(int x = 0; x < w; x++)
//   {
//     L = 192 + Uint8(turbulence(x, y, 64)) / 4;
//     color = HSLtoRGB(ColorHSL(169, 255, L));
//
//     pset(x, y, color);
//   }
//
//   redraw();
//   sleep();
//   return 0;
// }
