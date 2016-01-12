var pleaseAjax = require('please-ajax'),
    addProjectMarkers = require('./addProjectMarkers.js');

module.exports = function(map, optionsBox){
    const COUNTY_BOUNDARIES_PATH = '/geojson';
    //getting ProjectData
    pleaseAjax.get(COUNTY_BOUNDARIES_PATH, {
        promise:true
    }).then(function success(data) {
        var geoJsonData = JSON.parse(data);
        var countyLayer;
        var countyLayerArray = [];
        geoJsonData.features.forEach(function(feature){
            addProjectMarkers.projectNb.forEach(function(element){
                if(element.hasOwnProperty(feature.properties.COUNTY_NAM)){
                   feature.properties.projectNb = element[feature.properties.COUNTY_NAM];
                    console.log(feature.properties);
                }
            });
            countyLayerArray.push(L.geoJson(feature));
        });
        countyLayer = L.layerGroup(countyLayerArray);
        countyLayer.addTo(map);
        optionsBox.addOverlay(countyLayer, 'show countyBoundaries').addTo(map);
    }, function error(err){
        console.log(err);
    });



    }