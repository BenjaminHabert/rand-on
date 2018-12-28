function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(0);
}

function draw() {
    background(frameCount % 255);
}
