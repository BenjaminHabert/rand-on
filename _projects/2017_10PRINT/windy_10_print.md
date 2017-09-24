---
layout: post
date: 2017-09-24
title: Windy 10 PRINT
thumbnail: 4.png
dependencies:
     - p5
galleries:
    - name: 10print
      files:
        - 1.png
        - 2.png
        - 3.png
---

{% include sketch.html file="windy_10_print.js" id="sketchdiv" %}

This is a variation on the **10 PRINT** idea developed in the aptly titled
[10 PRINT](https://10print.org/) book where a one-line command is used to generate
random patterns (thank you Dan Shiffman for showing the book in one of
[your videos](https://youtu.be/PQwfop4bewM?t=55m18s)).

Instead of creating an endless stream of shapes, this variation considers the canvas
as a delimited space that is evolving with time. I tried to mimic the impression of
wind gusting over a field.

{% include code.html file="windy_10_print.js" %}

### Example results

{% include gallery.html gallery="10print" %}

### The original 10 PRINT command

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/m9joBLOZVEo" frameborder="0" allowfullscreen></iframe></center>
