---
layout: post
date: 2018-06-17
title: Rain
galleries:
    - name: rain
      files:
        - rain1.png
        - rain2.png
        - rain3.png
dependencies:
     - p5
     - p5.sound
thumbnail: rain1.png
---

This uses javascript ES6 features and might not work on all browsers.

{% include sketch.html file="rain.js" id="p5sketch"%}

{% include code.html file="rain.js" %}

I have zero experience working with audio and I realize that it is
really hard to integrate even the simplest of sound.

### Example of output

{% include gallery.html gallery="rain" %}
