---
layout: post
date: 2018-03-31
title: Edge Detection
thumbnail: edge_detection.png
dependencies:
     - p5
     - p5.dom
---

Change the paramters and see how it modifies the edge detection results. Click
to get a different image (images are 300 x 300 px).

<div id="controls" class="row">
  <div class="col-sm-4">
    <label>BLUR radius (px):</label>
    <input id="blur"
      type="range" min="0" max="3" step="1" value="1"/>
  </div>
  <div class="col-sm-4">
    <label>Erode ?</label>
    <input  id="erode"
      type="checkbox" checked="true"/>
  </div>
  <div class="col-sm-4">
    <label>Threshold:</label>
    <input  id="threshold"
      type="range" min="0" max="1" step="0.01" value="0.5"/>
  </div>
</div>
<script type="text/javascript" src="filter_sobel.js"></script>
{% include sketch.html file="edge_detection_test.js" id="p5sketch"%}

This is a work in progress for a proposed implementation of an
**edge detection filter** to add to the list of
[p5.js filters](https://p5js.org/reference/#/p5/filter). The idea is to rely
on existing filters. The
[standard method](https://en.wikipedia.org/wiki/Canny_edge_detector)
of doing edge detection is:

1. Apply a gaussian smoothing (already implemented by `img.filter(BLUR)`)
2. Compute the intensity gradient using a convolution with a 3x3 kernel (Sobel / Prewitt).
**This is what I am implementing here**.
3. Perform edge thinning. I am not sure but I think this is similar to what `img.filter(ERODE)` does
4. Apply threshold to have only white edges on black background (`img.filter(THRESHOLD)`)

To discuss the implementation please take a look at
[the opened issue on github](https://github.com/processing/p5.js/issues/2747).
and share your ideas.
The current implementation is shown below in `filter_sobel.js`.

{% include code.html file="filter_sobel.js" %}

The actual sketch that is using this function:

{% include code.html file="edge_detection_test.js" %}
