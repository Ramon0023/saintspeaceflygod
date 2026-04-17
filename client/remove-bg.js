/* global require */
const Jimp = require('jimp');

async function removeBackground() {
  try {
    console.log("Reading logo.png...");
    const image = await Jimp.read('public/logo.png');
    
    // Replace near-white pixels with transparent and invert darker pixels to white
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is light (bg), make it transparent
      if (red > 220 && green > 220 && blue > 220) {
        this.bitmap.data[idx + 3] = 0; // alpha = 0
      } 
      // Else if it's the logo (dark), invert it to make it white out of courtesy
      else if (this.bitmap.data[idx + 3] !== 0) {
        // Just make the logo solid white so it looks nice on dark theme
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
      }
    });

    await image.writeAsync('public/logo.png');
    console.log('Background removed and logo colored to white successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

removeBackground();
