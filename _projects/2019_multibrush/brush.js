class Brush {

    constructor() {
        this.col = color(0, 0.5);
        this.weight = 30;
    }

    color(col) {
        this.col = col;
    }
    strokeWeight(pixels) {
        this.thickness = pixels;
    }
    line(x1, y1, x2, y2) {
        const length = dist(x1, y1, x2, y2),
            angle = atan2(y2 - y1, x2 - x1);
        console.log(length, angle)
        push();
        translate(x1, y1);
        rotate(angle);
        this.draw(length);
        pop();
    }
    draw(length) {

        const curve = this.buildCurve(this.thickness, length);
        const nStrokes = this.evaluateNStrokes(this.thickness);

        for (let i = 0; i < nStrokes; i++) {
            const points = this.randomizeCurve(curve, this.thickness);
            const c = this.randomizeColor(this.col);
            const weight = this.randomizeStrokeWeight(this.thickness);

            noFill();
            stroke(c);
            strokeWeight(weight);

            beginShape();
            for (let point of points) {
                curveVertex(point.x, point.y);
            }
            endShape();
        }
    }

    buildCurve(thickness, length) {
        const nPoints = length;
        const points = [];
        const direction = random([-1, 1]);
        for (let i = 0; i <= nPoints; i++) {
            points.push({
                x: lerp(0, length, float(i) / nPoints),
                y: lerp(0, thickness / 4.0, direction * pow(float(i) / nPoints, 3)),
            });
        }
        return points;
    }

    evaluateNStrokes(thickness) {
        const { minWeight, maxWeight } = this.minMaxStrokeWeight(thickness);
        const averageThickness = 0.5 * (minWeight + maxWeight);
        const nStrokes = 4 * thickness / averageThickness;
        return nStrokes;
    }

    randomizeCurve(curve, thickness) {
        const w = thickness;
        const length = max(curve.map(point => point.x));

        // STEP 1: find begin and end of original curve;
        const deltaY = random(-w / 2, w / 2);
        const begin = random(0, 10);
        const end = (curve.length
            - w * pow(deltaY / w, 2)
            - (w / 3.0) * (0.7 - noise(3 * deltaY / w))
            - random(0, 10.0));
        let points = curve.slice(begin, end);

        // STEP 2: randomize position of points
        points = points.map(point => {
            const newY = (
                point.y
                + deltaY
                + deltaY / 3.0 * pow(point.x / float(length), 2) * noise(point.x / 100.0, point.y / 100.0)
            );
            return {
                x: point.x,
                y: newY,
            };
        })
        return points;
    }

    randomizeColor(col) {
        const cMode = colorMode();
        colorMode(HSB);
        const newColor = color(
            col._getHue() + random(0, 10),
            col._getSaturation() + random(-10, 10),
            col._getBrightness() + random(-10, 10),
            col._getAlpha(),
        );
        colorMode(cMode);
        return newColor
    }

    minMaxStrokeWeight(thickness) {
        const maxWeight = min(thickness / 10.0, 3);
        const minWeight = maxWeight / 10.0;
        return { minWeight, maxWeight }
    }

    randomizeStrokeWeight(thickness) {
        const { minWeight, maxWeight } = this.minMaxStrokeWeight(thickness);
        return random(minWeight, maxWeight);
    }

}