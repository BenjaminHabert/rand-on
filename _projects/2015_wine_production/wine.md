---
layout: post
date: 2015-05-07
title: Wine Production
thumbnail: wine.png
dependencies:
    - d3v3
---

<center >
    <div id="mycanvas" >
    <script type="text/javascript" src="wine.js"></script>
    </div>
</center>

This represent the quantity of wine produced in France by wine type and
*departement* (~ region / state). Fun fact: my family produces
[Chablis](https://en.wikipedia.org/wiki/Chablis_wine)
in [Lignorelles](https://www.lesgrappes.com/vignerons/u/domaine-de-l-orme).

I created this visualisation in 2015 when I was learning d3. As you might notice
I was very excited by `transition()`! Data taken from
[data.gouv.fr](https://www.data.gouv.fr/fr/datasets/statistiques-viti-vinicoles-releves-annuels-des-stocks-et-des-recoltes/).


{% include code.html file="wine.js" %}
{% include code.html file="production_2013_numbers.json" %}
