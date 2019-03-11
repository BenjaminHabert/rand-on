const sliders = {
}
const options = {

}


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    noLoop();
    colorMode(HSB);
    createOptions()
    createSliders()
}

function createOptions() {
    const optionDiv = createDiv();
    optionDiv.parent('sliders')

    options.multiples = createCheckbox('multiple hues', true);

    for (let o in options) {
        options[o].parent(optionDiv);
    }
}




function createSliders() {

    sliders.hue = makeSlider('hue', 0, 360)
    sliders.saturation = makeSlider('saturation', 0, 100, 30)
    sliders.brightness = makeSlider('brightness', 0, 100, 20)

    sliders.complementAddSaturation = makeSlider('add saturation to complement', -100, 100, 10)
    sliders.complementAddBrightness = makeSlider('add brightness to complement', -100, 100, 30)

    sliders.accentAddHue = makeSlider('add hue to accent', -100, 100, 30)
    sliders.accentAddSaturation = makeSlider('add Saturation to accent', -100, 100, 0)
    sliders.accentAddBrightness = makeSlider('add Brightness to accent', -100, 100, 0)
    // sliders.brightnessGap = makeSlider('brignthess gap', 0, 50)
}

function makeSlider(name, min, max, initial) {
    const div = createDiv()


    const label = createP()
    const slider = createSlider(min, max, initial);
    slider.elt.onchange = () => label.html(name + ' ' + slider.value())
    slider.elt.onchange();


    div.parent('sliders')
    div.class("row")
    slider.parent(div)
    label.parent(div)


    if (name == 'hue') {
        const button = createButton('random')
        button.mousePressed(() => slider.value(random(0, 360)))
        button.parent(div)
    }

    return slider
}

function mouseClicked() {
    redraw();
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
                const colors = createPalette(ratio);
                drawDemo(colors)
                pop()
            }
        }
    }
    else {
        const colors = createPalette();
        drawDemo(colors)
    }


}

function drawDemo(colors) {
    fill(colors.base);
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

function createPalette(ratio) {
    const hue = ratio === undefined ? sliders.hue.value() : map(ratio, 0, 1, 0, 360);


    const saturation = sliders.saturation.value(),
        brightness = sliders.brightness.value(),

        complementHue = hue + 180,
        complementSaturation = saturation + sliders.complementAddSaturation.value(),
        complementBrightness = brightness + sliders.complementAddBrightness.value(),

        accentHue = complementHue + sliders.accentAddHue.value(),
        accentSaturation = complementSaturation + sliders.accentAddSaturation.value(),
        accentBrightness = complementBrightness + sliders.accentAddBrightness.value();
    // accentBrightness = brightness + sliders.brightnessGap.value()

    return {
        base: color(hue % 360, saturation, brightness),
        complement: color(complementHue % 360, complementSaturation, complementBrightness),
        accent: color(accentHue % 360, accentSaturation, accentBrightness),
    }
}