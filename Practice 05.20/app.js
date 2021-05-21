let express = require('express');
let http = require('http');
let app = express();
let server = http.createServer(app).listen(80);

var bodyParser = require('body-Parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// DB와 연결 (mysql 불러와서 connection)
let mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test'
});
connection.connect();

app.get('/form', function(req, res) {
  res.sendfile("form.html");
});

app.get('/insertForm', function(req, res) {
  res.sendfile("insertForm.html");
});

app.get('/getItem', function(req, res) {
  connection.query(`SELECT * FROM item ORDER BY itemPrice`,
    function(error, results, fields) {

      let priceTable = results;
      let itemName = "구매불가"; // if문 조건이 맞는게 없으면 자동으로 구매불가뜸
      let price = req.query.price;

      console.log(priceTable);

      for (let i = 0; i < priceTable.length; i++) {
        if (priceTable[i].itemPrice <= price) {
          itemName = priceTable[i].itemName;
        }
      }
      res.send(itemName);
    })
});

app.post('/newInsertItem', function(req, res) {
console.log(req.body.itemName);
console.log(req.body.itemPrice);
  connection.query(`select * from item
    where itemName = '${req.body.itemName}' OR itemPrice = ${req.body.itemPrice}`,

    function(error, results, fields) {
      //if (error) console.log(error);

      if (results.length >= 2) {
        res.send("동일한 이름, 가격이 각각 존재합니다! (2개)")
      }
       else if (results.length == 1) {
        if (results[0].itemName == req.body.itemName && results[0].itemPrice == req.body.itemPrice) {
          res.send("동일 이름, 가격이 존재합니다")
        } else if (results[0].itemName == req.body.itemName) {
          res.send("동일한 이름이 존재합니다")
        } else {
          res.send("동일한 가격이 존재합니다")
        }
    }
    else {
      connection.query(`insert into item (itemName, itemPrice)
      values ('${req.body.itemName}', ${req.body.itemPrice})`);
      res.send("insertData");
    }//else end
}); //func end
   //query end
}); //post end, func end
