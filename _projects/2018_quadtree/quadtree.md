---
layout: post
date: 2018-03-24
title: QuadTree Pixelization
thumbnail: quadtree.png
dependencies:
     - p5
---

The image is being replaced by a *pixelated* version of itselft. Pixels are
represented by circles of varying sizes.

<script type="text/javascript" src="scripts/point-picker.js"></script>
<script type="text/javascript" src="scripts/quadtree.js"></script>
{% include sketch.html file="scripts/quadtree-pixelization.js" id="p5sketch"%}

The resulting figure uses a [quadtree](https://en.wikipedia.org/wiki/Quadtree) to partition the
space in smaller and smaller areas.
The quadtree is seeded by points chosen randomly in the original image. Each point carries
the local color of the image.

Notice that more circles are places in areas that have high contrast in the original image.
This is done by using weights (equal to
[local contrast](https://fr.wikipedia.org/wiki/D%C3%A9tection_de_contours#M%C3%A9thode_de_base))
when points are randomly chosen
(see implementation in `point-picker.js`).

The idea for this sketch came once again from
[one of Dan Shiffman's videos](https://www.youtube.com/watch?v=MxnqJGwu2cc&t=1242s).


{% include code.html file="scripts/quadtree-pixelization.js" %}
{% include code.html file="scripts/point-picker.js" %}
{% include code.html file="scripts/quadtree.js" %}
