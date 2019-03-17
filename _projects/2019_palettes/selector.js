class Marker {
    constructor(name, hue, saturation, brightness) {
        this.name = name;
        this.color = { hue, saturation, brightness };
        this.radius = 30;
    }

    setHue(hue) {
        this.color.hue = hue % 360;
    }

    hsb(hueShift) {
        const c = this.color
        return 'hsb(' + (c.hue + (hueShift ? hueShift : 0)) % 360 + ', ' + c.saturation + '%, ' + c.brightness + '%)'
    }

    draw(p) {
        const c = this.color
        p.colorMode(p.HSB);
        p.fill(c.hue, c.saturation, c.brightness);
        p.stroke((c.hue + 180) % 360, 80, 80);
        const pos = this.getPos(p);
        p.ellipse(pos.x, pos.y, this.radius, this.radius);
    }

    getPos(p) {
        const c = this.color
        const x = c.saturation / 100.0 * p.width,
            y = c.brightness / 100.0 * p.height;
        return { x, y };
    }

    setPos(p, x, y) {
        this.color = {
            hue: this.color.hue,
            saturation: x * 100.0 / p.width,
            brightness: y * 100.0 / p.height,
        }
    }

    intersectsMouse(p) {
        const pos = this.getPos(p);
        const d = p.dist(pos.x, pos.y, p.mouseX, p.mouseY);
        if (d < this.radius) {
            this.offset = {
                x: pos.x - p.mouseX,
                y: pos.y - p.mouseY,
            };
            return true
        }
        return false;
    }

    dragg(p) {
        this.setPos(p, p.mouseX + this.offset.x, p.mouseY + this.offset.y);
    }
}

class ColorSelector {
    constructor(divId) {

        this.divId = divId;
        this.sliders = this.createSliders()
        this.width = 300;

        this.markers = [];
        this.selectedMarker = null;
        this.offset = { x: 0, y: 0 }

        const sketch = (p) => {
            p.setup = () => this.setup(p);
            p.draw = () => this.draw(p);
            p.mousePressed = () => this.mousePressed(p);
            p.mouseDragged = () => this.mouseDragged(p);
            p.mouseReleased = () => this.mouseReleased(p);

            this.markers = [
                new Marker('base', 0, 20, 20),
                new Marker('complement', 0, 50, 50),
                new Marker('accent', 0, 80, 80),
            ];
        }
        new p5(sketch, divId);
    }

    mousePressed(p) {
        for (let marker of this.markers) {
            if (marker.intersectsMouse(p)) {
                this.selectedMarker = marker;
            }
        }
    }

    mouseDragged(p) {
        if (this.selectedMarker) {
            this.selectedMarker.dragg(p);
        }
    }

    mouseReleased(p) {
        this.selectedMarker = null;
    }

    setup(p) {
        p.createCanvas(this.width, this.width);
        p.colorMode(p.HSB);
    }

    draw(p) {
        p.background(50);
        this.drawBackground(p);
        this.drawMarkers(p);
    }

    drawMarkers(p) {
        for (let marker of this.markers) {
            marker.setHue(this.getHue(marker.name))
            marker.draw(p)
        }
    }

    drawBackground(p) {
        const w = p.width / 20;
        for (let x = 0; x < p.width; x += w) {
            for (let y = 0; y < p.width; y += w) {
                const saturation = x * 100.0 / p.width,
                    brightness = y * 100.0 / p.width
                p.fill(100, saturation, brightness);
                p.noStroke();
                p.rect(x, y, w, w);
            }
        }
    }

    getHue(name) {
        const baseHue = this.sliders.hue.value();
        const accentAddHue = this.sliders.accentAddHue.value();
        const hues = {
            base: baseHue,
            complement: int(baseHue + 180 - accentAddHue / 2) % 360,
            accent: int(baseHue + 180 + accentAddHue / 2) % 360,
        }
        return hues[name];
    }


    createSliders() {
        const sliders = {}
        sliders.hue = this.makeSlider('hue', 0, 360)
        sliders.accentAddHue = this.makeSlider('add hue to accent', -100, 100, 30)
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
        const result = {}
        for (let marker of this.markers) {
            const hueShift = int(map(ratio, 0, 1, 0, 360));
            result[marker.name] = marker.hsb(hueShift);
        }
        return result
    }
}