let brush;


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);
    brush = new Brush();
}

function draw() {

    brush.strokeWeight(50);
    // brush.color(colors[2])
    brush.line(50, 50, 200, 100);
    brush.line(150, 400, 50, 300);
    brush.line(300, 300, 500, 200)

    pop();

    // if (frameCount > 20) {
    noLoop();
    // }
}
