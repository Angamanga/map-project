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
                }
            });

            countyLayerArray.push(L.geoJson(feature, {style: style(feature)}));
        });
        countyLayer = L.layerGroup(countyLayerArray);
        var legend = generateLegend();
        countyLayer.onAdd = function(){
            legend.addTo(map);
        }
        countyLayer.onRemove = function () {
            map.removeControl(legend);
        }
        countyLayer.addTo(map);
        optionsBox.addOverlay(countyLayer, 'show countyBoundaries').addTo(map);

    }, function error(err){
        console.log(err);
    });

    function generateLegend() {
        //adding legend
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 30, 40, 50, 100, 200, 500],
                labels = [];
            div.innerHTML = '<h3>Number of projects</h3>';
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            return div;
            }
        console.log(legend);

        return legend;

    };


    function style(feature) {
        return {
            fillColor: getColor(feature.properties.projectNb),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function getColor(d) {
        return d > 500 ? '#67000d' :
                d > 200  ? '#a50f15' :
                d > 100  ? '#cb181d' :
                d > 50  ? '#ef3b2c' :
                d > 40   ? '#fb6a4a' :
                d > 30   ? '#fc9272' :
                d > 20   ? '#fcbba1' :
                d > 10 ? '#fee0d2':
                '#fff5f0';
    }
}