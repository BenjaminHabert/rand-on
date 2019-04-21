const randomChooser = (values, weights) => function () {
    if (weights === undefined)
        return random(values)

    const total = weights.reduce((acc, current) => acc + current);
    const r = random(total);
    let current = 0;
    for (let i = 0; i < values.length; i++) {
        current += weights[i];
        if (current > r) return values[i];
    }
}

function get_value(item) {
    try {
        return item();
    }
    catch (TypeError) {
        return item;
    }
}



class Shape {
    constructor(brush) {
        this.brush = brush;
        this.nStrokes = 0;
        this.strokeArea = 0;
    }

    pick() {
        return createVector(random(width), random(height));
    }

    isValid(stroke) {
        return true;
    }

    isComplete() {
        return this.nStrokes > 20;
    }

    addArea(area) {
        this.strokeArea += area;
    }

    draw() {
        for (let i = 0; i < 10; i++) {
            const start = this.pick();
            for (let j = 0; j < 10; j++) {
                const localBrush = get_value(this.brush);
                const stroke = localBrush.stroke(start.x, start.y);
                if (this.isValid(stroke)) {
                    stroke.draw()
                    this.nStrokes++;
                    this.addArea(stroke.area());
                    return;
                }
            }
        }
    }
}

const lineShape = (x1, y1, x2, y2) => ({
    pick: () => {
        const ratio = random();
        return createVector(
            lerp(x1, x2, ratio),
            lerp(y1, y2, ratio)
        )
    }
})

const fixedNumberOfStrokes = (maxStrokes) => (self) => ({
    isComplete: () => {
        return self.nStrokes >= maxStrokes;
    }
})

const strokeInCanvas = (margin) => ({
    isValid: (stroke) => {
        margin = margin || 0;
        return (
            stroke.start.x >= 0 + margin
            && stroke.start.y >= 0 + margin
            && stroke.end.x <= width - margin
            && stroke.end.y <= height - margin);
    }
})

const maxFilledRatio = (ratio) => (self) => ({
    area: () => {
        if (self.computedArea)
            return self.computedArea;

        const nPoints = 200;
        let validPoints = 0;
        const sketchArea = width * height;
        for (let i = 0; i < nPoints; i++) {
            const x = random(0, width),
                y = random(0, height);
            const fakeStroke = {
                start: createVector(x, y),
                end: createVector(x, y)
            }
            if (self.isValid)
                validPoints++;
        }
        self.computedArea = sketchArea * float(validPoints) / nPoints;
        return self.computedArea;
    },
    isComplete: () => {
        console.log('areas : ', self.strokeArea, self.area());
        return self.strokeArea >= ratio * self.area();
    }
})



function compose(baseObject, ...objectBehaviors) {
    let composedObject = Object.assign(baseObject);
    for (let behaviour of objectBehaviors) {
        try {
            composedObject = Object.assign(
                composedObject,
                behaviour(composedObject)
            )
        }
        catch (TypeError) {
            composedObject = Object.assign(
                composedObject,
                behaviour
            )
        }
    }
    return composedObject;
}


class Brush {
    constructor(col, thickness, end) {
        if (col !== undefined) this.col = col;
        if (thickness !== undefined) this.thickness = thickness;
        if (end !== undefined) this.end = end;
    }
    stroke(x, y) {
        const end = this.end(x, y);
        const stroke = new Stroke(x, y, end.x, end.y);
        stroke.color(get_value(this.col));
        stroke.strokeWeight(get_value(this.thickness));
        return stroke;
    }

    // default behaviors:
    end(x, y) {
        return createVector(x + 100, y);
    }
    col() {
        return color(0, 0.5);
    }
    thickness() {
        return 20;
    }
}

const drawFixedAngled = (angle, length) => ({
    end: (x, y) => {
        const actualLength = get_value(length),
            actualAngle = get_value(angle);
        const dx = actualLength * cos(actualAngle),
            dy = actualLength * sin(angle);
        return createVector(x + dx, y + dy);
    }
})

class Stroke {

    constructor(x1, y1, x2, y2) {
        this.start = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.length = dist(x1, y1, x2, y2);
        this.angle = atan2(y2 - y1, x2 - x1);
        this.col = color(0, 0.5);
        this.thickness = 30;

        // this.col = color(0, 0.5);
        // this.thickness = 30;
    }
    area() {
        return this.length * this.thickness
    }

    color(col) {
        this.col = col;
    }
    strokeWeight(pixels) {
        this.thickness = pixels;
    }
    draw() {
        push();
        translate(this.start.x, this.start.y);
        rotate(this.angle);
        this.apply_stroke(this.length);
        pop();
    }

    apply_stroke(length) {
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