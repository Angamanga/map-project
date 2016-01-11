var pleaseAjax = require('please-ajax');

module.exports = function(map, optionsBox){
    const COUNTY_BOUNDARIES_PATH = '/geojson';
    console.log(map);
    //getting ProjectData
    pleaseAjax.get(COUNTY_BOUNDARIES_PATH, {
        promise:true
    }).then(function success(data) {
        var geoJsonData = JSON.parse(data);
        var countyLayer;
        var countyLayerArray = [];
        geoJsonData.features.forEach(function(feature){
        countyLayerArray.push(L.geoJson(feature));
        });
        countyLayer = L.layerGroup(countyLayerArray);
        countyLayer.addTo(map);
        optionsBox.addOverlay(countyLayer, 'show countyBoundaries').addTo(map);
    }, function error(err){
        console.log(err);
    });



    }