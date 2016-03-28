var request = require("request");

// Берем JSON по URL и кластеризуем его
// TODO: Я имею ввиду, что мы можем сделать более приятное описание, которое будет давать понимание пользователю, что это за данные и зачем их кластеризуем. Это как маркетинговый текст.
request("http://google-observer-1.herokuapp.com/api/event/list?kernelIdentifier=55ccc5376675e91100163ec7", function(error, response, body) {
    
    var json = JSON.parse(body);

    // TODO: А мы можем подключать это не как файл, а как модуль?
    // Можем, в будующем, так как сейчас в NPM нет этого мдуля. 
    // Но наш код и так является модулем. Поэтому он теоретически должен подключать сам себя. Типа как "./". Хотя, это только предположение.
    var index = require("./index.js");
    index(json, "date").start().then(function(result) {
        console.log(result);
    });
});