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
        - canvas7.png
    - name: bigs
      files:
        - canvas_big1.png
        - canvas_big2.png
---

I don't know anything about color composition.

In this sketch I am experimenting with simple rules for a three-color composition:

 - a base hue
 - complement hue and accent hue are opposite to the base hue but split by a small value
 
 <script src="selector.js"></script>
{% include sketch.html file="sketch.js" id="p5sketch"%}

<center><div id="sliders" class="col-md-10" style="margin: 10px; padding: 10px;"></div></center>

{% include code.html file="sketch.js" %}
{% include code.html file="selector.js" %}


### Examples of output

{% include gallery.html gallery="gallery" %}
{% include gallery.html gallery="bigs" %}
