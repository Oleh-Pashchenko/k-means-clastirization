var request = require("request");

// TODO: Комментарий к тому, что делает этот метод.

// Берем JSON по URL и кластеризуем его
request("http://google-observer-1.herokuapp.com/api/event/list?kernelIdentifier=55ccc5376675e91100163ec7", function(error, response, body) {
    
    var json = JSON.parse(body);

    // TODO: А мы можем подключать это не как файл, а как модуль?
    // Можем, в будующем, так как сейчас в NPM нет этого мдуля. 
    var index = require("./index.js");
    index(json, "date").start().then(function(result) {
        console.log(result);
    });
});