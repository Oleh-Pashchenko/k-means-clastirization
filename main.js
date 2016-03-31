var clusterfck = require("clusterfck");
var check = require('check-types');
var q = require('q');

// TODO: Вот человек в первый раз зайдет в этот код - и сразу должен понять, как сделать, чтобы он работал. Это касается второго аргумента, для которого нужен комментарий.
// TODO: Очень интересная Node.js - специфичная ошибка. Если этот метод упадет - то никто об этом не узнает. А если он упадет - то он положит целую ветку асинхронных вызовов.
// Поэтому во всех методах всегда есть последний параметр - обработчик ошибки. И он должен вызываться всегда при ошибке внутри любого метода. А уже тот, кто вызывает,
// решает, как обрабатывать ошибку.
// Прийдется везде try catch в каждую функцию написать?
module.exports = function(json, propertyName) {

    var temporary = [],
        clusters = [];

    var createArrayOfProperties = function(error) {
        try {
            for (var i = 0; i < json.length + 1; i++) {
                var data = processProperty(json[i][propertyName]);
                temporary[i] = [data];
            }
        } catch (exception) {
            error(exception);
        }
    };

    // TODO: Это можно очень классно заменить на самовызывающуюся функцию
    // Читаю о самовызывающихс функциях
    // В месте вызова можно написать что-то типа function (property) {} (json[i][propertyName]);
    // А если два места вызова, не будет ли это дублированием кода?
    // А у нас два места вызова? Можно сделать приватной функцией, как описано ниже для другой функции.
    // Если вложить эту функцию в другую то ее не будет видно в другом вызове ?!
    var processProperty = function(error, property) {
        try {
            if (check.date(new Date(property))) {
                var stringData = property.split(' ').join('T');
                var date = new Date(stringData);
                var time = date.getTime();
                var timeStamp = time / 1000;

                return timeStamp;
            } else if (check.nonEmptyString(property)) {
                // TODO: work with string
                // TODO: Классная идея. Для тестов возьми текст из чата сисек и очисти его от лишних символов.
            } else {
                return property;
            }
        } catch (exception) {
            error(exception);
        }
    };

    var clusterize = function(error) {
        try {
            var kMeans = new clusterfck.Kmeans();
            clusters = kMeans.cluster(temporary);
        } catch (exception) {
            error(exception);
        }

    };

    var updateData = function(error) {
        try {
            var addClusterIdentities = function(clusterIdentity, value) {
                for (var i = 0; i < json.length + 1; i++) {
                    var data = processProperty(json[i][propertyName]);
                    if (data == value) {
                        json[i].cluster = clusterIdentity;
                    }
                }
            };

            for (var i = 0; i < clusters.length; i++) {
                for (var j = 0; j < clusters[i].length; j++) {
                    for (var l = 0; l < clusters[i][j].length; l++) {
                        addClusterIdentities(i, clusters[i][j][l]);
                    }
                }
            }
        } catch (exception) {
            error(exception);
        }
    };

    return {
        start: function(error) {

            return q.all([
                    createArrayOfProperties(error),
                    clusterize(error),
                    updateData(error)
                ])
                .then(function() {
                    return json;
                });
        }
    };
};