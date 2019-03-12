class ColorSelector {
    constructor(divId) {

        this.divId = divId;
        this.sliders = this.createSliders()
        this.width = 300;

        this.markers = [
            { x: 0.2 * this.width, y: 0.2 * this.width, name: 'base' },
            { x: 0.5 * this.width, y: 0.5 * this.width, name: 'complement' },
            { x: 0.8 * this.width, y: 0.8 * this.width, name: 'accent' },
        ]
        this.selectedMarker = null;
        this.offset = { x: 0, y: 0 }

        const sketch = (p) => {
            p.setup = () => this.setup(p);
            p.draw = () => this.draw(p);
            p.mousePressed = () => this.mousePressed(p);
            p.mouseDragged = () => this.mouseDragged(p);
            p.mouseReleased = () => this.mouseReleased(p);
        }
        new p5(sketch, divId);
    }

    getValues() {
        const saturation = (marker) => marker.x / this.width * 100;
        const brightness = (marker) => marker.y / this.width * 100;
        return {
            base: {
                saturation: saturation(this.markers[0]),
                brightness: brightness(this.markers[0]),
            },
            complement: {
                saturation: saturation(this.markers[1]),
                brightness: brightness(this.markers[1]),
            },
            accent: {
                saturation: saturation(this.markers[2]),
                brightness: brightness(this.markers[2]),
            }
        }
    }

    mousePressed(p) {
        for (let marker of this.markers) {
            const d = p.dist(marker.x, marker.y, p.mouseX, p.mouseY);
            if (d < 30) {
                this.selectedMarker = marker;
                this.offset.x = marker.x - p.mouseX;
                this.offset.y = marker.y - p.mouseY;
            }
        }
    }

    mouseDragged(p) {
        if (this.selectedMarker) {
            this.selectedMarker.x = p.mouseX + this.offset.x
            this.selectedMarker.y = p.mouseY + this.offset.y
        }
    }

    mouseReleased(p) {
        this.selectedMarker = null;
    }

    setup(p) {
        p.createCanvas(this.width, this.width);
    }

    draw(p) {
        p.background(50);
        for (let marker of this.markers) {
            p.ellipse(marker.x, marker.y, 30, 30)
        }
    }



    createSliders() {
        const sliders = {}
        sliders.hue = this.makeSlider('hue', 0, 360)
        // sliders.saturation = this.makeSlider('saturation', 0, 100, 30)
        // sliders.brightness = this.makeSlider('brightness', 0, 100, 20)

        // sliders.complementAddSaturation = this.makeSlider('add saturation to complement', -100, 100, 10)
        // sliders.complementAddBrightness = this.makeSlider('add brightness to complement', -100, 100, 30)

        sliders.accentAddHue = this.makeSlider('add hue to accent', -100, 100, 0)
        // sliders.accentAddSaturation = this.makeSlider('add Saturation to accent', -100, 100, 0)
        // sliders.accentAddBrightness = this.makeSlider('add Brightness to accent', -100, 100, 0)
        return sliders
    }

    makeSlider(name, min, max, initial) {
        const div = createDiv()


        const label = createP()
        const slider = createSlider(min, max, initial);
        slider.elt.onchange = () => label.html(name + ' ' + slider.value())
        slider.elt.onchange();


        div.parent(this.divId)
        div.class("row")
        slider.parent(div)
        label.parent(div)


        if (name == 'hue') {
            const button = createButton('random')
            // this is a little weird but we need to prepare random values
            // here. This because we are fixing the seed later
            const randomValues = []
            let index = 0;
            for (let i = 0; i < 100; i++) {
                randomValues.push(random(0, 360));
            }
            button.mousePressed(() => {
                slider.value(randomValues[index]);
                index = (index + 1) % randomValues.length;
            })
            button.parent(div)
        }

        return slider
    }

    getPalette(ratio) {
        const hue = this.sliders.hue.value() + map(ratio || 0, 0, 1, 0, 360),
            complementHue = hue + 180 - this.sliders.accentAddHue.value() / 2,
            accentHue = complementHue + this.sliders.accentAddHue.value() / 2;

        // const saturation = this.sliders.saturation.value(),
        //     brightness = this.sliders.brightness.value(),


        //     complementSaturation = saturation + this.sliders.complementAddSaturation.value(),
        //     complementBrightness = brightness + this.sliders.complementAddBrightness.value(),


        //     accentSaturation = complementSaturation + this.sliders.accentAddSaturation.value(),
        //     accentBrightness = complementBrightness + this.sliders.accentAddBrightness.value();


        const selector = this.getValues();
        const hsb = (h, s, b) => 'hsb(' + (h % 360).toFixed(0) + ', ' + s.toFixed(0) + '%, ' + b.toFixed(0) + '%)';
        const result = {
            base: hsb(hue % 360, selector.base.saturation, selector.base.brightness),
            complement: hsb(complementHue % 360, selector.complement.saturation, selector.complement.brightness),
            accent: hsb(accentHue % 360, selector.accent.saturation, selector.accent.brightness),
        }
        window.result = result
        return result
        return {
            base: color(hue % 360, saturation, brightness),
            complement: color(complementHue % 360, complementSaturation, complementBrightness),
            accent: color(accentHue % 360, accentSaturation, accentBrightness),
        }
    }
}