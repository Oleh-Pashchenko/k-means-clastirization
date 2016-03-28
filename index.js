// TODO: А этот файл логично назвать "main.js"
// nodejs при подключении модуля ищет файл {module_name}/index.js

var clusterfck = require("clusterfck");
var check = require('check-types');

var q = require('q');

module.exports = function(json, propertyName) {
    
    var temporary = new Array();
    
    var clusters = [];

    var createArrayOfProperties = function() {
        for (var i = 0; i < json.length; i++) {
            var data = processProperty(json[i][propertyName]);
            temporary[i] = [data];
        }
    };

    // TODO: Это можно очень классно заменить на самовызывающуюся функцию
    // Читаю о самовызывающихс функциях
    var processProperty = function(property) {
        
        if (check.date(new Date(property))) {
            return new Date(property.split(' ').join('T')).getTime() / 1000;
        } else if (check.nonEmptyString(property)) {
            // TODO: work with string
        } else {
            return property;
        }
    };

    var clastirization = function() {
        var kMeans = new clusterfck.Kmeans();
        clusters = kMeans.cluster(temporary);
    };

    var processClusters = function() {
        for (var i = 0; i < clusters.length; i++) {
            for (var j = 0; j < clusters[i].length; j++) {
                for (var l = 0; l < clusters[i][j].length; l++) {
                    addClusterIdentityToJSON(i, clusters[i][j][l]);
                }
            }
        }
    };

    // TODO: Не используем сокращения.
    // Id или какое тут сокращение? 
    var addClusterIdentityToJSON = function(clusterIdentity, value) {
        for (var i = 0; i < json.length; i++) {
            var data = processProperty(json[i][propertyName]);
            if (data == value) {
                json[i].cluster = clusterIdentity;
            }
        }
    };

    return {
        start: function() {
            return q.all([
                    createArrayOfProperties(),
                    clastirization(),
                    processClusters()
                ])
                .catch(console.log)
                .then(function() {
                    return json;
                });
        }
    };
};