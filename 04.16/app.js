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

// connection.query(`select * from news`,
//   function(error, results, fields) {
//     if(error) console.log(error);
//     console.log(results);
// });

app.get('/test', function(req, res) {
    res.sendfile("arr.html");
});

app.get('/test1', function(req, res) {
    res.sendfile("arr2.html");
});

app.get('/test2', function(req, res) {
    res.sendfile("arr3.html");
});

app.get('/test3', function(req, res) {
    res.sendfile("arr4.html");
});

app.get('/getNews', function(req, res) {
    connection.query(`select * from news`,
      function(error, results, fields) {
        if(error) console.log(error);
        res.send(results);
    });
});

app.post('/postNews', function(req, res) {
    console.log(req.body.title, req.body.content);
    let title = req.body.title;
    let content = req.body.content;

    connection.query(`insert into news (title, content) values ('${title}', '${content}')`,
      function(error, results, fields) {
        if(error) console.log(error);
        res.send(results);
    });
});

app.get('/gugu', function(req, res) {
    res.sendfile("calc.html");
});



app.get('/testNews', function(req, res) {
    console.log(`select * from news`);
    connection.query(`select * from news`,
      function(error, results, fields) {
        if(error) console.log(error);
        res.send(results), console.log(results);
    });
});
