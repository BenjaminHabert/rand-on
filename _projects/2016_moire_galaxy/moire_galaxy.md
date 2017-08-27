---
layout: post
title:  "Moire Galaxy"
date:   2016-01-27
thumbnail: moire_galaxy.png
dependencies:
    - p5
galleries:
    - name: examples
      files:
        - 1.png
        - 2.png
        - 3.png
---

Move your mouse to interact; Notice the spirals that seem to appear out of nowhere.
Click to create new stars.
{% include sketch.html file="moire_galaxy.js" id="moire_div"%}

[This video](https://www.youtube.com/watch?v=QAja2jp1VjE) from the [Numberphile](https://www.youtube.com/channel/UCoxcjq-8xIDTYp3uz647V5A) channel inspired me to create this interactive script.

Two identical layers of random white dots are overlapped on top of a dark background. When the top layer is rotated and shrunk slightly, [Moiré patterns](https://en.wikipedia.org/wiki/Moir%C3%A9_pattern) arise. In this case, they take the shape of spirals.

{% include code.html file="moire_galaxy.js" %}

{% include gallery.html gallery="examples" %}
