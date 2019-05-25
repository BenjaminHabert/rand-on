function buildLinesIncrement(incrementX, incrementY) {
    colors = {
        'background': color('#444345'),
        'accent': color('#3c546c'),
        'detail': color('#e0e3e8'),
        // #9c9ea3
        // #1c1e20
        // https://www.canva.com/colors/color-palette-generator/
    }

    let b = 100;
    const start = createVector(
        map(incrementX, 0, 0.5, b, width - b, true),
        map(incrementX, 0, 1.0, b, height - b, true));
    const end = createVector(
        map(incrementX, 0.5, 1.0, b, width - b, true),
        map(incrementX, 0, 1.0, height - b, b, true));


    const angleMiddle = map(incrementX, 0, 1, 0, PI);
    // const parabola = 4 * (0.25 - pow(incrementX - 0.5, 2));
    const parabola = exp(-20 * pow(incrementX - 0.5, 2))
    const angle = () => random(angleMiddle - PI * parabola, angleMiddle + PI * parabola);
    const shapes = [
        backgroundShape(colors.background),
        angledLineShape(colors.detail, start, end, angle),
    ]
    return shapes;
}

function angledLineShape(col, start, end, angle) {
    const length = () => random(80, 120)
    const brush = compose(
        new Brush(col, 60),
        drawFixedAngled(angle, length),
    )

    const shape = compose(
        new Shape(brush),
        lineShape(start.x, start.y, end.x, end.y),
    );
    return shape;
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
        // rectShape(20, 20, width - 40, height - 40),
        // circleShape(width / 2, height / 2, 100),
        // fixedNumberOfStrokes(30),
        maxFilledRatio(6.0)
    );
    return shape;
}
