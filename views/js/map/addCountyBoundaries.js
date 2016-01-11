var pleaseAjax = require('please-ajax');

module.exports = function(map){
    const COUNTY_BOUNDARIES_PATH = '/geojson';
    //getting ProjectData
    pleaseAjax.get(COUNTY_BOUNDARIES_PATH, {
        promise:true
    }).then(function success(data) {
        var geoJsondata = JSON.parse(data);
        geoJsondata.features.forEach(function(feature){
        L.geoJson(feature).addTo(map);
        })
    }, function error(err){
        console.log(err);
    });



    }