var clusterfck = require("clusterfck");
var check = require('check-types');
var Q = require('q');

module.exports = function(json, propertyName) {
    var tmp = new Array();
    var clusters;

    var createArrayForClastirization = function() {
        for (var i = 0; i < json.length; i++) {
            var data = processProperty(json[i][propertyName]);
            tmp[i] = [data];
        }
    };

    var processProperty = function(property) {
        if (check.date(new Date(property))) {
            return new Date(property.split(' ').join('T')).getTime() / 1000;
        } else if (check.nonEmptyString(property)) {
            //TODO: work with string
        } else {
            return property;
        }
    };

    var clastirization = function() {
        var kmeans = new clusterfck.Kmeans();
        clusters = kmeans.cluster(tmp);
    };

    var processClusters = function() {
        for (var i = 0; i < clusters.length; i++) {
            for (var j = 0; j < clusters[i].length; j++) {
                for (var l = 0; l < clusters[i][j].length; l++) {
                    addClusterIdToJSON(i, clusters[i][j][l]);
                }
            }
        }
    };

    var addClusterIdToJSON = function(clusterId, value) {
        for (var i = 0; i < json.length; i++) {
            var data = processProperty(json[i][propertyName]);
            if (data == value) {
                json[i].cluster = clusterId;
            }
        }
    };

    return {
        start: function() {
            return Q.all([
                    createArrayForClastirization(),
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