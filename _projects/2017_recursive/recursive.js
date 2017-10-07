/*
Expected behavior:
 - draws recursive circles in a given color palette
 - zooms towards the center
 - after some time: zooms back fast
 - restart with a different configuration
*/

var radius,
	radiusRatio,
	alternates,
	zoom,
	colors;

function setup(){
	createCanvas(600, 600).parent("#p5sketch");
	frameRate(30);
	colorMode(HSB)
	noStroke();
	reset();
}

function draw(){
	background(10);
	drawCircle(width/2, height/2, radius, 0);  // chaos machine

	if(zoom == "in") {
		radius *= 1.01;
		if(radius > 10000 * width / 2) {
			zoom = "out"
		}
	}
	else if(zoom == "out") {
		radius *= 0.9;
		if(radius < width/2){
			radius = width /2;
			zoom = "stay the same";
			setTimeout(reset, 1000);
		}
	}
}

function reset(){
	// create new colors and changes slighly the way the shape is generated
	colors = [];
	var hue = random(360);
	for(var i=0; i<5; i++){
		colors.push(color(hue + 2 *i, 20 + 10 * i, 80 - 8 *i))
	}
	radiusRatio = random(0.1, 0.9);
	alternates = int(random(2));
	radius = width/2;
	setTimeout(() => {zoom = "in"}, 1000);
}

function isOutside(x, y, r){
	return (x - r > width) || (x + r < 0) || (y - r > height) || (y + r < 0)
}


function drawCircle(x, y, r, i){
	if(! isOutside(x, y, r)) {  // saving the poor cpu from drawing unecessary circles
		fill(colors[i % colors.length])
		ellipse(x, y, 2 * r)
		if(r > 2) {
			var newRadius = r * radiusRatio,
				remaining = r * (1 - radiusRatio);
			if(alternates  && (i % 2) ){
				drawCircle(x -  remaining, y, newRadius, i+1);
				drawCircle(x + newRadius, y, remaining, i+1)
			}
			else{
				drawCircle(x +  remaining, y, newRadius, i+1);
				drawCircle(x - newRadius, y, remaining, i+1)
			}
		}
	}
}