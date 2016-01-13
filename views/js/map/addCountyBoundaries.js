var pleaseAjax = require('please-ajax'),
    addProjectMarkers = require('./addProjectMarkers.js');

/*This module adds countyboundaries filtered on number of projects in each county
*
* */
module.exports = function (map, optionsBox) {
    const COUNTY_BOUNDARIES_PATH = '/geojson';

    //Ajax-request to get geojson-file with countyboundaries from server
    pleaseAjax.get(COUNTY_BOUNDARIES_PATH, {
        promise: true
    }).then(function success(data) {
        const OPTIONS_BOX_COUNTY_BOUNDARIES = 'Display county-boundaries';
        var countyLayer,
            countyLayerArray = [],
            geoJsonData,
            legend;

        //parses data from server
        geoJsonData = JSON.parse(data);
        //add number of projects in each county
        geoJsonData.features.forEach(function (feature) {
            addProjectMarkers.projectNb.forEach(function (element) {
                if (element.hasOwnProperty(feature.properties.COUNTY_NAM)) {
                    feature.properties.projectNb = element[feature.properties.COUNTY_NAM];
                }
            });
            //creates geoJson-layers from each feature and adds style depending on number of projects
            countyLayerArray.push(L.geoJson(feature, {style: style(feature)}));
        });

        //creates a Layergroup from each feature
        countyLayer = L.layerGroup(countyLayerArray);
        legend = generateLegend();

        //adds dynamic legend based on layers visible on map
        map.on({
            overlayadd: function (e) {
                if (e.name === OPTIONS_BOX_COUNTY_BOUNDARIES ) {
                    legend.addTo(map);
                }
            },
            overlayremove: function (e) {
                if (e.name === OPTIONS_BOX_COUNTY_BOUNDARIES) {
                    map.removeControl(legend);
                }
            }
        });
        //adds layer to map and optionbox
        optionsBox.addOverlay(countyLayer, OPTIONS_BOX_COUNTY_BOUNDARIES).addTo(map);
        countyLayer.addTo(map);

    }, function error(err) {
        console.log(err);
    });

    //help-function to generate legend (very much alike this example: http://leafletjs.com/examples/choropleth.html)
    function generateLegend() {
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 30, 40, 50, 100, 200, 500],
                labels = [];
            div.innerHTML = '<h3>Number of projects</h3>';
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            return div;
        }
        return legend;
    };

    //help-function that generates style to each geoJson-layer
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.projectNb),
            weight: 2,
            opacity: 1,
            color: '#FFFFFF',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    //help-function that generates color-code depending on number of projects
    function getColor(d) {
        return d > 500 ? '#67000d' :
            d > 200 ? '#a50f15' :
                d > 100 ? '#cb181d' :
                    d > 50 ? '#ef3b2c' :
                        d > 40 ? '#fb6a4a' :
                            d > 30 ? '#fc9272' :
                                d > 20 ? '#fcbba1' :
                                    d > 10 ? '#fee0d2' :
                                        '#fff5f0';
    }
}