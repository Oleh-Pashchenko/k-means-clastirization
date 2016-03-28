// TODO: А этот файл логично назвать "main.js"
// nodejs при подключении модуля ищет файл {module_name}/index.js
// Он ищет тот файл, который указан в файле пакетов. Просто надо разобраться.

// TODO: Вот это я хотел, чтобы локально называлось как-то попроще. Хотя, вопрос спорный.
// Наверное надо принять каой-то стандарт по этому вопросу
// Тогда можно оставить за правило, что мы не переименовываем сторонние модули кроме когда это необходимо из-за конфликта имен?
var clusterfck = require("clusterfck");
var check = require('check-types');
var q = require('q');

// TODO: Вот человек в первый раз зайдет в этот код - и сразу должен понять, как сделать, чтобы он работал. Это касается второго аргумента, для которого нужен комментарий.
// TODO: Очень интересная Node.js - специфичная ошибка. Если этот метод упадет - то никто об этом не узнает. А если он упадет - то он положит целую ветку асинхронных вызовов.
// Поэтому во всех методах всегда есть последний параметр - обработчик ошибки. И он должен вызываться всегда при ошибке внутри любого метода. А уже тот, кто вызывает,
// решает, как обрабатывать ошибку.
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
    // А у нас два места вызова? Можно сделать приватной функцией, как описано ниже для другой функции.
    var processProperty = function(property) {
        
        if (check.date(new Date(property))) {
            // TODO: Я этот шаблон проектирования называю "индийской математикой".
            // Идея в том, чтобы разбивать такие длинные вычисления на промежуточные результаты, чтобы по имени переменной было видно, что делается на каждом шаге вычислений.
            return new Date(property.split(' ').join('T')).getTime() / 1000;
        } else if (check.nonEmptyString(property)) {
            // TODO: work with string
            // TODO: Классная идея. Для тестов возьми текст из чата сисек и очисти его от лишних символов.
        } else {
            return property;
        }
    };

    // TODO: Метод - это действие. Поэтому логично назвать "clusterize". Глагол, а не существительное. Так как действие - это глагол.
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

    // TODO: А мы можем внести эту функцию внутрь той функции, где она используется (инкапсуляция так получится). Особенно - если знаем, что она больше ниоткуда не вызываеся.
    // Это как приватная функция тогда.
    // TODO: Identity у нас не одно, а много. Значит - название во множественном числе.
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