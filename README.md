# Ubereats scrapy

<center>[OPEN VIZ](https://fabiancpl.github.io/ubereats-scrapy/visualization/)</center>

This repository contains the source code for a basic exercise of scraping, gecoding and visualization of restuarant data from the [Ubereats website](https://www.ubereats.com/co) in Colombia. The folder description is as follows:

- ubereatsscrapy: A python scrapy project for extracting the restaurant data from Ubereats and downloading in JSON format. The excercise can be reproduced by running ` scrapy crawl restaurants -o ../data/restaurants.json`
- geocoding: Using the Google Maps API, restaurant addresses are geocoded. A simple data cleaning and profiling is also performed. The libraries used are pandas, geopandas, pandas-profiling and googlemaps.
- data: Restaurant data stored for three different steps (JSON raw from Ubereats, JSON clean and GeoJSON clean for restaurants geocoded)
- visualization: A simple Javascript project for visualizing the result. This visualization is deployed [here](https://fabiancpl.github.io/ubereats-scrapy/visualization/). The libraries used are D3, Vega-Lite and Mapbox GL.

I was able to extract information for 1,181 restaurants in 9 colombian cities. This excercise can be extended by extracting similar information from the [Domicilios website](https://domicilios.com/), another popular website for food delivery.
