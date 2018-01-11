---
layout: post
title:  "Technical Newsletter"
date:   2017-02-01
thumbnail: newsletter.png
---

![](newsletter.gif)

I created a **[Newsletter Website](https://benjaminhabert.github.io/newsletter/)**
([github repo](https://github.com/BenjaminHabert/newsletter)) for internal use in my company.

This article will explain why and how I built the website. The most interesting part of this project
is described at the end: how to **implement a crude searchable list of articles** using
[TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) so that the most relevant articles are first.

## Why ?

I joined [Quantmetry](https://www.quantmetry.com/) in mid-2015. We were only 15 at the time. Soon after
I decided to send to other team members a technical newsletter every few weeks containing interesting
articles / tutorials found on the web. These were only word documents that we would share over e-mail.

Unefortunately the newsletters were mostly useful to me: I would sometimes go back to find a resource for a particular
project I would be working on. It was easy for my as I had all the documents archived on my computer.
However for others this would require tedious sifting of their inbox. Consequently I decided to
migrate the content of all these word documents to the web to make them more accessible. It was also
an oportunity for learning some basic web dev.

## Requirements

- the following newsletter will still be written as word documents
- adding new content to the website once a new document is written should not require any effort
- the website itself must not be complicated (I didn't know a lot about web development at the time)
- the website must consist of a list of items that can be searched

## Building the website

The content of the website (articles and images) is rather small. The articles of the newsletter
are composed of
1. text and metadata: all the articles are saved in a Json file
2. images: they are saved on there own. At the moment there are about 100 images totaling 42 Mb.

Consequently I decided not to use a database: all the content is stored alongside the website which
is hosted by [github-pages](https://pages.github.com/).


### Step 1: extracting content from the documents

Text, images, links and metadata are extracted from the word documents with a Python script. First,
using [mammoth](https://pypi.python.org/pypi/mammoth) the document in converted to an html string.
Then the HTML is parsed using a few regular expressions to split the page in several articles.

I seem to remember that I also tried the package [python-docx](https://python-docx.readthedocs.io/en/latest/)
or [docx](https://pypi.python.org/pypi/docx) but mammoth was more convienent in the way it handles
images. This allowed me to save the images as png in a different folder.

*TODO: Finish the article!*
