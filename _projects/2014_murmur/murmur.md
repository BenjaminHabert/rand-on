---
layout: post
title:  "MurMur"
date:   2014-11-22
thumbnail: murmur.png
dependencies:
    - p5
    - p5.sound

galleries:
    - name: murmur
      files:
        - murmur_gallery/1.png
        - murmur_gallery/2.png
        - murmur_gallery/3.png
        - murmur_gallery/4.png
        - murmur_gallery/5.png
        - murmur_gallery/6.png
---

make noise to interact (make sure your mic is enabled)

**Note**: This example might not work on all browsers as using the microphone sometimes requires https which is not available here as of now.

{% include sketch.html file="murmur.js" id="murmur_tentacules"%}

{% include code.html file="murmur.js" %}


I had the opportunity to participate in a workshop organized at [La Gaîté Lyrique](https://gaite-lyrique.net/atelier/murmur-du-son-a-la-lumiere-avec-du-code), Paris. The workshop was lead by [Julien Gachadoat](http://www.v3ga.net/blog2/), one of the creator of MurMur, an interactive installation that responds to sound. During the workshop, Julien showed us how to implement a javascript code that would drive the visual part of the installation. I decided to port the code I wrote to p5.js. Although the rendering is not as good as with the openFrameworks engine written by Julien, this will give you an idea of what is possible.



{% include gallery.html gallery="murmur" %}


Here is what the actual MurMur installation is:

<center><iframe src="https://player.vimeo.com/video/67242728?color=ffffff&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</center>

more info [here](http://www.v3ga.net/blog2/2013/06/murmur/).
