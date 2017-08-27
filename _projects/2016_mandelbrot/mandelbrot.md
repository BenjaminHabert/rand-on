---
layout: post
title:  "Mandelbrot Set"
date:   2016-06-13
thumbnail: mandelbrot.png
dependencies:
    - p5
---

Click on the image to zoom in the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set). Double-click to reset.

{% include sketch.html file="mandelbrot.js" id="canvas_div"%}

I decided to implement my own version after watching [one of Daniel Shiffmann's
videos](https://www.youtube.com/watch?v=pLtViSqkPvQ).

{% include code.html file="mandelbrot.js" %}

![zooming in the mandelbrot set](mandelbrot.gif)
