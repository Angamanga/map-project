var addProjectMarkers = require('./addProjectMarkers.js'),
    addCountyBoundaries = require('./addCountyBoundaries.js');

module.exports = function() {
   //creating base-map
    var map = L.map('map').setView([1.2833, 36.8167], 8);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //initiating a control for switching between different layers
    var optionsBox = L.control.layers();

    //adding layers to  map
    addProjectMarkers(map, optionsBox);
    addCountyBoundaries(map, optionsBox);
}

