---
layout: post
title:  "Drawing Distributions"
subtitle: "stats, D3, teaching"
date:   2017-08-30
dependencies:
    - d3v4
thumbnail: distribution.png
---

Drag the mouse to draw the desired distribution function. Random numbers following
this distribution will be generated.

<div id="divford3"></div>
<link rel="stylesheet" type="text/css" href="distribution.css">
<script src="distribution.js"></script>

{% include code.html file="distribution.js" %}

This project was prompted by this tweet:

<center><blockquote class="twitter-tweet" data-lang="fr"><p lang="en" dir="ltr">Wish list: interactive widget that allows me to draw a density curve as below and get back dataset w/ the same shaped histogram <a href="https://twitter.com/hashtag/rstats?src=hash&amp;ref_src=twsrc%5Etfw">#rstats</a> <a href="https://t.co/MHj5oXMawj">pic.twitter.com/MHj5oXMawj</a></p>&mdash; Joyce Robbins (@jtrnyc) <a href="https://twitter.com/jtrnyc/status/902555145371865090?ref_src=twsrc%5Etfw">29 août 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>
