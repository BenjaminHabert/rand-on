let emotions = []

function setup() {
    createCanvas(600, 600).parent('p5sketch');
    background(0);
    for (let i = 0; i < 5; i++) {
        emotions.push(new Emotion(emotions));
    }
}

function draw() {
    background(200);

    stroke(0);
    for (let emotion of emotions) {
        emotion.evolve();

    }
    for (let emotion of emotions) {
        emotion.reveal();
    }



    if (frameCount > 2000) {
        noLoop();
    }
}


class Emotion {
    constructor(emotions) {
        this.x = random(width * 0.2, width * 0.8);
        this.y = random(height * 0.2, height * 0.8);
        this.offset = random(0, 100);
        this.feelings = [];
        this.emotions = emotions;
        const nFeelings = 30;
        for (let i = 0; i < nFeelings; i++) {
            const angle = TWO_PI / nFeelings * i;
            this.feelings.push(new Feeling(angle, this));
        }
    }

    evolve() {
        for (let i = 0; i < this.feelings.length; i++) {
            const previous = (i + this.feelings.length - 1) % this.feelings.length;
            const next = (i + 1) % this.feelings.length;
            const feeling = this.feelings[i],
                previousFeeling = this.feelings[previous],
                nextFeeling = this.feelings[next];
            const otherEmotions = this.emotions.filter(emotion => emotion !== this);
            feeling.react(previousFeeling, nextFeeling, otherEmotions);
        }
    }

    reveal() {
        noStroke();
        beginShape();
        for (let i = 0; i < 2; i++) {
            for (let feeling of this.feelings) {
                feeling.manifest();
            }
        }
        endShape(CLOSE)
    }
}

class Feeling {
    constructor(angle, emotion) {
        this.angle = angle;
        this.emotion = emotion;

        this.radius = 30;
        this.nextRadius = this.radius;
        this.pos = this.position();

        this.outgoingness = noise(this.pos.x, this.pos.y, this.emotion.offset);

        this.shyness = 10;
        this.fear = 0;
    }

    react(previous, next, otherEmotions) {
        const I = this,
            my = this;


        I.confrontOtherEmotions(otherEmotions)
        I.respectBoundaries();
        I.propagateFright(previous, next);

        let outwardEffort = (
            I.wantToMeetOthers()
            + I.adaptToOtherFeeling(previous)
            + I.adaptToOtherFeeling(next)
            - my.fear
        )

        my.nextRadius = max(my.nextRadius + outwardEffort, 0);
    }

    wantToMeetOthers() {
        return this.radius * (this.outgoingness - 0.4) / 50;
    }

    propagateFright(previous, next) {
        previous.fear += this.fear * 0.1
        next.fear += this.fear * 0.1
        this.fear = this.fear * 0.75
    }

    respectBoundaries() {
        if (this.pos.x > width * 0.9 || this.pos.x < width * 0.1) {
            this.fear = 1;
        }
        if (this.pos.y > height * 0.9 || this.pos.y < height * 0.1) {
            this.fear = 1;
        }

    }


    adaptToOtherFeeling(feeling) {
        return - (this.radius - feeling.radius) / 40
    }

    confrontOtherEmotions(otherEmotions) {
        sanity:
        for (let emotion of otherEmotions) {
            for (let otherFeeling of emotion.feelings) {
                if (this.isTooClose(otherFeeling)) {
                    this.fear = this.radius / 5;
                    break sanity;
                }
            }
        }
    }

    manifest() {
        this.radius = this.nextRadius;
        this.pos = this.position();
        curveVertex(this.pos.x, this.pos.y);
        point(this.pos.x, this.pos.y)
    }

    isTooClose(otherFeeling) {
        const d = dist(this.pos.x, this.pos.y, otherFeeling.pos.x, otherFeeling.pos.y);
        return d < 20;
    }

    position() {
        return createVector(
            this.emotion.x + cos(this.angle) * this.radius,
            this.emotion.y + sin(this.angle) * this.radius
        );
    }
}