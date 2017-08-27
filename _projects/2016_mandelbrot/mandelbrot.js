var sketch = function(p) {
	/*
	Author: Benjamin Habert
	Date: 2016/06/13
	File: mandelbrot.js
	This sketch allows exploration of the mandelbrot set.
	You can zoom in by clicking and zoom out by double-clicking.
	requires:
		- p5.js
	*/

	var buffer;		// image that renders the mandelbrot set

	var default_center = [-0.5, 0];  // zoom parameters
	var center = [default_center[0], default_center[1]];
	var default_span = 3;
	var span = default_span;

	var framesSinceClick=0; // to check for double-click
	var maxFrames = 10;  	// to check for double-click

	var mandelbrotMaxIter = 100;  // parameters for the mandelbrot computation
	var mandelbrotInfinity = 30;

	p.setup = function() {
		p.createCanvas(500, 500);
		p.pixelDensity(1);
		p.rectMode(p.CENTER);
		buffer = p.createImage(p.width, p.height);
		p.drawBuffer();  // render the mandelbrot set on startup
	};

	p.draw = function() {
		if(framesSinceClick < maxFrames) {
			framesSinceClick ++;
		}
		// show the mandelbrot set
		p.image(buffer, 0, 0);
		// show rectangle where the mouse is (for the zoom)
		p.stroke(250, 100, 100);
		p.noFill();
		if (p.mouseInside()) {
			p.rect(p.mouseX, p.mouseY, p.width/2, p.height/2);
		}
	};

	p.mouseClicked = function() {
		if (p.mouseInside()) {
			if(framesSinceClick >= maxFrames) {
			// if the last click was a long time ago: zoom to the clicked position
				framesSinceClick = 0;
				// set the new center : translate mouse coordinate to relative coordinate
				center = [
					p.map(p.mouseX, 0, p.width, center[0] - span/2.0, center[0] + span/2.0),
					p.map(p.mouseY, 0, p.height,center[1] - span/2.0, center[1] + span/2.0)
				];
				// set the new zoom level
				span = span/2.0;
			}
			else{
			// else: reset the zoom to its default value
				center =  [default_center[0], default_center[1]];
				span = default_span;
			}
			p.drawBuffer();
		}
	};

	p.drawBuffer = function(){
		// This function renders the mandelbrot set on the buffer for the
		// current zoom level

		// pixel management:
		var x;
		var y;
		var pixelIndex;

		// result of mandelbrot computation:
		var n;

		// for the color:
		var col;
		var t;
		var to = p.color(218, 165, 32);
		var from = p.color(72, 61, 139);

		buffer.loadPixels();
		for(var j=0; j<buffer.width; j++) {
			for(var i=0; i<buffer.height; i++) {
				// translate pixel coordinates to relative coordinate
				x = p.map(j, 0, buffer.width, center[0] - span/2.0, center[0] + span/2.0);
				y = p.map(i, 0, buffer.height, center[1] - span/2.0, center[1] + span/2.0);
				// DO COMPUTATION !
				n = p.computeMandelbrot(x, y);
				// Set color according to result (max iter -> black)
				if (n==mandelbrotMaxIter) {
					col = p.color(0, 0, 0);
				}
				else{
					t = mandelbrotMaxIter/5;
					col = p.lerpColor(from, to, p.map(n%t, 0, t, 0, 1));
				}
				pixelIndex = 4  * (i*buffer.width  + j);
				buffer.pixels[pixelIndex + 0] = col.levels[0];
				buffer.pixels[pixelIndex + 1] = col.levels[1];
				buffer.pixels[pixelIndex + 2] = col.levels[2];
				buffer.pixels[pixelIndex + 3] = 255;
			}
		}
		buffer.updatePixels();
	};

	var n;
	var f_real;
	var f_imag;
	var f_square_real;
	var f_square_imag;
	p.computeMandelbrot = function(x, y) {
		// compute the maximum number of iterations n to reach infinity
		// starting from c = x + i * y
		n = 0;
		f_real=0;
		f_imag=0;
		f_square_real=0;
		f_square_imag=0;
		while(n < mandelbrotMaxIter) {
			// compute f = f^2 + c
			f_square_real = f_real*f_real - f_imag*f_imag
			f_square_imag = 2*f_real*f_imag
			f_real = f_square_real + x
			f_imag = f_square_imag + y
			if(p.sqrt(f_real*f_real + f_imag*f_imag) > mandelbrotInfinity) {
				// we have reached a big number
				break;
			}
			n ++;
		}
		return n;
	};

	p.mouseInside = function() {
		return p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height;
	};
};

new p5(sketch, "canvas_div");
