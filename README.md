# Find my nearest recycling bin

...and other features (currently supports e-waste and 2nd hand collection points)  

Disclaimer: This repo contains a lot of bad software engineering decisions and practices

---

I learn webpack.  
Also an excuse to play with deck.gl

---

## Background
This project spawned from our team's annual Hackthon, where we decided to create a tool that allows users to find their nearest recycling bin in Singapore.

## Datasets
Get your datasets from data.gov.sg

* https://data.gov.sg/dataset/recycling-bins
* https://data.gov.sg/dataset/2nd-hand-goods-collection-points
* https://data.gov.sg/dataset/e-waste-recycling


## Todo

### Webpack
[x] basic webpack config  
[x] dev server + hot reloading  
[] webpack config for prod

### Deck.gl
[x] read all bins from geojson and dump on map as is  
[] heatmap?  
[x] calculate distance  
[] click data point to pan + show info about data point  
[] hack together something to show route on map to selected data point

## Refactor
[] Add redux - nearly everything is in Main.jsx, but it is difficult to separate them because most of them are tied to state changes
[] Lint
