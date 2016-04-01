var request = require("request");
var clusterizer = require("./");
/**
 * Data clusterization sample.
 * 
 * Extracts all events collected during the last period of time 
 * from the news API and clusterizes them by news item date time.
 * 
 * Cluster identifiers are added to resulting data and this 
 * data is printed to console.
 * 
 * TODO: А что, если запрос не отработал или вернул не HTTP 200?
 */
request("http://google-observer-1.herokuapp.com/api/event/list?kernelIdentifier=55ccc5376675e91100163ec7", function(error, response, body) {
    if (error) {
        throw error;
    }
    var json = JSON.parse(body);
    clusterizer(json, "date", function(error, data) {
        if(error) {
            throw error;
        }
        console.log(data);
    });
});