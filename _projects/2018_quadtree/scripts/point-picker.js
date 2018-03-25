class Point {
    constructor(x, y, c){
        this.x = x;
        this.y = y;
        this.color = c;
    }
}

class PointPicker{
    /*
    provides a pick() function that returns points that are in the bound of an image
    It is more likely to return points that are in high contrast area of the image
    */

    constructor(img) {
        let result = this.computePointsAndWeights(img);
        this.points = result.points;
        this.weights = this.normalizeWeights(result.weights);
    }

    computePointsAndWeights(img){
        let points = [];
        let weights = [];

        img.loadPixels();
        for(let y=0; y<img.height; y++){
            for(let x=0; x<img.width; x++){

                let c = this.getColor(img, x, y);
                let weight = this.computeLocalWeight(img, x, y);

                // we add a small random noise to the point position
                // in order to avoid having many points in the same spot
                points.push(new Point(x + random(), y + random(), c));
                weights.push(weight);
            }
        }
        return {
            points: points,
            weights: weights
        }
    }

    getColor(img, x, y) {
        let index = (x + y * img.width) * 4;
        return color(img.pixels[index], img.pixels[index + 1], img.pixels[index + 2]);
    }

    getBrightness(img, x, y){
        return brightness(this.getColor(img, x, y));
    }

    computeLocalWeight(img, x, y){
        // computes a simplified local gradient
        // https://fr.wikipedia.org/wiki/D%C3%A9tection_de_contours#M%C3%A9thode_de_base
        let grad = 0;
        if(x > 0 && x < (img.width - 1)) {
            grad += Math.abs(this.getBrightness(img, x - 1, y) - this.getBrightness(img, x + 1, y))
        }
        if(y > 0 && y < (img.height - 1)) {
            grad += Math.abs(this.getBrightness(img, x, y - 1) - this.getBrightness(img, x, y + 1))
        }
        return grad;
    }

    normalizeWeights(weights) {
        let total = weights.reduce((a, b) => a + b);

        let current = 0;
        let normalized = weights.map(a => {
            current += a;
            return current / total;
        });

        return normalized;
    }

    pick() {
        return this.random(this.points, this.weights);
    }

    random(arr, weights) {
        let r = random();
        let index = weights.findIndex(x => x > r);
        return arr[index];
    }
}
