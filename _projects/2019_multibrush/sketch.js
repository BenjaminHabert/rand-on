let shapes;



function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);

    const colors = {
        'background': color('rgb(87, 77, 119)'),
    }

    shapes = [
        backgroundShape(colors.background)
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
        // lineShape(100, 100, 500, 300),
        // strokeInCanvas(50),
        circleShape(width / 2, height / 2, 100),
        // fixedNumberOfStrokes(30),
        maxFilledRatio(3.0)
    );
    return shape;
}


function backgroundBrush(col) {
    console.log(col)
    const length = () => random(50, 400);
    const brush = compose(
        new Brush(col, 20),
        drawFixedAngled(HALF_PI / 2.0, length),

    )
    return brush;
}