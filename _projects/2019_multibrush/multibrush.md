---
layout: post
date: 2019-04-21
title: Multiple Brushes
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

<script src="utils.js"></script>
<script src="shape.js"></script>
<script src="brush.js"></script>
{% include sketch.html file="sketch.js" id="p5sketch"%}

{% include code.html file="sketch.js" %}


### Example of output
{% include gallery.html gallery="gallery" %}

### Ce dont j'ai besoin pour dessiner:

shapeDrawer:

- arguments:
  - paramètres de la forme:
    - comment choisir un (deux?) points au hasard
    - contraintes sur l'angle des traits (angles?; choix de horizontal / vertial / random)
  - paramètres des traits:
    - couleurs
    - épaisseur
    - longueur


Je veux une forme composée de longs traits horizontaux qui rentrent dans un carré

Je veux une forme ronde composée de gros traits rouges horizontaux avec des petits traits orange verticaux

Je veux une forme gaussienne avec des petits traits dans tous les sens de deux couleurs proches

Une forme est composée de traits

Shape:
  - draw() -> dessine un trait
    - while 10:
      - choisi le point de début du trait
      - créé un nouveau trait -> cela détermine la fin du trait
      - est-ce que ce trait est compatible avec la forme ?
      - si oui on le dessine et on sort de la boucle
    - on met à jour le fill_ratio de la forme

Stroke:
  - draw() -> ça le dessine
  - new -> créé un nouveau trait qui prend en compte les contraintes

  - couleurs + probabilités
  - comment tracer des traits:
    - on veut une forme
    - on veut des contraintes sur les traits 
    - on veut des paramètres de brush: taille, couleur
