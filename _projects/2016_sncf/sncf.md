---
layout: post
title:  "Mapping the French Railway Network"
subtitle: "Angular, Python, PostGIS, Geoserver, Plotly"
date:   2016-12-01
thumbnail: big_data_voie.png
---

![screen capture of the BigDataVoie website showing the rail network and interactive graphics](big_data_voie_640.gif)

## Mapping railways maintenance

Over the course of 6 months, with a small Quantmetry team, I worked on a project
for SNCF - the operator for the French railways. The goal of the project was to create a web application
that allowed SNCF to better understand the effort dedicated to infrastructure maintenance:
- cost of maintenance
- amount and type of operations performed
- evolution of the rail *health* over time (number and type of defects)

The website first shows **an overview as a map of the network**. On this map several indicators can
be projected; each kilometer of rail has a color defined by the value of the chosen indicator.
Furthermore, **a detailed view can be accessed by clicking on a portion of rail** several graphics
are plotted that show the available data at the finer level of detail.

The project was well received by our client. It is probably one of my favourite projects while working
at Quantmetry.


<center><blockquote class="twitter-tweet" data-lang="fr"><p lang="fr" dir="ltr">Le projet Big Data Voie présenté par Michel Morin et Benoît Calande <a href="https://twitter.com/hashtag/VivaSNCF?src=hash&amp;ref_src=twsrc%5Etfw">#VivaSNCF</a> <a href="https://twitter.com/SNCF_Digital?ref_src=twsrc%5Etfw">@SNCF_Digital</a> <a href="https://t.co/aACBjL8eHE">pic.twitter.com/aACBjL8eHE</a></p>&mdash; Nabila Zerkak (@nabilazerkak) <a href="https://twitter.com/nabilazerkak/status/875318922744147968?ref_src=twsrc%5Etfw">15 juin 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></center>

## Challenges

The main challenges for this project were data variety and specifications.

We used data coming from several systems used by **different business units at SNCF**. Unfortunately
the infrastructure is described differently by each business unit according to their need. For
instance operators that repair local defects on the rails measure the defects position with a high
accuracy whereas the financial department mostly cares about which account is in charge of repairing
this section of rail. Merging together these very different data sources was a big part of the project
but also one of the main results: it allows people from different backgrounds to share information
in a single interface whereas they used to work with distinct applications.

Deciding what would be shown in the application was not easy. Firstly SNCF uses very **specific
indicators** to measure the *health* of a given infrastructure. We had to make sur that the way we
computed these indicators from raw data was conforming to their specifications. The second difficulty
was making sure that we created **easy to understand graphics** showing detailed information.
We decided to split the graphics in several categories which roughly correspond to different
business units. We used existing graphics used in operations by our client as a reference to work from.


## Technical details

The project is composed of different parts which work together as an application.

- a **data-processing pipeling** was built (Python, [Pandas](https://pandas.pydata.org/)) that loads,
cleans and transform raw datasets in something that can be used by the rest of the application
- some of the resulting datasets are exposed in a **Postgre SQL** database ([PostGIS pluggin](https://postgis.net/))
- we used **[Geoserver](http://geoserver.org/)** to translate the PostgreSQL dataset into raster layers that show several
indicators projected onto the railways network. Note that the Geoerver configuration files are
dynamically generated from the Python pipeline
- we built a simple **Python API** with [bottle](https://bottlepy.org/docs/dev/) (I would use a more
complete framework if I was doing this project again) to return data for the detailed graphics. As a matter of
fact the API returns the data as well as a full description of the graphics as a JSON object
using the **[Plotly specification](https://plot.ly/)**.
- the front-end was built with **[Angular 1.5](https://angularjs.org/)**; we used **Leaflet** to handle the map and Plotly to show
the graphics.
