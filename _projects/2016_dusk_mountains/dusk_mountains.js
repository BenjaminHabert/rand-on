var sketch = function(p) {
	/*
	Author: Benjamin Habert
	Date: 2016/06/20
	File: dusk_mountains.js
	Shows  procedurally generated montains at dusk.
	click to set to new values
	see at: http://www.rand-on.com/#/duskmountains/
	requires:
		- p5.js
	*/

	// PARAMETERS
	var nMountains = 4;
	var nPoints = 200;  // from left to right
	var mountainStart = 0.8;  // fraction of height
	var mountainEnd = 0.2;  // fraction of height
	var amplitudeStart = 0.2;
	var amplitudeEnd = 0.4;
	var stepStart = 0.05;
	var stepEnd = 0.01;
    var backColor = "#f1d7b9";
    var lastColor = "#1f3c4a";

	p.setup = function() {
		p.pixelDensity(1);
		var w = decideMainWidth(800);

	  	p.createCanvas(w, w * 3/5);
	  	p.background(0);
	  	p.ellipseMode(p.CENTER);
	  	// p.noiseDetail(50,0.4);
        p.backColors = [
            p.color(218, 165, 32),
            p.color("#f1d7b9")
        ]
        p.frontColors = [
            lastColor = p.color(30, 30, 70),
            p.color("#1f3c4a")
        ]
	};

	function newMountainsParams(){
		p.noiseSeed(p.frameCount);
		nMountains = p.floor(p.random(3, 8));
		mountainStart *= p.random(0.95, 1.05);  // fraction of height
		mountainEnd *= p.random(0.95, 1.05);  // fraction of height
		amplitudeStart *= p.random(0.95, 1.05);
		amplitudeEnd *= p.random(0.95, 1.05);
		stepStart *= p.random(0.95, 1.05);
		stepEnd *= p.random(0.95, 1.05);
        backColor = p.random(p.backColors);
        lastColor = p.random(p.frontColors);
	}

	function drawMontain(position, amplitude, step, z){
		var mountain = [];
		var moyenne = 0;
		for (var i=0; i<=nPoints; i++){
			var v = p.height*amplitude*p.noise(i*step, 100*z);
			moyenne += v;
			mountain[i] =  v;
		}
		moyenne = moyenne/mountain.length
		var delta = (mountainEnd - mountainStart)/nMountains;
		for (var i=0; i<=nPoints; i++) {
			mountain[i] = p.height*(1-position) + mountain[i]-moyenne + p.map(p.noise(z), 0, 1, -delta, delta);
		}
		p.beginShape();
		p.vertex(0, p.height);
		for (var i=0; i<=nPoints; i++){
			p.vertex(i/nPoints*p.width, mountain[i]);
		}
		p.vertex(p.width, p.height);
		p.endShape(p.CLOSE);
		p.line(10, 10, 50, 50);
	}



	p.draw = function() {
		var firstColor = p.lerpColor(p.color(lastColor), p.color(backColor), 0.8);

		p.background(backColor);
		p.noStroke();
		for (var i=nMountains; i>=0; i--) {
			var ratio = i/nMountains
			p.fill(p.lerpColor(lastColor, firstColor, ratio));
			var pos = p.map(ratio, 1, 0, mountainStart, mountainEnd)
			// var delta = (mountainEnd - mountainStart)/2/nMountains;
			// pos += p.random(-delta, delta);
			var amp = p.map(ratio, 1, 0, amplitudeStart, amplitudeEnd);
			var step = p.map(ratio, 1, 0, stepStart, stepEnd);
			p.noiseDetail(p.map(ratio, 1, 0, 70, 10), p.map(ratio,1,0,0.3,0.7));
			drawMontain(pos, amp, step, i);
		}
	};

	// MOUSE EVENTS
	p.mousePressed = function(mouseEvent){
	    if(isInside(p.mouseX, p.mouseY)) {
	    	newMountainsParams();
	    }
	};

	p.mouseMoved = function() {
	};

	// MOBILE EVENTS
  	p.touchStarted = function(touchEvent){
    	// if two fingers touch: reset
    	if (p.touches.length > 1) {
      		// check that one of them is inside
      		for (var i=0; i<p.touchep.length; i++){
        		var touch = p.touches[i];
        		if (isInside(touch.x, touch.y)) {
          		// restart the sketch ?
          			return;
        		}
      		}
    	}
    	else{
    		if (isInside(p.touchX, p.touchY)){
    			newMountainsParams();
    		}
    	}
  	};

  	p.touchMoved = function(touchEvent){
    	if (isInside(p.touchX, p.touchY)) {
      		// if the user is not moving a lot: do the processing
      		if (p.dist(p.touchX, p.touchY, p.ptouchX, p.ptouchY) < 10){
        		// return false; //THIS PREVENTS THE USER FROM SCROLLING
      		}
    	}
  	};

	// UTILITY FUNCTIONS
  	decideMainWidth = function(max_width){
	    // decide on sketch width
	    var disp = p.floor(p.min(p.displayWidth, p.displayHeight, p.windowWidth, p.windowHeight)*0.9);
	    // var win  = p.min(p.windowWidth , p.windowWidth);
	    var main_width = p.min(disp, max_width);
	    return main_width;
  	};

  	isInside = function(x, y){
    	return x >= 0 && x <= p.width && y >= 0 && y <= p.height;
  	};
};

// wait for DOM to load and then create p5 sketch
var timer_test_sketch = setInterval( function () {
     if ( document.readyState !== 'complete' ) return;
     clearInterval( timer_test_sketch );

     // new p5(<function that takes p5 as arg>, <"id of the div to use">);
     var temp = new p5(sketch,"dusk");
 }, 100 );
