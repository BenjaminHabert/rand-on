---
layout: post
date: 2019-04-21
title: Multiple Brushes
subtitle: "p5.js"
thumbnail: images/crossed_small.jpg
dependencies:
     - p5
     - p5.dom
galleries:
    - name: gallery
      files:
        - images/crossed.jpg
        - images/crossed_complete_6.jpg
        - images/line.jpg
        - images/circles.png
        - images/sun_and_ground.png
        - images/crossed.png
        - images/crossed_winter.png
---

In this sketch, I expand on the brush system created previously. I generate multiple
images that depend on two parameters. The images are then assembled in a grid.

<script src="js/generics/utils.js"></script>
<script src="js/generics/shape.js"></script>
<script src="js/generics/brush.js"></script>
<script src="js/experiments/cross.js"></script>
<script src="js/experiments/circles.js"></script>
<script src="js/experiments/lines.js"></script>
{% include sketch.html file="js/sketch.js" id="p5sketch"%}

{% include code.html file="js/sketch.js" %}
{% include code.html file="js/experiments/cross.js" %}

{% include code.html file="js/generics/brush.js" %}
{% include code.html file="js/generics/shape.js" %}
{% include code.html file="js/generics/utils.js" %}
{% include code.html file="assemble_images.py" %}


### Example of output

{% include gallery.html gallery="gallery" %}
