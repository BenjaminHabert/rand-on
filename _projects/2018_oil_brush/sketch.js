let brush;
let nStrokes = 100;
let colors = [];

function setup() {
    createCanvas(600, 600).parent('p5sketch');
    // pixelDensity(4)
    angleMode(DEGREES);
    brush = new Brush();
    background(210, 205, 200);
    colors = [
        color(200, 0, 0, .5),
        color(250, 150, 100, .5),
        color(100, 100, 150, .5),
    ]
}

function draw() {
    if (frameCount < 150) {
        drawBackground();
    }
    else if (frameCount < 200) {
        drawAccents();
    }
    else {
        noLoop();
    }

}

function drawBackground() {
    const length = random(100, 400);
    const x0 = random(20, width - 20 - length);
    const y0 = random(50, height - 50);

    push();
    translate(x0, y0);
    rotate(0);

    brush.strokeWeight(50);
    brush.color(colors[2])
    brush.draw(length);

    pop();
}

function drawAccents() {
    const centers = [
        {proba: 10, x: width/2, y:3*height/4, dx: width/5, dy: 0},
        {proba: 3, x: width/3, y:height/3, dx: width/10, dy: height/20},
    ];
    const weightedCenters = []
    for (let center of centers) {
        for (let i=0; i<center.proba; i++) {
            weightedCenters.push(center);
        }
    }
    const center = random(weightedCenters);
    const length = random(50, 150);
    const x0 = randomGaussian(center.x, center.dx);
    const y0 = - (length / 2.0) + randomGaussian(center.y, center.dy);
    const col = random(colors.slice(0, 2));

    push();
    translate(x0, y0);
    rotate(90);

    brush.strokeWeight(30);
    brush.color(col)
    brush.draw(length);

    pop();
}


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
    draw(length) {
    
        const curve = this.buildCurve(this.thickness, length);
        const nStrokes = this.evaluateNStrokes(this.thickness);

        for (let i=0; i<nStrokes; i++) {
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
        for (let i=0; i<=nPoints; i++) {
            points.push({
                x: lerp(0, length, float(i)/nPoints),
                y: lerp(0, thickness/4.0, direction * pow(float(i)/nPoints,3)),
            });
        }
        return points;
    }

    evaluateNStrokes(thickness) {
        const {minWeight, maxWeight} = this.minMaxStrokeWeight(thickness);
        const averageThickness = 0.5 * (minWeight + maxWeight);
        const nStrokes = 4 * thickness / averageThickness;
        return nStrokes;
    }

    randomizeCurve(curve, thickness) {
        const w = thickness;
        const length = max(curve.map(point => point.x));

        // STEP 1: find begin and end of original curve;
        const deltaY = random(-w/2, w/2);
        const begin = random(0, 10);
        const end = (curve.length
                - w * pow(deltaY/w, 2)
                - (w / 3.0) * (0.7 - noise(3 * deltaY / w))
                - random(0, 10.0));
        let points = curve.slice(begin, end);

        // STEP 2: randomize position of points
        points = points.map(point => {
            const newY = (
                point.y
                + deltaY
                + deltaY / 3.0 * pow(point.x / float(length), 2) * noise(point.x / 100.0, point.y/ 100.0)
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
        return {minWeight, maxWeight}
    }

    randomizeStrokeWeight(thickness) {
        const {minWeight, maxWeight} = this.minMaxStrokeWeight(thickness);
        return random(minWeight, maxWeight);
    }

}
