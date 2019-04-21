let shapes;

function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);

    shapes = [
        backgroundShape()
    ]

}


function draw() {

    for (let shape of shapes) {
        if (!shape.isComplete()) {
            shape.draw();
            return;
        }
    }
    noLoop();
}

function backgroundShape() {
    const brush = backgroundBrush();
    const shape = compose(
        new Shape(brush),
        lineShape(100, 100, 500, 300),
        fixedNumberOfStrokes(30),
    );
    return shape;
}


function backgroundBrush() {
    const col = randomChooser(
        [
            color(100, 0, 200),
            color(200, 0, 100)
        ],
        [2, 1]
    )
    const length = () => random(100, 200);
    const brush = compose(
        new Brush(col),
        drawVertial(length),
    )
    return brush;
}