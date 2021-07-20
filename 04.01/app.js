let express = require('express');
let http = require('http');
let app = express();
let mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'test'
});
var bodyParser = require('body-Parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

connection.connect();
let server = http.createServer(app).listen(80);


app.get('/test', function(req, res) {
    res.sendfile("test.html")
})

app.get('/practice', function(req, res) {
    res.sendfile("practice.html")
})

app.get('/practice2', function(req, res) {
    res.sendfile("starpractice.html")
})
