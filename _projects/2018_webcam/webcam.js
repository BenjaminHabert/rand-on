let buffer;
let spots = [];

function setup() {
  let canvas = createCanvas(640, 480)
  canvas.parent('p5sketch');
  colorMode(HSB);
  ellipseMode(CENTER)

  frameRate(20)
  buffer = new VideoBuffer(width / 4, height / 4);
  for (let i = 0; i < 3000; i++){
    spots.push(new Spot(canvas, buffer));
  }
}


function draw() {
  buffer.update();

  // Do the actual drawing
  background(0)
  if (frameCount > 10) {
    for (spot of spots) {
      spot.update();
      spot.show();
    }
  }

  // Debug
  debug();
}

class Spot {
  constructor(canvas, buffer) {
    this.buffer = buffer;
    this.x = random(canvas.width);
    this.y = random(canvas.height);
    this.xBuffer = int(this.x / canvas.width * buffer.width);
    this.yBuffer = int(this.y / canvas.height * buffer.height);

    this.hue = random(360);
    this.saturation = 50;
    this.brightness = 10;
    this.alpha = 1;
    this.maxRadius = random(20, 30);
    this.radius = 10;
  }

  update() {
    let videoColor = this.buffer.getColor(this.xBuffer, this.yBuffer);
    let b = brightness(videoColor)
    this.radius = map(b, 0, 80, this.maxRadius, 1)
    this.brightness = map(b, 0, 100, 100, 30);
  }

  show() {
    noStroke()
    fill(this.hue, this.saturation, this.brightness);
    ellipse(this.x, this.y, this.radius, this.radius);
  }
}


class VideoBuffer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.capture = createCapture(VIDEO)
    this.capture.size(this.width, this.height);
    this.buffer = createGraphics(this.width, this.height);
    this.buffer.pixelDensity(1);
  }

  getBuffer() {
    return this.buffer;
  }

  update() {
    this.copyWebcamToBuffer()
    this.buffer.loadPixels()
  }

  getColor(x, y) {
    x = int(x)
    y = int(y)
    let index = 4 * (x + y * this.width)
    return this.buffer.color(
      this.buffer.pixels[index],
      this.buffer.pixels[index + 1],
      this.buffer.pixels[index + 2],
      this.buffer.pixels[index + 3],
    )
  }

  copyWebcamToBuffer() {
    this.buffer.push()
    this.buffer.translate(this.width, 0);
    this.buffer.scale(-1.0, 1.0)
    this.buffer.image(this.capture, 0, 0);
    this.buffer.pop()
  }
}


// UTILITY FUNCTIONS
function debug() {
  push()
  image(buffer.getBuffer(), 0, 0);
  fill(0)
  text(trackFrameRate(), 10, 15)
  pop()
}

let frameRates = []
function trackFrameRate() {
  frameRates.push(frameRate())
  if (frameRates.length > 100){
    frameRates.shift()
  }
  let average = frameRates.reduce((pv, cv) => pv+cv, 0) / frameRates.length;
  return average.toFixed(2)
}
