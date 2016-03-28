// TODO: А этот файл логично назвать "main.js"
// nodejs при подключении модуля ищет файл {module_name}/index.js
// Он ищет тот файл, который указан в файле пакетов. Просто надо разобраться.

// TODO: Вот это я хотел, чтобы локально называлось как-то попроще. Хотя, вопрос спорный.
// Наверное надо принять каой-то стандарт по этому вопросу
var clusterfck = require("clusterfck");
var check = require('check-types');
var q = require('q');

module.exports = function(json, propertyName) {
    
    var temporary = [],
        clusters  = [];

    var createArrayOfProperties = function() {
        for (var i = 0; i < json.length; i++) {
            var data = processProperty(json[i][propertyName]);
            temporary[i] = [data];
        }
    };

    // TODO: Это можно очень классно заменить на самовызывающуюся функцию
    // Читаю о самовызывающихс функциях
    // В месте вызова можно написать что-то типа function (property) {} (json[i][propertyName]);
    // А если два места вызова, не будет ли это дублированием кода?
    var processProperty = function(property) {
        
        if (check.date(new Date(property))) {
            return new Date(property.split(' ').join('T')).getTime() / 1000;
        } else if (check.nonEmptyString(property)) {
            // TODO: work with string
        } else {
            return property;
        }
    };

    var clusterization = function() {
        var kMeans = new clusterfck.Kmeans();
        clusters = kMeans.cluster(temporary);
    };

    var updateData = function() {
        for (var i = 0; i < clusters.length; i++) {
            for (var j = 0; j < clusters[i].length; j++) {
                for (var l = 0; l < clusters[i][j].length; l++) {
                    addClusterIdentity(i, clusters[i][j][l]);
                }
            }
        }
    };

    var addClusterIdentity = function(clusterIdentity, value) {
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
                    clusterization(),
                    updateData()
                ])
                .catch(console.log)
                .then(function() {
                    return json;
                });
        }
    };
};