var pleaseAjax = require('please-ajax');

module.exports = function(map){
    const COUNTY_BOUNDARIES_PATH = '/geojson';
    //getting ProjectData
    pleaseAjax.get(COUNTY_BOUNDARIES_PATH, {
        promise:true
    }).then(function success(data) {
    console.log(data);
    }, function error(err){
        console.log(err);
    });



    }