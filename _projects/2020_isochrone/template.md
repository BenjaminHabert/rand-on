---
layout: post
date: 2020-07-01
title: isochrone
subtitle: "transport, python, GTFS, cartography"
thumbnail: thumbnail.png
galleries:
    - name: gallery
      files:
        - 1.png
        - 2.png
        - 3.png
---

**Demo**: ~~[https://benjexperiments.tech/orleans/](https://benjexperiments.tech/orleans/)~~ (*edit: the server is off at the moment*)

![video showing an isochrone map of Orleans](demo.gif)


This website shows you how far you can travel in [Orléans](https://en.wikipedia.org/wiki/Orl%C3%A9ans) using public transportation. The result is an [isochrone map](https://en.wikipedia.org/wiki/Isochrone_map) that updates when the user changes:
- departure position
- departure time / day

The isochrone curves are computed using actual transportation data (tram and buses) from [transport.data.gouv.fr](https://transport.data.gouv.fr/datasets/donnees-du-reseau-tao-au-format-gtfs-orleans-metropole/)

The front-end ([github repository](https://github.com/BenjaminHabert/orleans_isochrone)) is a small **Vue.js** app that uses `leaflet` to display the map and the isochrone curves.

The back-end ([github repository](https://github.com/BenjaminHabert/gtfs-isochrone)) is built in **Python** and relies mainly on `pandas` and `geopandas`. The data source is and ensemble of static files (GTFS format) that describe the public transportation available on a given day and time of day. This data source is dynamically analysed to create the isochrone curves that describe how far one can travel during a given duration.


### Example of output
{% include gallery.html gallery="gallery" %}
