let shapes;
const STROKES_BY_FRAME = 3;


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);

    const colors = {
        'background': color('rgb(87, 77, 119)'),
        'yellow': color('rgb(224, 165, 62)'),
        'orange': color('rgb(226, 144, 81)')
    }

    shapes = [
        backgroundShape(colors.background),
        circleS(colors.yellow, width / 3, height / 3, 100),
        circleS(colors.orange, 2 * width / 3, 2 * height / 3, 150),
    ]

}


function draw() {
    let shapesComplete = true;
    let strokes = 0;
    for (let shape of shapes) {
        while (strokes < STROKES_BY_FRAME && !shape.isComplete()) {
            shapesComplete = false;
            shape.draw();
            strokes++;
        }
    }
    if (shapesComplete)
        noLoop();
}

function backgroundShape(col) {
    const length = () => random(100, 400);
    const brush = compose(
        new Brush(col, 60),
        drawFixedAngled(HALF_PI, length),

    )
    const shape = compose(
        new Shape(brush),
        // lineShape(100, 100, 500, 300),
        strokeInCanvas(20),
        // circleShape(width / 2, height / 2, 100),
        // fixedNumberOfStrokes(30),
        maxFilledRatio(6.0)
    );
    return shape;
}

function circleS(col, x, y, radius) {
    const length = () => random(10, 100);
    const thickness = () => random(10, 20);
    const brush = compose(
        new Brush(col, thickness),
        randomAngle(length)
    );
    const shape = compose(
        new Shape(brush),
        circleShape(x, y, radius),
        maxFilledRatio(2.0)
    )
    return shape
}