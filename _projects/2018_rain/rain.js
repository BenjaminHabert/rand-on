var drops = [];
var sounds = [];


function preload() {
  sounds = [
    loadSound('drop.wav'),
  ]
}

function setup() {
  createCanvas(600, 600).parent('p5sketch');
  frameRate(30);
  ellipseMode(CENTER);
}

function draw() {
  background('#5E929B');

  renderDrops();
  addDrops();
}

function renderDrops() {
  drops = drops.filter(drop => {
    drop.update();
    drop.show();
    return drop.alive();
  })
}

function addDrops() {
  let rainProba = 0.03;
  if (frameCount > 4 * 30) {
    rainProba = constrain(
      map(noise(frameCount * 0.01), 0.2, 0.8, 0.03, 0.25),
      0.03, 0.3);
  }
  if (random() < rainProba) {
    drops.push(new Drop());
  }
}


class Drop {

  constructor() {
    this.x = 50 + random(width - 2 * 50);
    this.y = 50 + random(height - 2 * 50);
    this.strength = 0.2 + random(3);
    this.maxAge = this.strength * 30;

    // random(sounds).play(0, 3 + 2 * random(), this.strength);
    random(sounds).play(0, 2.5 + 2 * random(), this.strength);

    this.age = 0;
  }

  update() {
    this.age += 1
  }

  show() {
    noFill();
    strokeWeight(this.strength);
    stroke(44, 40, 63, map(this.age, 0, this.maxAge, 255, 0));
    ellipse(this.x, this.y, this.age * 4, this.age * 4);
  }

  alive() {
    return this.age < this.maxAge * 1.3;
  }

}
