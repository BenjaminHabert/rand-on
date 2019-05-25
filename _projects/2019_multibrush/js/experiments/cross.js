
function buildCrossedIncrement(incrementX, incrementY) {
    colors = {
        'background': color('#444345'),
        'accent': color('#3c546c'),
        'detail': color('#e0e3e8'),
        // #9c9ea3
        // #1c1e20
        // https://www.canva.com/colors/color-palette-generator/
    }

    const crossColors = [colors.accent, colors.detail];
    const colorRatios = [incrementX, 1 - incrementX];
    const maxWidth = width - 100;
    const minWidth = lerp(width / 4, maxWidth, incrementY);

    const shapeWidth = map(incrementX, 0, 0.5, maxWidth, minWidth, true);
    const shapeHeight = map(incrementX, 0.5, 1, minWidth, maxWidth, true);

    const shapes = [
        backgroundShape(colors.background),
        crossedShape(crossColors, colorRatios, shapeWidth, shapeHeight),
    ]
    return shapes;
}


function crossedShape(colors, ratios, shapeWidth, shapeHeight) {
    const length = 100;
    const brush = randomChooser([
        compose(
            new Brush(colors[0]),
            drawFixedAngled(PI / 3.0, length)
        ),
        compose(
            new Brush(colors[1]),
            drawFixedAngled(2 * PI / 3.0, length)
        )
    ], ratios)

    return compose(
        new Shape(brush),
        rectShape(width / 2 - shapeWidth / 2, height / 2 - shapeHeight / 2, shapeWidth, shapeHeight),
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
        // rectShape(20, 20, width - 40, height - 40),
        // circleShape(width / 2, height / 2, 100),
        // fixedNumberOfStrokes(30),
        maxFilledRatio(6.0)
    );
    return shape;
}
