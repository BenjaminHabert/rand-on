---
layout: post
date: 2018-09-16
title: Lissajous Board
subtitle: "p5.js"
dependencies:
     - p5
     - p5.dom
thumbnail: lissajous.png
galleries:
  - name: lissajous
    files:
      - 1.png
      - 2.png
      - 3.png
      - 4.png
      - 5.png
---

A square variation on the
[Lissajous curves](https://en.wikipedia.org/wiki/Lissajous_curve).

<center>
  <label for="length">Tail length</label>
  <input type="range" id="length" name="length"
         min="1" max="500" value="100"/>
  <span>    </span>
  <input type="checkbox" id="show_point" name="show_point"
               value="scales" checked />
        <label for="show_point">Show points</label>

  <div id="p5sketch"></div>
  <script src="lissajous.js"></script>
</center>

{% include code.html file="lissajous.js" %}


### Examples of output

{% include gallery.html gallery="lissajous" %}
