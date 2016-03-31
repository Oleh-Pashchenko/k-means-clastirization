var request = require("request");

// Берем JSON по URL и кластеризуем его
// TODO: Я имею ввиду, что мы можем сделать более приятное описание, которое будет давать понимание пользователю, что это за данные и зачем их кластеризуем. Это как маркетинговый текст.
// Подумаю над текстом
request("http://google-observer-1.herokuapp.com/api/event/list?kernelIdentifier=55ccc5376675e91100163ec7", function(error, response, body) {
    
    var json = JSON.parse(body);

    var index = require("./");
    index(json, "date").start(function() {
        console.log('error');
    })
    .then(function(result) {
        console.log(result);
    });
});