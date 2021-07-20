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
connection.connect();

let server = http.createServer(app).listen(81);

app.get('/newsInput', function(req, res) {
    res.sendfile("input.html")
});

var bodyParser = require('body-Parser');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.post('/news', function(req, res) {
  connection.query(`INSERT INTO news
    (title, content)
    VALUES
    ('${req.body.title}', '${req.body.content}')`,
      function(error, results, fields) {
        console.log(results);
        if(error) {
          res.send("not ok");
        }
        else if(results.affectedRows==1) {
          res.send("ok");
        }
      });
});
