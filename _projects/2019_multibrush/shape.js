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