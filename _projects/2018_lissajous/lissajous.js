let margin = 14;
let w = 50;
let n = 8;
let circleDiameter = 5;
let topWavers = [];
let leftWavers = [];
let wigglers = [];

function setup() {
  createCanvas(600, 600).parent('p5sketch');
  for (let i=1; i<=n; i++) {
    topWavers.push(new SquareWave(margin * (i+1) + w * i, margin, w, i));
    leftWavers.push(new SquareWave(margin, margin * (i+1) + w * i, w, i));
  }
  ellipseMode(CENTER);
  for (let i=0; i<n; i++) {
    for (let j=0; j<n; j++) {
      wigglers[i + n * j] = new Wiggler();
    }
  }

}

function draw() {
  background(230);
  noFill();
  stroke(0);
  for (waver of topWavers) {
    waver.update();
    waver.draw();
  }
  for (waver of leftWavers) {
    waver.update();
    waver.draw();
  }
  for (let i=0; i<n; i++) {
    for (let j=0; j<n; j++) {
      let wiggler = wigglers[i + n * j];
      wiggler.add(topWavers[i].point.x, leftWavers[j].point.y)
      wiggler.draw();
    }
  }
}

class Wiggler {
  constructor() {
    this.points = [];
  }

  add(x, y) {
    this.points.push({
      x,
      y
    });

    let Npoints = document.getElementById('length').value;
    if (this.points.length > Npoints) {
      this.points.splice(0, this.points.length - Npoints)
    }
  }

  draw() {
    if (this.points) {
      noFill();
      beginShape();
      for (let p of this.points) {
        vertex(p.x, p.y);
      }
      endShape();
      if(document.getElementById('show_point').checked) {
        let p = this.points[this.points.length - 1];
        fill(0);
        ellipse(p.x, p.y, circleDiameter, circleDiameter);
      }
    }
  }
}

class SquareWave {

  constructor(x, y, w, frequency, firstCorner) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.frequency = frequency || 1;
    this.firstCorner = firstCorner || 0;
    this.previousPoint = this.makePoint(0);
    this.point = this.makePoint(0);
  }

  update() {
    let t = frameCount * this.frequency / 3;
    this.previousPoint = this.point;
    this.point = this.makePoint(t);
  }

  makePoint(t) {
    return {
      'x': boundedSawtooth(t, this.w, 0 - this.firstCorner) + this.x,
      'y': boundedSawtooth(t, this.w, 1 - this.firstCorner) + this.y,
    }
  }

  draw() {
    noFill();
    rect(this.x, this.y, this.w, this.w);
    if(document.getElementById('show_point').checked) {
      let d = this.w / 20;
      fill(0);
      ellipse(this.point.x, this.point.y, circleDiameter, circleDiameter);
    }
  }
}


function boundedSawtooth(x, w, delta) {
  let y = (x / w) - delta + 2.5
  let sawtooth = abs(y % 4 - 2) - 1;
  // entre -1 et 1
  let bounded = map(sawtooth, -0.5, 0.5, 0, w, true);
  return bounded;
}
