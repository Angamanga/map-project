var pleaseAjax = require('please-ajax'),
    geoCsv = require('leaflet-geocsv'),
    markerCluster = require('./markerCluster/leaflet.markercluster.js');

/*this module contains two things, first a function that adds a marker for each project, then an array called
 * projectNb where the number of projects in each county is stored. This array is then used when adding number of projects in
 * each county to the layer displaying counties.
 * */

module.exports = {
    addMarkers(map, optionsBox){
        const PROJECT_PATH = '/csv';
        const OPTIONS_BOX_SEPARATE_MARKERS = 'Show projects as markers';
        const OPTIONS_BOX_CLUSTERED_MARKERS = 'Show projects as clustered markers';
        var self = this;

        //setting options for reading csv-file
        var csv_options = {
            fieldSeparator: '|',
            lineSeparator: '/n',
            firstLineTitles:true,
            pointToLayer(feature, latlng){
                return new L.Marker(latlng);
                },
            onEachFeature(feature, layer){
                //counting number of projects in each county and adding them to projectNb-array
                var index = countyArray(feature.properties.county, self.projectNb);
                if (index !== false) {
                    self.projectNb[index][feature.properties.county]++;
                }
                else {
                    var object = {};
                    object[feature.properties.county] = 1;
                    self.projectNb.push(object);
                }
                //adding popup to marker
                layer.bindPopup('<h3>' + feature.properties.project_title + '</h3><p>' +
                    '</p><h4>Project description:</h4><p>' + feature.properties.project_description +
                    '</p><h4>Project objectives:</h3><p>' + feature.properties.project_objectives + '</p>'
                );
            }
        };

        //Ajax-request to get csv-file from server and create map layers
        pleaseAjax.get(PROJECT_PATH, {
            promise: true
        }).then(function success(data) {
            //creating and adding separate markers to control-layer and map
            var geoLayer = L.geoCsv(data, csv_options);
            map.addLayer(geoLayer);
            optionsBox.addBaseLayer(geoLayer, OPTIONS_BOX_SEPARATE_MARKERS );

            //creating and adding clustered markers to control-layer
            var markers = new L.markerClusterGroup();
            markers.addLayer(geoLayer);
            optionsBox.addBaseLayer(markers, OPTIONS_BOX_CLUSTERED_MARKERS);
        }, function error(err) {
            console.log(err);
        });

        //help-function when calculating number of projects and cost in each county
        function countyArray(county, projectNb) {
            var ret = false;
            if (projectNb.length > 0) {
                projectNb.forEach(function (element, index) {
                    if (element.hasOwnProperty(county)) {
                        ret = index;
                    }
                });
            }
            return ret;
        };
    },
    projectNb: []
}
