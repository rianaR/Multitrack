// We need to use the express framework: have a real web server that knows how to send mime types etc.
var express=require('express');
var bodyParser = require('body-parser');
var routes = require('./server/routes');

// Init globals variables for each module required
var app = express()
, http = require('http')
, server = http.createServer(app);

// Indicate where static files are located
app.use(express.static(__dirname + '/'));

app.use(bodyParser.json({reviver : function(k, v) {
    if (((k === "masterVolume") || (k === "volume")) &&
        (!isNaN(Number(v)))) {
        return Number(v);
    }
    else {
        return v;
    }
}}));

// Config
var PORT = 8081;

// launch the http server on given port
server.listen(PORT);

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', routes);


console.log("Server launch on the port "+PORT);
