---
layout: post
date: 2019-04-21
title: Multiple Brushes
subtitle: "p5.js"
thumbnail: crossed_small.jpg
dependencies:
     - p5
     - p5.dom
galleries:
    - name: gallery
      files:
        - crossed.jpg
        - circles.png
        - sun_and_ground.png
        - crossed.png
        - crossed_winter.png
---

In this sketch, I expand on the brush system created previously. I generate multiple
images that depend on two parameters. The images are then assembled in a grid.

<script src="utils.js"></script>
<script src="shape.js"></script>
<script src="brush.js"></script>
{% include sketch.html file="sketch.js" id="p5sketch"%}

{% include code.html file="sketch.js" %}
{% include code.html file="brush.js" %}
{% include code.html file="shape.js" %}
{% include code.html file="utils.js" %}
{% include code.html file="assemble_images.py" %}


### Example of output

{% include gallery.html gallery="gallery" %}
