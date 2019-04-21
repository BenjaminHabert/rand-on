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
        return stroke.corners.reduce(
            (previous, corner) => previous && this.isValidPoint(corner),
            true)
    }

    isValidPoint(stroke) {
        return true;
    }

    isComplete() {
        return this.nStrokes > 20;
    }

    addArea(area) {
        this.strokeArea += area;
    }

    draw() {
        for (let i = 0; i < 50; i++) {
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
    isValidPoint: (point) => {
        margin = margin || 0;
        return (
            point.x >= 0 + margin
            && point.y >= 0 + margin
            && point.x <= width - margin
            && point.y <= height - margin);
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
            const fakePoint = createVector(x, y);
            if (self.isValidPoint(fakePoint))
                validPoints++;
        }
        self.computedArea = sketchArea * float(validPoints) / nPoints;
        return self.computedArea;
    },
    isComplete: () => {
        return self.strokeArea >= ratio * self.area();
    }
})

const circleShape = (x, y, radius) => ({
    isValidPoint: (point) => {
        const d = dist(x, y, point.x, point.y);
        return d < radius;
    }
})

const rectShape = (x, y, w, h) => ({
    isValidPoint: (point) => {
        return (
            point.x >= x
            && point.y >= y
            && point.x <= x + w
            && point.y <= y + h
        )
    }
})