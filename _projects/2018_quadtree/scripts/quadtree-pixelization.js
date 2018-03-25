let start = 0;
let images = [];
let imageIndex = 0;
let currentImage;
let qTree;
let pointPicker;
let desiredFrameRate = 10;


function preload() {
    let imageNames = [
        'input_images/flower.png',
        'input_images/alexandre.png',
        'input_images/mushroom.png',
        'input_images/paris.png',
    ]
    for (let imageName of imageNames){
        images.push(loadImage(imageName))
    }
}

function setup(){
    createCanvas(600, 600).parent("#p5sketch");
    frameRate(desiredFrameRate);
    reset();
}

function draw(){
    let seconds = (frameCount / desiredFrameRate) - start;
    if(seconds < 2){
        drawImage();
    }
    else if(seconds < 20) {
        drawQuadTree();
    }
    else if(seconds < 22) {
    }
    else if(seconds < 24) {
        drawQuadTree(false, true);
    }
    else {
        start = (frameCount / desiredFrameRate);
        reset();
    }
}

function reset(){
    // switches to next image and resets both the quadtree and the point picker
    noLoop();
    currentImage = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;
    pointPicker = new PointPicker(currentImage);
    qTree = new QuadTree();
    loop();
}

function drawImage() {
    image(currentImage, 0, 0);
}

function drawQuadTree(update=true, image=false) {
    if(update) {
        for (let i=0; i<10; i++) {
            let p = pointPicker.pick();
            qTree.insert(p);
        }
    }
    background(30);
    if(image) {
        drawImage();
    }
    qTree.draw();
}
