const SIZE = 20;
var wind;

function setup(){
    createCanvas(600, 600).parent('#sketchdiv')
    frameRate(30);
    wind = new Wind();
}

function draw(){
    background(0, 130, 200);

    wind.fluctuate();

    for(let x = SIZE; x < width - SIZE; x += SIZE){
        for(let y = SIZE; y < height - SIZE; y += SIZE){
            push()
            translate(x, y)
            let breeze = wind.local_breeze(x, y);
            draw_stem(breeze);
            pop();
        }
    }
}

function draw_stem(breeze){
    stroke(255);
    strokeWeight(2);
    if(breeze < 0.6){
        line(0, 0, SIZE, SIZE);
    }
    else {
        line(0, SIZE, SIZE, 0);
    }
}

class Wind {
    constructor(){
        angleMode(RADIANS);
        this.time = 0;

        this.bearing = PI/4;
        this.strength = 4;

        this.eastern_flow = 0;
        this.southern_flow = 0;
    }

    fluctuate() {
        let increment = 1 / 100;
        this.time += increment;

        this.bearing = map(noise(this.time), 0, 1, PI / 8, 5 * PI / 8);
        this.strength = map(noise(this.time), 0, 1, 2, 6);

        this.eastern_flow += this.strength * cos(this.bearing) * increment;
        this.southern_flow += this.strength * sin(this.bearing) * increment;
    }

    local_breeze(x, y) {
        return noise(
            2 * x / width - this.eastern_flow,
            2 * y / width - this.southern_flow,
            this.time
        );
    }
}
