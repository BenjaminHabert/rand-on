let seed = 0;

const options = {}
let selector;

function setup() {
    createCanvas(600, 600).parent('p5sketch');
    colorMode(HSB);
    createOptions()

    selector = new ColorSelector('sliders');
}

function createOptions() {
    const optionDiv = createDiv();
    optionDiv.parent('sliders')

    options.multiples = createCheckbox('multiple hues', true);

    for (let o in options) {
        options[o].parent(optionDiv);
    }
}


function mouseClicked() {
    if (mouseX > 0 && mouseX < width) {
        if (mouseY > 0 && mouseY < height) {
            seed = random(0, 100);
        }
    }
}

function draw() {
    background('rgb(249, 247, 239)')
    if (options.multiples.checked()) {
        const n = 4,
            delta = width / float(n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                push()
                translate(i * delta, j * delta);
                scale(1.0 / n);
                const ratio = (j * n + i) / (n * n);
                const colors = selector.getPalette(ratio);
                drawDemo(colors, j * n + i)
                pop()
            }
        }
    }
    else {
        const colors = selector.getPalette();
        drawDemo(colors)
    }


}

function drawDemo(colors, index) {
    randomSeed(seed + (index || 0));
    fill(colors.base);
    noStroke();
    const margin = 75;
    rect(margin, margin, width - 2 * margin, height - 2 * margin);

    fill(colors.complement);
    for (let i = 0; i < 20; i++) {
        drawCircle(50, 100)
    }

    fill(colors.accent);
    for (let i = 0; i < 20; i++) {
        drawCircle(20, 60)
    }
}

function drawCircle(rmin, rmax) {
    noStroke();
    let r = random(rmin, rmax),
        x = random(r, width - r),
        y = random(r, height - r);
    ellipse(x, y, r, r);
}