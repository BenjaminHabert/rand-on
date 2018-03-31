var raw;
var processed;
var images;

var w = h = 300;


function preload() {
  images = [
    loadImage('images/flower.png'),
    loadImage('images/alexandre.png'),
  ];
  raw = images[0];
}

function setup() {
  processed = createImage(w, h);

  createCanvas(3 * w, 2 * h).parent('p5sketch');
}

function mouseClicked(){
  if (mouseX > 0 & mouseX < width & mouseY > 0 & mouseY < height) {
    raw = raw == images[0] ? images[1]: images[0];
  }
}

function get_blur(){
  var elt = document.getElementById('blur')
  return int(elt.value)
}

function get_threshold(){
  var elt = document.getElementById('threshold')
  return float(elt.value)
}

function get_erode(){
  var elt = document.getElementById('erode')
  return elt.checked
}


function draw() {
  background(0)
  textSize(16)
  fill(255)
  var info = ""
  var t1 = performance.now()

  var t0 = performance.now()
  image(raw, 0, 0);
  info = "raw " + (performance.now() - t0).toFixed(1) + " ms"
  text(info, 10, 16)


  t0 = performance.now()
  do_grey();
  image(processed, w, 0);
  info = "gray " + (performance.now() - t0).toFixed(1) + " ms"
  text(info, w + 10, 16);

  t0 = performance.now()
  do_blur();
  image(processed, 2 * w, 0);
  info = "blur (radius=" + get_blur() + ') ' + (performance.now() - t0).toFixed(1) + " ms"
  text(info, 2 * w + 10, 16)


  t0 = performance.now()
  do_sobel();
  image(processed, 0, h);
  info = "sobel " + (performance.now() - t0).toFixed(1) + " ms"
  text(info, 10, h + 16)


  t0 = performance.now()
  do_thinning();
  image(processed, w, h);
  info = "thinning (" + get_erode() + ') ' + (performance.now() - t0).toFixed(1) + " ms"
  text(info, w + 10, h + 16)

  t0 = performance.now()
  do_threshold();
  image(processed, 2 * w, h);
  info = "threshold (" + get_threshold().toFixed(2) + ') ' + (performance.now() - t0).toFixed(1) + " ms"
  text(info, 2 * w + 10, h + 16)


  info = 'Total Time: ' + (performance.now() - t1).toFixed(0) + " ms"
  text(info, 10, 2 * h - 3);
  text("frameRate: " + frameRate().toFixed(1), w, 2 * h - 3)
}

function do_grey() {
  processed.copy(raw, 0, 0, w, h, 0, 0, w, h);
  processed.filter(GRAY);
}

function do_blur(){
  var r = get_blur()
  if (r > 0) {
    processed.filter(BLUR, r);
  }
}

function do_sobel() {
  apply_sobel_filter(processed);
}

function do_thinning() {
  if (get_erode()) {
    processed.filter(ERODE)
  }
}

function do_threshold(){
  processed.filter(THRESHOLD, get_threshold());
}

function copy_from_to(from, to) {
  to.copy(from, 0, 0, w, h, 0, 0, w, h);
}
