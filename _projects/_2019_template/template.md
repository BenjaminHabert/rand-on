---
layout: post
date: 2019-01-01
title: template
subtitle: "p5.js"
thumbnail: template.png
dependencies:
     - p5
galleries:
    - name: gallery
      files:
        - 1.png
        - 2.png
        - 3.png
---

{% include sketch.html file="sketch.js" id="p5sketch"%}

{% include code.html file="sketch.js" %}


### Example of output
{% include gallery.html gallery="gallery" %}
