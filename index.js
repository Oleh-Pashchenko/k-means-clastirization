// TODO: Слово пишется как "clastEr". В названии проекта и везде.
// TODO: Добавить в название проекта префикс "nodejs-"
// TODO: А этот файл логично назвать "main.js"
// TODO: Давай назовем просто "clusterizer". Ато имя слишком заумное.
var clusterfck = require("clusterfck");
var check = require('check-types');
// TODO: Вероятно, нет смысла писать с большой буквы имя библиотеки. У них
// же оно с маленькой написано.
var Q = require('q');

module.exports = function(json, propertyName) {
    
    // TODO: Не используем сокращения в именах переменных
    var tmp = new Array();
    
    // TODO: Опасно не инициализировать переменную. Это может привести к тому, что она так и останется пустой.
    var clusters;

    // TODO: Из контекста и так понятно, что все создается для кластеризации. Нужно более описательное название.
    var createArrayForClastirization = function() {
        for (var i = 0; i < json.length; i++) {
            var data = processProperty(json[i][propertyName]);
            tmp[i] = [data];
        }
    };


    // TODO: Это можно очень классно заменить на самовызывающуюся функцию
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
        // TODO: Camel-case
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

    // TODO: Не используем сокращения.
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