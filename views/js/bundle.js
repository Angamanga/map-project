(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Copyright 2013 - GPL
* Iván Eixarch <ivan@sinanimodelucro.org>
* https://github.com/joker-x/Leaflet.geoCSV
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301, USA.
*/

L.GeoCSV = L.GeoJSON.extend({

  //opciones por defecto
  options: {
    titles: ['lat', 'lng', 'popup'],
    fieldSeparator: ';',
    lineSeparator: '\n',
    deleteDobleQuotes: true,
    firstLineTitles: false
  },

  _propertiesNames: [],

  initialize: function (csv, options) {
    L.Util.setOptions (this, options);
    L.GeoJSON.prototype.initialize.call (this, csv, options);
  },

  addData: function (data) {
    if (typeof data === 'string') {
      //leemos titulos
      var titulos = this.options.titles;
      if (this.options.firstLineTitles) {
        data = data.split(this.options.lineSeparator);
        if (data.length < 2) return;
        titulos = data[0];
        data.splice(0,1);
        data = data.join(this.options.lineSeparator);
        titulos = titulos.trim().split(this.options.fieldSeparator);
        for (var i=0; i<titulos.length; i++) {
          titulos[i] = this._deleteDobleQuotes(titulos[i]);
        }
        this.options.titles = titulos;
      }
      //generamos _propertiesNames
      for (var i=0; i<titulos.length; i++) {
         var prop = titulos[i].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_');
         if (prop == '' || prop == '_' || this._propertiesNames.indexOf(prop) >= 0) prop = 'prop-'+i;
         this._propertiesNames[i] = prop;
      }
      //convertimos los datos a geoJSON
      data = this._csv2json(data);
    }
    L.GeoJSON.prototype.addData.call (this, data);
  },

  getPropertyName: function (title) {
    var pos = this.options.titles.indexOf(title)
      , prop = '';
    if (pos >= 0) prop = this._propertiesNames[pos];
    return prop;
  },

  getPropertyTitle: function (prop) {
    var pos = this._propertiesNames.indexOf(prop)
      , title = '';
    if (pos >= 0) title = this.options.titles[pos];
    return title;
  },

  _deleteDobleQuotes: function (cadena) {
    if (this.options.deleteDobleQuotes) cadena = cadena.trim().replace(/^"/,"").replace(/"$/,"");
    return cadena;
  },

  _csv2json: function (csv) {
    var json = {};
    json["type"]="FeatureCollection";
    json["features"]=[];
    var titulos = this.options.titles;

    csv = csv.split(this.options.lineSeparator);
    for (var num_linea = 0; num_linea < csv.length; num_linea++) {
      var campos = csv[num_linea].trim().split(this.options.fieldSeparator)
        , lng = parseFloat(campos[titulos.indexOf('lng')])
        , lat = parseFloat(campos[titulos.indexOf('lat')]);
      if (campos.length==titulos.length && lng<180 && lng>-180 && lat<90 && lat>-90) {
        var feature = {};
        feature["type"]="Feature";
        feature["geometry"]={};
        feature["properties"]={};
        feature["geometry"]["type"]="Point";
        feature["geometry"]["coordinates"]=[lng,lat];
        //propiedades
        for (var i=0; i<titulos.length; i++) {
          if (titulos[i] != 'lat' && titulos[i] != 'lng') {
            feature["properties"][this._propertiesNames[i]] = this._deleteDobleQuotes(campos[i]);
          }
        }
        json["features"].push(feature);
      } 
    }
    return json;
  }

});

L.geoCsv = function (csv_string, options) {
  return new L.GeoCSV (csv_string, options);
};

},{}],2:[function(require,module,exports){
/**
 * please-ajax - A small and modern AJAX library.
 * @version v2.0.2
 * @author Dan Reeves <hey@danreev.es> (http://danreev.es/)
 * @link https://github.com/fffunction/please
 * @license MIT
 */
(function () {
    'use strict';

    var exports = {};

    var parse = function (req) {
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return {data:result, request:req};
    };

    var xhr = function (type, url, data, opts) {
        var options = {
            fileForm: opts.fileForm || false,
            promise: opts.promise || false,
            headers: opts.headers || {},
            success: opts.success || function () {},
            error: opts.error || function () {},
            loadstart: opts.loadstart || function () {},
            progress: opts.progress || function () {},
            load: opts.load || function () {}
        },
        request,
        isString = typeof data === 'string',
        isJSON = false;
        if (isString) {
            try {
                isJSON = !!JSON.parse(data);
            } catch (e) {
                isJSON = false;
            }
        }
        // IE9 Form Upload
        if (options.fileForm && isString) {
            var iframe  = document.createElement('iframe');
            request = {
                readyState: false,
                status: false,
                onload: function () {},
                onerror: function () {},
                send: function () {
                    iframe.style.display = 'none';
                    iframe.name = iframe.id = 'iframe'+Math.ceil(Math.random() * 1e5).toString();
                    document.body.appendChild(iframe);
                    iframe.addEventListener('load', function () {
                        var result = this.responseText = iframe.contentDocument.body.innerHTML;
                        if (result.toString().match(/^20\d\b/)) { // 20x status code
                            this.readyState = 4;
                            this.status = 200;
                            options.success();
                            this.onload();
                        } else {
                            options.error();
                            this.onerror();
                        }
                        document.body.removeChild(iframe);
                        options.fileForm.action = options.fileForm.action.slice(options.fileForm.action.search(/\?ie9/), 4);
                    }.bind(this));
                    if (options.fileForm.action.search(/\?ie9/) < 0) {
                        options.fileForm.action = (options.fileForm.action) ? options.fileForm.action + '?ie9' : '?ie9';
                    }
                    options.fileForm.target = iframe.id;
                    options.fileForm.submit();
                    options.loadstart();
                }
            };
        } else {
            var XHR = window.XMLHttpRequest || ActiveXObject;
            request = new XHR('MSXML2.XMLHTTP.3.0');
            request.open(type, url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (isString) {
                if (isJSON) request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                else request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
            }
            if (!!request.upload) {
                request.upload.addEventListener('loadstart', options.loadstart, false);
                request.upload.addEventListener('progress', options.progress, false);
                request.upload.addEventListener('load', options.load, false);
            }
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        options.success(parse(request));
                    } else {
                        options.error(parse(request));
                    }
                }
            };
        }
        for (var header in options.headers) {
            if (options.headers.hasOwnProperty(header)) {
                request.setRequestHeader(header, options.headers[header]);
            }
        }
        if (!!window.Promise && options.promise) {
            return new Promise(function(resolve, reject) {
                request.onload = function() {
                    if (request.status >= 200 && request.status < 300) {
                        request.response ? resolve(request.response) : resolve(request.responseText);
                    }
                    else {
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function() {
                    reject(Error('Network Error'));
                };

                request.send(data);
            });
        } else {
            request.send(data);
        }
        return request;
    };

    exports['get'] = function get (url, opts) {
        var options = opts || {};
        return xhr('GET', url, undefined, options);
    };

    exports['put'] = function put (url, data, opts) {
        var options = opts || {};
        return xhr('PUT', url, data, options);
    };

    exports['patch'] = function patch (url, data, opts) {
        var options = opts || {};
        return xhr('PATCH', url, data, options);
    };

    exports['post'] = function post (url, data, opts) {
        var options = opts || {};
        return xhr('POST', url, data, options);
    };

    exports['del'] = exports['delete'] = function del (url, opts) {
        var options = opts || {};
        return xhr('DELETE', url, undefined, options);
    };

    if (typeof define === 'function' && define['amd']) {
      define(function() { return exports; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = exports;
    } else if (typeof this !== 'undefined') {
      this['please'] = exports;
    }

}).call(this);

},{}],3:[function(require,module,exports){
'use strict';

var createMap = require('./map/map.js');

window.onload = run();

function run() {
    createMap();
}

},{"./map/map.js":5}],4:[function(require,module,exports){
'use strict';

var pleaseAjax = require('please-ajax'),
    geoCsv = require('leaflet-geocsv');

module.exports = function (map) {
    var csv_options = {
        fieldSeparator: ',',
        titles: ["ProjectID", "EPGeoName", "lat", "lng", "Ward", "Constituency", "County", "Project Cost Yearly Breakdown (KES)", "Total Project Cost (KES)", "Approval Date ", "Start Date (Planned)", "Start Date (Actual)", "End Date (Planned)", "End Date (Actual)", "Duration", "Duration (Months)", "Project Title", "Project Description", "Project Objectives", "NG Programme", "Vision 2030 Flagship Ministry", "Vision 2030 Flagship Project/Programme", "Implementing Agency", "Implementation Status", "MTEF Sector", "Work Plan Progress (%) "],
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup('<h3>Project title:</h3><p>' + feature.properties.project_title + '</p><h3>Project description:</h3><p>' + feature.properties.project_description + '</p><h3>Project objectives:</h3><p>' + feature.properties.project_objectives + '</p>');
        }
    };

    pleaseAjax.get('/data', {
        success: function success(data) {
            var geoLayer = L.geoCsv(data.data, csv_options);
            map.addLayer(geoLayer);
        }
    });
};

},{"leaflet-geocsv":1,"please-ajax":2}],5:[function(require,module,exports){
'use strict';

var addProjectMarkers = require('./addProjectMarkers.js');

module.exports = function () {
    var map = L.map('map').setView([1.2833, 36.8167], 8);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    addProjectMarkers(map);
};

},{"./addProjectMarkers.js":4}]},{},[3]);
