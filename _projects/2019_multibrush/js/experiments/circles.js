function buildCirclesIncrement(incrementX, incrementY) {
    colors = {
        'background': color('#444345'),
        'accent': color('#3c546c'),
        'detail': color('#e0e3e8'),
        // #9c9ea3
        // #1c1e20
        // https://www.canva.com/colors/color-palette-generator/
    }


    const shapes = [
        backgroundShape(colors.background),
    ]
    return shapes;
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
