var pleaseAjax = require('please-ajax'),
    geoCsv = require('leaflet-geocsv'),
    markerCluster = require('./markerCluster/leaflet.markercluster.js');

module.exports = function(map) {
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
    pleaseAjax.get('/data', {
        success(data){
            var geoLayer = L.geoCsv(data.data, csv_options);
            var markers  = new L.markerClusterGroup();
            console.log(markers);
            markers.addLayer(geoLayer);
            map.addLayer(markers);
        }
        }
    )
}
