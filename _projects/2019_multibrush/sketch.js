let FAST_STROKES = true;
const STROKES_BY_FRAME = FAST_STROKES ? 5 : 2;
let INCREMENT_X = 0.9;
let INCREMENT_Y = 0.5;
let SAVE_BASENAME = 'crossed';


let shapes;
let canvas;


function setup() {
    makeControls('p5sketch')
    canvas = createCanvas(600, 600).parent('p5sketch');
    restart();
}

function makeControls(divId) {
    const main = createDiv().parent(divId);

    const fast = createCheckbox('fast strokes ?', FAST_STROKES);

    const incrementDivX = createDiv();
    createSpan('Increment X: ').parent(incrementDivX);
    const incrementX = createSlider(0, 1, INCREMENT_X, 0.1).parent(incrementDivX);

    const incrementDivY = createDiv();
    createSpan('Increment Y: ').parent(incrementDivY);
    const incrementY = createSlider(0, 1, INCREMENT_Y, 0.1).parent(incrementDivY);

    const saveDiv = createDiv();
    const saveInput = createInput(SAVE_BASENAME).parent(saveDiv);
    const saveButton = createButton('save').parent(saveDiv);

    fast.parent(main);
    incrementDivX.parent(main);
    incrementDivY.parent(main);
    saveDiv.parent(main);

    fast.changed(update);
    incrementX.changed(update);
    incrementY.changed(update);
    saveInput.input(() => SAVE_BASENAME = saveInput.value());
    saveButton.mousePressed(saveImage);

    function update() {
        FAST_STROKES = fast.checked();
        INCREMENT_X = incrementX.value();
        INCREMENT_Y = incrementY.value();
        restart();
    }
}

function restart() {
    background(210, 205, 200);
    shapes = buildCrossedIncrement(INCREMENT_X);
    loop();
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

function saveImage() {
    const save_name = SAVE_BASENAME + '_' + INCREMENT_X.toFixed(1) + '_' + INCREMENT_Y.toFixed(1) + '_.png';
    console.log(save_name);
    saveCanvas(canvas, save_name);
}

function keyTyped() {
    if (key == 's') {
        console.log('saving to ' + save_name);
        save();
    }
}


function buildCrossedIncrement(increment) {
    colors = {
        'background': color('#444345'),
        'accent': color('#3c546c'),
        'detail': color('#e0e3e8'),
        // #9c9ea3
        // #1c1e20
        // https://www.canva.com/colors/color-palette-generator/
    }

    const crossColors = [colors.accent, colors.detail];
    const colorRatios = [increment, 1 - increment];

    const shapes = [
        backgroundShape(colors.background),
        crossedShape(crossColors, colorRatios),
        // groundShape(colors.orange),
        // sunShape(colors.yellow, width / 3, height / 3, 100),
    ]
    return shapes;
}


function crossedShape(colors, ratios) {
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