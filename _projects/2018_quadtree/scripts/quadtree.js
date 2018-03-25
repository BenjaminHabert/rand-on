class Rectangle {
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || width;
        this.h = h || height;
    }

    contains(point) {
        return (
            point.x >= this.x
            & point.x < this.x + this.w
            & point.y >= this.y
            & point.y < this.y + this.h
        )
    }

    split() {
        let x = this.x,
            y = this.y,
            w = this.w / 2,
            h = this.h / 2;
        let subRectangles = [
            new Rectangle(x, y, w, h),
            new Rectangle(x, y + h, w, h),
            new Rectangle(x + w, y, w, h),
            new Rectangle(x + w, y + h, w, h),
        ];
        return subRectangles;
    }

    draw() {
        // rect(this.x, this.y, this.w, this.h);
        ellipseMode(CORNERS);
        ellipse(this.x, this.y, this.x + this.w, this.y + this.h)
    }
}


class QuadTree {
    constructor(capacity, bounds, col) {
        this.bounds = bounds || new Rectangle();
        this.capacity = capacity || 1;
        this.color = col || color(0, 0, 255, 255);

        this.points = [];
        this.subtrees = [];
    }

    isSplitted() {
        return this.subtrees.length > 0;
    }

    insert(point) {
        if(this.bounds.contains(point)) {
            if(!this.isSplitted()) {
                this.points.push(point);
                this.color = point.color;
                if(this.points.length > this.capacity) {
                    this.split();
                }
            }
            else {
                this.subtrees.forEach(tree => tree.insert(point));
            }
        }
    }

    split() {
        this.subtrees = this.bounds.split().map(bound => {
            // console.log(bound);
            let subtree = new QuadTree(this.capacity, bound, this.color);
            this.points.forEach(point => subtree.insert(point));
            return subtree;
        });
        this.points = [];
    }

    draw() {
        noStroke();
        // fill(255);
        // this.points.forEach(p => ellipse(p.x, p.y, 4, 4))
        if(!this.isSplitted()) {
            fill(this.color);
            this.bounds.draw();
        }


        this.subtrees.forEach(tree => tree.draw());
    }
}
