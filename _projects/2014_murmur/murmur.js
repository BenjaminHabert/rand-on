//pour afficher les tentacules
var sketch = function( s ){

	var time = 0;
	var timeIncrement = 0.01;
	var volume;
	var volArray = [];
	var nLines = 17;
    var mic = null;

	s.preload = function(){
        try{
            mic = new p5.AudioIn();
            mic.start();
        }
        catch (exception) {
            // unfortunately sound now requires https on many browser, which is not the
            // available on my github page as of now.
            console.log('Could not start mic: ' + exception)
        }
	}

	s.setup = function(){
		s.createCanvas(600,600, s.P2D);
		s.background(0);
		s.strokeCap(s.ROUND);
		s.frameRate(30);
		for(var i=0;i<64;i++) {
			volArray.push(0);
		}
	}

	s.draw = function(){
		updateTime();
		getSound();
		s.background(0,0,0,64);
		var angle = s.TWO_PI/nLines;
		for(var i=0;i<nLines;i++) {
			s.push();
			s.translate(s.width/2,s.height/2);
			s.rotate(i*angle);
			drawLine(i,angle);
			s.pop();
		}
		drawCircle();
	}

	function updateTime(){
		//time is used to draw noise in drawLine
		time+=timeIncrement;
	}

	function getSound(){
        var volume_t = 0;
		if(mic) {
             volume_t = mic.getLevel();
        }
		//smooth volume data
		if(s.abs(volume_t - volume) > 0.2) {
			volume_t = volume + (volume_t-volume)/s.abs(volume_t-volume)*0.2;
		}
		volArray.push(volume_t);
		volArray.shift();
		volume = volume_t;
	}

	function drawLine(index,maxTheta){
		var r, rNoise, t,tNoise, tVolume;
		s.noFill();
		s.beginShape();
		s.curveVertex(0,0);
		s.curveVertex(0,0);
		for(var i=1;i<volArray.length;i++){
            rNoise = 20 * s.noise(index, 2*time) - 10;
			r = s.height/2 * s.max(0, (i + rNoise))/volArray.length;

			tNoise = 1.3*(s.noise(index,time-(i)*timeIncrement)-0.5) * i/volArray.length;
            tVolume = 3 * volArray[volArray.length-i]*maxTheta * s.min(0.5, 0.1+ i/volArray.length);
			t = tNoise + tVolume

			s.stroke(150)
            s.strokeWeight(1)

            // this doesn't seem to work anymore; it seems like the properties cannot be changed while in the Shape().
            // stroke is white and thick in the center, goes to black and thin towards the edges
			// var st = s.int(255*(1.0-s.float(i)/volArray.length));
            // s.strokeWeight(s.lerp(8,1,i/volArray.length));

			s.curveVertex(r*s.cos(t),r*s.sin(t));
		}
		s.curveVertex(r*s.cos(t),r*s.sin(t));
		s.endShape();
	}

	function drawCircle(){
		s.stroke(255);
		s.strokeWeight(1+5*volume);
		s.fill(0);
		s.ellipse(s.width/2,s.height/2,30,30);

		s.noStroke();
		s.fill(255);
		s.ellipse(s.width/2,s.height/2,volume*30,volume*30);
	}

};

// wait for DOM to load and then create p5 sketch
var timer_test_sketch = setInterval( function () {
     if ( document.readyState !== 'complete' ) return;
     clearInterval( timer_test_sketch );
     console.log('starting sketch');

     // new p5(<function that takes p5 as arg>, <"id of the div to use">);
     var temp = new p5(sketch,"murmur_tentacules");
 }, 100 );
