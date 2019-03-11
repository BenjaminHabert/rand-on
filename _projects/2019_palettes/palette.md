---
layout: post
date: 2019-03-09
title: Palettes
subtitle: "p5.js"
thumbnail: palette.png
dependencies:
  - p5
  - p5.dom
galleries:
    - name: gallery
      files:
        - canvas1.png
        - canvas2.png
        - canvas3.png
        - canvas4.png
        - canvas5.png
        - canvas6.png
---

I don't know anything about color composition.

In this sketch I am experimenting with simple rules for a three-color composition:
 - a base color
 - a complementary color with opposing hue
 - an accent color with higher brightness and saturation
 
{% include sketch.html file="sketch.js" id="p5sketch"%}
<center><div id="sliders" class="col-md-10" style="margin: 10px; padding: 10px;"></div></center>
{% include code.html file="sketch.js" %}


### Example of output
{% include gallery.html gallery="gallery" %}
