let brush;


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);
    brush = new Brush();
}

function draw() {
    push();
    translate(width * 1.0 / 4, random(height * 1.0 / 4, height * 3.0 / 4));
    rotate(0);

    brush.strokeWeight(50);
    // brush.color(colors[2])
    brush.draw(width * 2.0 / 4);

    pop();

    if (frameCount > 20) {
        noLoop();
    }
}
