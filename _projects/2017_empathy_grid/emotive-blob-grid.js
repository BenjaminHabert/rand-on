
var w=600,
    h=600;
var blobs = [];

function setup(){
    createCanvas(w, h).parent("#p5sketch")
    angleMode(RADIANS)
    colorMode(RGB)
    frameRate(20);

    blobs = setupBlobGrid();
    blobs.forEach(blob => blob.findNeighbors(blobs));
    // at the begining: trigger anger in two blobs
    setTimeout(() => {
        blobs[Math.floor(random(blobs.length))].trigger(1);
        blobs[Math.floor(random(blobs.length))].trigger(1);
    }, 1000)
}

function setupBlobGrid(){
    let margin=50,
        nblobsX=10,
        blobsize = (w - 2 * margin) / nblobsX,
        blobradius = blobsize * 0.9 / 2,
        nblobsY = Math.floor((h - 2 * margin) / blobsize),
        marginY = (h - nblobsY * blobsize) / 2;

    let blobs = [];
    for(let nx = 0; nx < nblobsX; nx ++){
        let x = margin + blobsize / 2 + nx * blobsize;
        for(let ny = 0; ny < nblobsY; ny++){
            let y = marginY + blobsize / 2 + ny * blobsize;
            blobs.push(new EmotiveBlob(x, y, blobradius))
        }
    }
    return blobs;
}

function draw(){
    background(179,213,216);
    
    blobs.forEach(blob => blob.update());
    blobs.forEach(blob => blob.render());
}

function mouseClicked(mouseEvent){
    triggerBlobs(mouseEvent)
}

function mouseDragged(mouseEvent){
    triggerBlobs(mouseEvent)
}

function triggerBlobs(mouseEvent){
    blobs.forEach(blob =>{
        if(blob.intersects(mouseEvent)){
            blob.trigger(1);
        }
    })
}




