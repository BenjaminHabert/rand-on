let brush;


function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(200);
    // brush = new VerticalBrush(undefined, undefined, () => random(100, 200));
    const col = randomChooser(
        [
            color(100, 0, 200),
            color(200, 0, 100)
        ],
        [5, 1]
    )
    const length = randomChooser([100, 200]);
    brush = buildBrush(
        new Brush(col),
        drawVertial(length)
    )
}

function draw() {

    for (let i = 0; i < 10; i++) {
        const stroke = brush.stroke(random(100, 500), random(100, 500))
        stroke.draw()
    }
    noLoop();
}
