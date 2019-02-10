# Find my nearest recycling bin

...and other features (currently supports e-waste and 2nd hand collection points)  

Disclaimer: This repo contains a lot of bad software engineering decisions and practices

---

I learn webpack.  
Also an excuse to play with deck.gl

---

## datasets
Get your datasets from data.gov.sg

* https://data.gov.sg/dataset/recycling-bins
* https://data.gov.sg/dataset/2nd-hand-goods-collection-points
* https://data.gov.sg/dataset/e-waste-recycling


## todo

### webpack
[x] basic webpack config  
[x] dev server + hot reloading  
[] webpack config for prod

### deck.gl
[x] read all bins from geojson and dump on map as is  
[] heatmap?  
[x] calculate distance  
[] click data point to pan + show info about data point  
[] hack together something to show route on map to selected data point