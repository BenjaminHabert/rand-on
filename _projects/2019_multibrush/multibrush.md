---
layout: post
date: 2019-04-21
title: Multiple Brushes
subtitle: "p5.js"
thumbnail: circles.png
dependencies:
     - p5
galleries:
    - name: gallery
      files:
        - circles.png
        - sun_and_ground.png
        - crossed.png
        - crossed_winter.png
---

<script src="utils.js"></script>
<script src="shape.js"></script>
<script src="brush.js"></script>
{% include sketch.html file="sketch.js" id="p5sketch"%}

{% include code.html file="sketch.js" %}


### Example of output

Checkout [this pull request](https://github.com/BenjaminHabert/rand-on/pull/2) to see how each file was generated.

{% include gallery.html gallery="gallery" %}
