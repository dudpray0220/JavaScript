let express = require('express');
let http = require('http');
let app = express();
let server = http.createServer(app).listen(80);

var bodyParser = require('body-Parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// DB와 연결 (mysql 불러와서 connection)
let mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'test'
});
connection.connect();

app.get('/test', function(req, res) {
    res.sendfile("arr.html");
});

app.get('/test2', function(req, res) {
    res.sendfile("arr2.html");
});

app.get('/test3', function(req, res) {
    res.sendfile("radio.html");
});

app.get('/test4', function(req, res) {
    res.sendfile("radio2.html");
});
