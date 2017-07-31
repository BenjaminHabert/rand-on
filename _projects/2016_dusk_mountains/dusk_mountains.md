---
layout: post
date: 2016-06-20
title: Dusk Mountains
galleries:
    - name: mountains
      files:
        - pinkish.png
        - purple.png
        - yellow_greenish.png
        - yellow_many.png
thumbnail: thumbnail.png
dependencies:
     - p5
---
Click on the image to generate new mountains:
{% include sketch.html file="dusk_mountains.js" id="dusk"%}

I had the idea to draw something that looked like a landscape of mountains just after
the sun set. Without any cloud there is a [faint haze that conceal details](https://www.google.fr/search?q=mountains+at+dusk&tbm=isch&tbs=rimg:Cc2jt7azzgHXIjjzZQNnJjGhX0UAG2da1g6uMlkwmrqs77rry0Ju7GdaLwVtNQIonaEolOnqjOmGePUE5gJzbaAzCSoSCfNlA2cmMaFfEazLGfrtT7JtKhIJRQAbZ1rWDq4Rv3FEEHAnCX8qEgkyWTCauqzvuhHEdyH_1Zc0N2ioSCevLQm7sZ1ovEePhMIFJNzZFKhIJBW01AiidoSgRePk80glIAkwqEgmU6eqM6YZ49RH_1qa6rqldUUyoSCQTmAnNtoDMJES5wMDKavDM8&tbo=u&sa=X&ved=0ahUKEwiS-J_subTVAhUHXBoKHfcfDCUQ9C8IHA&biw=1600&bih=795&dpr=1.6) of peaks and trees
as the mountains get further.

The program generates between 3 and 8 ridges that are further and further away from the observer.
The details of each ridge get more and more blurry. This is done by using the Perlin [`noise()`](https://p5js.org/reference/#/p5/noise) function
and varying the parameters of [`noiseDetail()`](https://p5js.org/reference/#/p5/noiseDetail).

{% include code.html file="dusk_mountains.js" %}

### Example of output
{% include gallery.html gallery="mountains" %}
