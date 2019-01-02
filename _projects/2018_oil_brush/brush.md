---
layout: post
date: 2018-12-28
title: Oil Brush
subtitle: "p5.js"
thumbnail: brush.png
dependencies:
     - p5
galleries:
    - name: gallery
      files:
        - brush.png
---

In this sketch I try to mimic the brush effect one might obtain using oil painting. The effect is obtained by
drawing many almost parallel paths for each stroke. Each path is drawn with a slight variation
in color.

{% include sketch.html file="sketch.js" id="p5sketch"%}
{% include code.html file="sketch.js" %}


### Example of output
{% include gallery.html gallery="gallery" %}
