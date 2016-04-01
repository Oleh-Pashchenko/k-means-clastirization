var clusterfck = require("clusterfck");
var checkTypes = require('check-types');
module.exports = function(items, distanceProperty, callback) {
    this.temporary = [];
    this.clusters = [];
    this.processProperty = function(property) {
        if (checkTypes.date(new Date(property))) {
            var stringData = property.split(' ').join('T');
            var date = new Date(stringData);
            var time = date.getTime();
            var timeStamp = time / 1000;
            return timeStamp;
        } else if (checkTypes.nonEmptyString(property)) {
            // TODO: work with string
            // TODO: Классная идея. Для тестов возьми текст из чата сисек и очисти его от лишних символов.
        } else {
            return property;
        }
    };
    this.prepare = function() {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var data = processProperty(item[distanceProperty]);
            this.temporary[i] = [data];
        }
    };
    this.clusterize = function() {
        var kMeans = new clusterfck.Kmeans();
        this.clusters = kMeans.cluster(this.temporary);
    };
    this.assignClusterIdentifiers = function() {
        var addClusterIdentities = function(clusterIdentity, value) {
            for (var i = 0; i < items.length; i++) {
                var data = processProperty(items[i][distanceProperty]);
                if (data == value) {
                    items[i].clusterIdentifier = clusterIdentity;
                }
            }
        };
        for (var i = 0; i < this.clusters.length; i++) {
            for (var j = 0; j < this.clusters[i].length; j++) {
                for (var l = 0; l < this.clusters[i][j].length; l++) {
                    addClusterIdentities(i, this.clusters[i][j][l]);
                }
            }
        }
    };
    this.prepare();
    this.clusterize();
    this.assignClusterIdentifiers();
    callback(null, items);
};