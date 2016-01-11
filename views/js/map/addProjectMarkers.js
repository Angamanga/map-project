var pleaseAjax = require('please-ajax'),
    geoCsv = require('leaflet-geocsv'),
    markerCluster = require('./markerCluster/leaflet.markercluster.js');

module.exports = function(map, optionsBox) {
    const PROJECT_PATH = '/csv';

    //setting options for reading csv-file
    var csv_options = {
        fieldSeparator: ',',
        titles: ["ProjectID","EPGeoName","lat","lng","Ward","Constituency","County","Project Cost Yearly Breakdown (KES)","Total Project Cost (KES)","Approval Date ","Start Date (Planned)","Start Date (Actual)","End Date (Planned)","End Date (Actual)","Duration","Duration (Months)","Project Title","Project Description","Project Objectives","NG Programme","Vision 2030 Flagship Ministry","Vision 2030 Flagship Project/Programme","Implementing Agency","Implementation Status","MTEF Sector","Work Plan Progress (%) "],
        onEachFeature(feature, layer){
            layer.bindPopup('<h3>Project title:</h3><p>' + feature.properties.project_title+
                '</p><h3>Project description:</h3><p>' +feature.properties.project_description+
                '</p><h3>Project objectives:</h3><p>'+feature.properties.project_objectives+'</p>'
            );
        }
    }
    //getting ProjectData
    pleaseAjax.get(PROJECT_PATH, {
        promise:true
}).then(function success(data){
        //creating and adding separate markers to control-layer and map
        var geoLayer = L.geoCsv(data, csv_options);
        map.addLayer(geoLayer);
        optionsBox.addBaseLayer(geoLayer, 'Show separate markers');
        //creating and adding clustered markers to control-layer
        var markers = new L.markerClusterGroup();
        markers.addLayer(geoLayer);
        optionsBox.addBaseLayer(markers, 'Show clustered markers');
    }, function error(error){
        console.log('error');
    });
    }


