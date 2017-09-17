---
layout: post
date: 2017-09-17
title: Empathy Grid
galleries:
    - name: empathy
      files:
        - 1.png
        - 2.png
        - 3.png
        - 4.png
        - 5.png
        - 6.png
thumbnail: 4.png
dependencies:
     - p5
---
Click on blobs to anger them. Notice how anger is propagating between neighbors.

<script type="text/javascript" src="emotive-blob.js"></script>
{% include sketch.html file="emotive-blob-grid.js" id="p5sketch"%}

*Note*: this uses ES6 javascript.

{% include code.html file="emotive-blob-grid.js" %}
{% include code.html file="emotive-blob.js" %}

### Example of output
{% include gallery.html gallery="empathy" %}
