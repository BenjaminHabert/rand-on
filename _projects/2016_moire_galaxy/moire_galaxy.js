var moire_sketch = function(s) {
  	/*
  	Author: Benjamin Habert
  	Date: 2016/01/27
  	File: random_moire_1.js
    This creates two identical layers of random white dots on a dark background.
    When the user moves the mouse, the top layers rotates and shrinks.
    This creates a Moire pattern that has the shape of a galaxy

  	uses p5:
  	https://github.com/processing/p5.js/releases/download/0.4.21/p5.min.js
  	*/

  var pg1;  // two graphs used to draw stars
  var pg2;
  var angle = 0;  // rotation angle (rad)
  var scaleFactor = 1.0;
  var movedRecently = 0;  // check if mouse has moved in recent frames
  var angle_max = 1.0;

  s.setup = function() {
    s.pixelDensity(1);
    var main_width = s.decide_main_width(600);
    s.createCanvas(main_width,main_width);
    s.frameRate(30);
    s.imageMode(s.CENTER);
    s.rectMode(s.CENTER);
    s.angleMode(s.RADIANS);
    s.resetPattern();
  };

  // UTILITY FUNCTIONS
  s.decide_main_width = function(max_width){
    // decide on sketch width
    var disp = s.min(s.displayWidth, s.displayHeight);
    var win  = s.min(s.windowWidth , s.windowWidth);
    var main_width = s.min(disp, max_width);
    return main_width;
  };

  s.isinside = function(x, y){
    return x >= 0 && x <= s.width && y >= 0 && y <= s.height;
  }

  // MOUSE EVENTS
  s.mousePressed = function(mouseEvent){
    if(s.isinside(s.mouseX, s.mouseY)) {
      s.resetPattern();
      // return mouseEvent;
    }
  };

  s.mouseMoved = function() {
    // get angle from mouse position
    s.processMouseMove(s.mouseX, s.mouseY, s.pmouseX, s.pmouseY);
  };

  // MOBILE EVENTS
  s.touchStarted = function(touchEvent){
    // if two fingers touch: reset
    if (s.touches.length > 1) {
      // check that one of them is inside
      for (var i=0; i<s.touches.length; i++){
        var touch = s.touches[i];
        if (s.isinside(touch.x, touch.y)) {
          s.resetPattern();
          return;
        }
      }
    }
  };

  s.touchMoved = function(touchEvent){
    // return false;  -> THIS PREVENTS THE USER FROM SCROLLING
    if (s.isinside(s.touchX, s.touchY)) {
      // if the user is not moving a lot: do the processing
      if (s.dist(s.touchX, s.touchY, s.ptouchX, s.ptouchY) < 10){
        s.processMouseMove(s.touchX, s.touchY, s.ptouchX, s.ptouchY);
        return false
      }
    }
  };

  // DRAWING - RELATED FUNCTIONS
  s.processMouseMove = function(x, y, px, py){
    if(s.isinside(x, y)) {
      var x0 = s.width/2;
      var y0 = s.height/2;
      mouseanglebefore = s.atan2(py - y0, px - x0);
      mouseanglenow = s.atan2(y - y0, x - x0);
      var delta_angle = s.constrain(mouseanglenow - mouseanglebefore, -0.1, 0.1);
      if(delta_angle * angle > 0){
        angle += delta_angle*(angle_max - s.abs(angle));
      }
      else {
        angle += delta_angle;
      }
      movedRecently = 15;
    }
  };

  s.drawShape = function(pg, x, y){
    pg.stroke(240, 240, 255, 200+50*s.randomGaussian());
    // pg.stroke(240, 240, 255, 200+50*s.randomGaussian());
    var min_stroke = 0.5;
    var max_stroke = 3;
    pg.strokeWeight(min_stroke + (max_stroke - min_stroke)*s.random());

    pg.point(5+x*(pg.width-10), 5+y*(pg.height-10));
  };

  s.resetPattern = function(){
    // decide graphics size
    var graph_size = s.round(s.width*0.9);
    if(pg1) {
      pg1.clear();
    }
    else {
      pg1 = s.createGraphics(graph_size,graph_size);
      pg1.clear();
    }
    // pg1.background(250, 250, 255, 250);
    for(var i=0; i<2000; i++) {
      s.drawShape(pg1, s.random(), s.random());
    }
    // pg1.ellipse(250, 250, 50, 50);
    if(pg2){
      pg2.clear();
    }
    else{
      pg2 = s.createGraphics(pg1.width, pg1.height);
    }
    pg2.background(0,0,0,100);
    pg2.image(pg1, 0, 0);
  };

  s.draw = function() {
    // we translate to center of frame
    // (notice that image and rect are in CENTER mode)
    s.push();
    s.translate(s.width/2, s.height/2);
    s.background(255, 255, 255, 255);

    if(pg1) {
      // when mouse stops moving: gradualy resets view to default
      if(movedRecently < 0){
        angle = s.float(angle)*0.95;
        if(s.abs(angle) < 0.00001) {
          angle = 0;
        }
      }
      else{
        movedRecently -= 1;
      }
      // first graph with black background
      s.fill(0, 0, 0, 200);
      s.noStroke();
      s.rect(0, 0, pg1.width, pg1.height);
      s.image(pg1, 0, 0);
      // second graph (slightly transparent background)
      s.push();
      s.rotate(angle);
      scaleFactor = 1 - 0.1*s.abs(angle);
      s.scale(scaleFactor, scaleFactor);
      s.image(pg2, 0, 0);
      s.pop();
    }
    s.pop();
  };


}; // END OF SKETCH

new p5(moire_sketch, "moire_div");
