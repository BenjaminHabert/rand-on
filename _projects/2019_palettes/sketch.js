let sliders = {
    baseHue: null,
}


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    noLoop();
    colorMode(HSB);

    createSliders()
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
    const colors = createPalette();

    background('rgb(249, 247, 239)')

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

function createPalette() {
    const hue = sliders.hue.value(),
        saturation = sliders.saturation.value(),
        brightness = sliders.brightness.value(),

        complementHue = hue + 180,
        complementSaturation = saturation + sliders.complementAddSaturation.value(),
        complementBrightness = brightness + sliders.complementAddBrightness.value(),

        accentHue = complementHue + sliders.accentAddHue.value(),
        accentSaturation = complementSaturation + sliders.accentAddSaturation.value(),
        accentBrightness = complementBrightness + sliders.accentAddBrightness.value();
    // accentBrightness = brightness + sliders.brightnessGap.value()

    return {
        base: color(hue, saturation, brightness),
        complement: color(complementHue % 360, complementSaturation, complementBrightness),
        accent: color(accentHue % 360, accentSaturation, accentBrightness),
    }
}