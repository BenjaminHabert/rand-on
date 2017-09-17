
// UTILITY FUNCTIONS
function make_noise(theta, sharpness, time, index) {
    // A noise function that is periodic relative to theta (consequently: no sharp edge)
    // It is centered around 0 and is between - 1 and 1 (roughly)
    index = index? index : 0;
    sharpness = sharpness? sharpness : 1;
    time = time? time: 0;
    
    return 2 * (
        - 0.43
        + noise(index, sharpness * theta, time) * Math.pow(sin(theta/2),2)
        + noise(index + 1, sharpness * ((-theta+3*PI) % TWO_PI), time) * Math.pow(sin((theta+PI)/2),2)
    )
}

function lerpValue(f, t, amount){
    let new_value = null;
    try {
        new_value = lerpColor(f, t, amount);
    } catch (e) {
        new_value = lerp(f, t, amount);
    }
    return new_value || t;
}

function lerpObject(from, to, amount){
    from = from? from: {};
    
    let new_object = {};
    Object.keys(to).forEach(key => {
        new_object[key] = lerpValue(from[key], to[key], amount)
    });
    return new_object;
}


// MAIN CLASS DEFINED HERE
class EmotiveBlob {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.index = Math.floor(this.x + this.y);
        this.currentTimer = 0;
        this.anger = 0;
        this.resentment = random(0.96, 0.99)

        this.emotions = {
            "calm": {
                'color': color(70,132,153),
                'amplitude_ratio': 0.2,
                'speed': 3,
                'sharpness': 1
            },
            "angry": {
                'color': color(230,20,30),
                'amplitude_ratio': 0.4,
                'speed': 15,
                'sharpness': 5
            }
        }
    }

    intersects(mouseEvent){
        let distance = dist(this.x, this.y, mouseEvent.offsetX, mouseEvent.offsetY)
        return distance <= this.radius;
    }

    trigger(anger){
        if(random() < anger && anger > this.anger) {
            this.emotion = "angry";
            if(random() > 0.9) {
                // sometimes even the slightest perturbation can trigger rage
                // fortunatly this is rare
                this.anger = 1;
            }
            else {
                this.anger = anger;
            }
            this.propagate_anger = true;
        }
    }

    findNeighbors(blobs){
        this.neighbors = [];
        blobs.forEach(blob => {
            if(blob != this) {
                let distance = dist(this.x, this.y, blob.x, blob.y);
                if(distance < (this.radius + blob.radius) * 1.5){
                    this.neighbors.push(blob)
                }
            }
        })
    }


    update() {
        this.anger = this.anger * this.resentment;
        if(this.anger < 0.01) {
            this.anger = 0;
        }
        if(this.anger > 0.1 && this.propagate_anger && random() > 0.9){
            this.neighbors.forEach(blob => blob.trigger(this.anger * 0.8))
            this.propagate_anger = false;
        }

        if(this.anger > 0) {
            this.behavior = lerpObject(this.emotions['calm'], this.emotions['angry'], this.anger);
        }
        else {
            this.behavior = this.emotions['calm']
        }
    }

    render() {
        let currentRadius = this.radius,
            currentAmplitude = currentRadius * this.behavior.amplitude_ratio,
            currentColor = this.behavior.color,
            sharpness = this.behavior.sharpness;
        this.currentTimer += this.behavior.speed / 100;

        push();
        translate(this.x, this.y)
        noStroke();
        fill(currentColor);
        
        beginShape();
        let npts = 20,
            theta = 0,
            r = 0,
            r_noise = 0;
        for(let i=-1; i<=npts+1; i++){
            theta = i * TWO_PI / npts;
            r_noise = make_noise(theta, sharpness, this.currentTimer, this.index);
            r = currentRadius + currentAmplitude * r_noise;
            curveVertex(r * cos(theta), r * sin(theta))
        }
        endShape();

        pop();
    }
}