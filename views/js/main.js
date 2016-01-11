var baseMap = require('./map/baseMap.js'),
    addProjectMarkers = require('./map/addProjectMarkers.js');

window.onload = run();

function run(){
    baseMap();
    addProjectMarkers();
    }