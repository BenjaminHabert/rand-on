let shapes;

function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);

    shapes = [
        backgroundShape(color('rgb(87, 77, 119)'))
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

function backgroundShape(col) {
    const brush = backgroundBrush(col);
    const shape = compose(
        new Shape(brush),
        lineShape(100, 100, 500, 300),
        strokeInCanvas(50),
        // fixedNumberOfStrokes(30),
        maxFilledRatio(0.5)
    );
    return shape;
}


function backgroundBrush(col) {
    console.log(col)
    const length = () => random(200, 500);
    const brush = compose(
        new Brush(col, 60),
        drawFixedAngled(HALF_PI, length),

    )
    return brush;
}