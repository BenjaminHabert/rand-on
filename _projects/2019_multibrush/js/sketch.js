let FAST_STROKES = true;
let STROKES_BY_FRAME = FAST_STROKES ? 5 : 2;
let INCREMENT_X = 0.9;
let INCREMENT_Y = 0.5;
let SAVE_BASENAME = 'crossed';
let DRAW_ALL = false;

// let EXPERIMENT_FUNCTION = buildCrossedIncrement;
// let EXPERIMENT_FUNCTION = buildCirclesIncrement;
let EXPERIMENT_FUNCTION = buildLinesIncrement;

let shapes;
let canvas;
let increments;


function setup() {
    makeControls('p5sketch')
    canvas = createCanvas(600, 600).parent('p5sketch');
    restart();
}

function restart() {
    if (DRAW_ALL) {
        next = increments.next().value;
        if (next) {
            INCREMENT_X = next.x;
            INCREMENT_Y = next.y;
        }
        else {
            DRAW_ALL = false;
            return;
        }
    }
    background(210, 205, 200);
    shapes = EXPERIMENT_FUNCTION(INCREMENT_X, INCREMENT_Y);
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
    if (shapesComplete) {
        if (DRAW_ALL) {
            saveImage();
            restart();
        }
        else {
            noLoop();
        }
    }
}

function* make_increments(stepsX, stepsY) {
    for (let i = 0; i < stepsX; i++) {
        for (let j = 0; j < stepsY; j++) {
            yield createVector(
                i / (stepsX - 1),
                j / (stepsY - 1)
            )
        }
    }
}

function saveImage() {
    const fast = FAST_STROKES ? "fast_" : "";
    const save_name = SAVE_BASENAME + '_' + fast + INCREMENT_X.toFixed(1) + '_' + INCREMENT_Y.toFixed(1) + '_.png';
    console.log(save_name);
    saveCanvas(canvas, save_name);
}

function keyTyped() {
    if (key == 's') {
        console.log('saving to ' + save_name);
        save();
    }
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
        STROKES_BY_FRAME = FAST_STROKES ? 5 : 2;
        INCREMENT_X = incrementX.value();
        INCREMENT_Y = incrementY.value();
        restart();
    }


    const createAllDiv = createDiv();
    const stepsXInput = createInput('3').parent(createAllDiv);
    const stepsYInput = createInput('2').parent(createAllDiv);
    const createAllButton = createButton('generate all images').parent(createAllDiv);

    createAllDiv.parent(main);

    createAllButton.mousePressed(() => {
        const stepsX = Number(stepsXInput.value());
        const stepsY = Number(stepsYInput.value());
        increments = make_increments(stepsX, stepsY);
        DRAW_ALL = true;
        restart();
    });
}