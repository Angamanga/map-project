var pleaseAjax = require('please-ajax'),
    geoCsv = require('leaflet-geocsv'),
    markerCluster = require('./markerCluster/leaflet.markercluster.js');

module.exports = {
    projectNb:[],
    addMarkers(map, optionsBox) {
        const PROJECT_PATH = '/csv';
        var self = this;
        //setting options for reading csv-file
        var csv_options = {
            fieldSeparator: '|',
            titles: ["ProjectID", "EPGeoName", "lat", "lng", "Ward", "Constituency", "County", "Project Cost Yearly Breakdown (KES)", "Total Project Cost (KES)", "Approval Date ", "Start Date (Planned)", "Start Date (Actual)", "End Date (Planned)", "End Date (Actual)", "Duration", "Duration (Months)", "Project Title", "Project Description", "Project Objectives", "NG Programme", "Vision 2030 Flagship Ministry", "Vision 2030 Flagship Project/Programme", "Implementing Agency", "Implementation Status", "MTEF Sector", "Work Plan Progress (%) "],
            pointToLayer: function (feature, latlng) {
                return new L.CircleMarker(latlng, {
                    radius: 8,
                    color: "grey",
                    border: 'solid 1px black',
                    weight: 0.1,
                    opacity: 1,
                    fillOpacity: 0.6});
            },
            onEachFeature(feature, layer){
                //counting number of projects in each county
                var index = countyArray(feature.properties.county, self.projectNb);
                if (index !== false) {
                    self.projectNb[index][feature.properties.county]++;
                }
                else {
                    var object = {};
                    object[feature.properties.county] = 1
                    self.projectNb.push(object);
                }

                //adding popup to marker
                layer.bindPopup('<h3>Project title:</h3><p>' + feature.properties.project_title +
                    '</p><h3>Project description:</h3><p>' + feature.properties.project_description +
                    '</p><h3>Project objectives:</h3><p>' + feature.properties.project_objectives + '</p>'
                );
            }

        }
        //getting ProjectData
        pleaseAjax.get(PROJECT_PATH, {
            promise: true
        }).then(function success(data) {
            //creating and adding separate markers to control-layer and map
            var geoLayer = L.geoCsv(data, csv_options);
            map.addLayer(geoLayer);
            optionsBox.addBaseLayer(geoLayer, 'Show separate markers');
            //creating and adding clustered markers to control-layer
            var markers = new L.markerClusterGroup();
            markers.addLayer(geoLayer);
            optionsBox.addBaseLayer(markers, 'Show clustered markers');
        }, function error(error) {
            console.log('error');
        });




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
    }

}


