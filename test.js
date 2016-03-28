var request = require("request");

request("http://google-observer-1.herokuapp.com/api/event/list?kernelIdentifier=55ccc5376675e91100163ec7", function(error, response, body) {
    var json = JSON.parse(body);

    var index = require("./index.js");
    index(json, "date").start().then(function(result) {
        console.log(result);
    });
});