#Map of Kenya showing statistics over Government-funded projects#

###I have created a map showing###
* projects
    * each project as a marker
    * projects clustered if situated close to each other
    
* county-boundaries filtered on number of projects in each county
    
##Language and libraries used##
I have written a Node.js-application where the node-server is used to serve the source-data to the client through
HTTP-requests. In the front-end I have worked with plain vanilla Java Script with the addition of a number of libraries
to optimise the code (Browserify and Babel) and make Ajax-requests easier (PleaseAjax). I have used Leaflet.js together with two plugin-libraries
 to make it possible to handle csv-data (geoCSV) and make clustered layers (MarkerCluster).

The application starts in the file 'main.js' where the map is initiated. The map is created through three js-files, map.js, addProjectMarkers.js
and addCountyBoundaries.js. I have separated the layers into two different modules since I like to keep the tasks for a module to a minimum. 
However, I needed data from addProjectMarkers in addCountyBoundaries so there is a dependency between them that might not be optimal.


##Thoughts and discussion##
I think this was a quite nice and straight forward task. I had some problems working with the csv-file as there were commas both as a 
delimiter and in the text-fields, but I sorted that out through adding | as a delimiter and /n as escape character. I also cleaned up the 
 file by only keeping records and fields containg data I actually use. However, I kept ProjectID to make it possible to join other data if 
 neccessary. Before doing anything more with this data, I think it is important to clean up the data more properly together with someone
 who knows the data. Some projects are for example repeated several times but at different locations. 
 
However, there are lots of interesting information in the file but due to time-constraints, I opted to focus on the above implementations. Other interesting 
 visualisations could be:
 
 * average duration of the projects within a county. This together with cost could aid in showing a more accurate picture of the projects than cost only.
          
 * It could be interesting to visualise what kind of projects there are in each county. That could be done through visualising 
      data based on the number of projects in either "MTEF Sector", "Implementing Agency" or "NG Programme" fields.


###Estimated time spent approximately 5 hours.###

##Installation instruction##
###Requirements:###
1. Install <a href="https://nodejs.org">Node.js</a>
2. Clone the application from git repository
3. Run ```npm install``` , ```npm run build``` and  ```node app``` in your terminal window
5. Go to ```localhost:8080``` in browser.

##Demo##
A demo can be found here:

##Libraries and code examples used:##
1. http://leafletjs.com/reference.html#control-layers
2. https://github.com/Leaflet/Leaflet.markercluster
3. https://github.com/joker-x/Leaflet.geoCSV
4. http://stackoverflow.com/questions/25372033/adding-layers-in-layer-group-dynamically-to-layer-control-in-leaflet
5. https://github.com/fffunction/please
6. http://leafletjs.com/examples/choropleth.html
7. https://www.youtube.com/watch?v=l2gR2yWCl8I
