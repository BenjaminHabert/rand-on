let shapes;
const STROKES_BY_FRAME = 3;
const FAST_STROKES = false;
let colors;


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(210, 205, 200);

    colors = {
        'background': color('rgb(87, 77, 119)'),
        'yellow': color('rgb(224, 165, 62)'),
        'orange': color('rgb(242, 155, 89)')
    }

    shapes = [
        backgroundShape(colors.background),
        crossedShape(),
        // groundShape(colors.orange),
        // sunShape(colors.yellow, width / 3, height / 3, 100),
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


function crossedShape() {
    const length = 100;
    const brush = randomChooser([
        compose(
            new Brush(colors.yellow),
            drawFixedAngled(PI / 3.0, length)
        ),
        compose(
            new Brush(colors.orange),
            drawFixedAngled(2 * PI / 3.0, length)
        )
    ])

    return compose(
        new Shape(brush),
        strokeInCanvas(50),
        maxFilledRatio(2)
    )
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

// function sunShape(col, x, y, radius) {
//     const length = () => random(10, 100);
//     const thickness = () => random(10, 20);
//     const brush = compose(
//         new Brush(col, thickness),
//         randomAngle(length)
//     );
//     const shape = compose(
//         new Shape(brush),
//         circleShape(x, y, radius),
//         maxFilledRatio(2.0)
//     )
//     return shape
// }

// function groundShape(col) {
//     const length = () => random(50, 100);
//     const thickness = () => random(20, 40);
//     const angle = randomChooser([0, PI])
//     const brush = compose(
//         new Brush(col, thickness),
//         drawFixedAngled(angle, length)
//     );
//     const shape = compose(
//         new Shape(brush),
//         rectShape(50, height - 150, width - 100, 100),
//         maxFilledRatio(3.0)
//     )
//     return shape
// }