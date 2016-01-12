Map over Kenya showing statistics over Government-funded projects

I have created a map showing
- projects
    each project
  
- county-boundaries with the choice of displaying
    number of projects per county
   
    
Language and libraries used
I choose to do a Node.js-application where the node-server is used to serve the source-data to the client through
HTTP-requests. In the front-end I choose to work with plain vanilla Java Script with the addition of a few libraries
to optimise the code (Browserify and Babel) and make Ajax-requests easier(PleaseAjax). I also use a few plugin-libraries
to Leaflet to make it possible to handle csv-data and make cluster-groups.

The application starts in the file 'main.js' where the map is initiated. The map is created through three js-files, map.js, addProjectMarkers.js
and addCountyBoundaries.js.

Thoughts and discussion
I think this was a quite nice and straight forward task. I had some problems working with the csv-file because there were commas both as a 
delimiter and in the text-fields, but I sorted that out through adding | as a delimiter instead. 

Estimated time spent

Installation instruction
Install Node.js
Clone the application from git repository
run ```npm install```
run ```npm run build```
run ```node app```
Open application in browser on ```localhost:8080```

Demo

Average time spent building the map





##References used:##
http://leafletjs.com/reference.html#control-layers
https://github.com/Leaflet/Leaflet.markercluster
https://github.com/joker-x/Leaflet.geoCSV
http://stackoverflow.com/questions/25372033/adding-layers-in-layer-group-dynamically-to-layer-control-in-leaflet
https://github.com/fffunction/please
http://leafletjs.com/examples/choropleth.html
https://www.youtube.com/watch?v=l2gR2yWCl8I
