var brush;

function setup() {
  createCanvas(600, 600).parent('p5sketch');
  angleMode(RADIANS);
  reset();
}

function reset() {
  brush = new Brush();
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
    reset();
}

function draw() {
  background(230);
  brush.update();
  brush.draw();
}


class Brush {
  constructor() {
    this.pos = createVector(0.5, 0.5);
    this.speed = createVector(random(-1, 1), random(-1, 1)).normalize().mult(0.1);
    this.acceleration = createVector(0, 0);
    this.coordinates = [];
  }

  updateCoordinates() {
    this.coordinates.push({
      'pos': this.pos.copy(),
      'speed': this.speed.copy(),
    })
  }

  update() {
    let deltaT = PI,
        timeScale = 0.01,
        spatialScale = 3,
        noiseAmplitude = 0.01,
        springAmplitude = 0.1,
        noise1 = noise(this.pos.x * spatialScale, this.pos.y * spatialScale, 0 * deltaT + (frameCount * timeScale)),
        noise2 = noise(this.pos.x * spatialScale, this.pos.y * spatialScale, 1 * deltaT + (frameCount * timeScale)),
        noise3 = noise(this.pos.x * spatialScale, this.pos.y * spatialScale, 2 * deltaT + (frameCount * timeScale)),
        noise4 = noise(this.pos.x * spatialScale, this.pos.y * spatialScale, 3 * deltaT + (frameCount * timeScale)),
        noiseX = noiseAmplitude * ( noise1 - noise2 ),
        noiseY = noiseAmplitude * ( noise3 - noise4 ),
        noiseForce = createVector(noiseX, noiseY),
        deltaR = createVector(0.5, 0.5).sub(this.pos),
        springStrength = pow(deltaR.mag() / 4, 2),
        springForce = deltaR.normalize().mult(springAmplitude * springStrength);
    // I might have overcomplicated things.
    // We could probably get the same effect by removing the acceleration
    // and applying all the effects to speed.

    this.acceleration = createVector(0, 0);
    this.acceleration.add(noiseForce);
    this.acceleration.add(springForce);
    this.acceleration.limit(0.1);
    this.speed.add(this.acceleration);
    this.speed.limit(0.01 * noise1);
    this.pos.add(this.speed);
    this.updateCoordinates();
    this.speed.mult(0.99);
    this.speed.limit(0.01);
  }

  draw() {
    stroke(0);
    noFill();
    let n = 5;
    for (var i = 0; i <= n; i ++) {
      beginShape()
      for (let coord of this.coordinates) {
        let ortho = coord.speed.copy().limit(0.01).rotate(HALF_PI)
        let pos = coord.pos.copy().add(ortho.mult(i));
        curveVertex(pos.x * width, pos.y * height);
      }
      endShape()
    }

  }
}
