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
  res.sendfile("insert.html");
});

app.get('/listForm', function(req, res) {
  res.sendfile("listForm.html");
});


app.get('/updateForm', function(req, res) {
  res.sendfile("updateForm.html");
});


app.post('/insertItem', function(req, res) {

  // 이게 무슨 소리냐 .
  // results 로 들어올 때, 리스트 형태로 들어옴.
  // 가져올 정보를 where로 지정해줌
  // 맞는 데이터가 리스트 형태로 나옴
  // name,price 를 다 갖는 데이터가 하나 나오는 것.
  connection.query(`select * from item
    where itemName = '${req.body.itemName}' OR itemPrice = ${req.body.itemPrice}`,
    function(error, results, fields) {
      console.log(`${req.body.itemName}`);

      // 데이터가 두개 튀어나오는 것 . 그래서 리스트 길이가 2인 것 !
      if (results.length == 2) {
        res.send("동일한 이름, 가격을 가진 아이템이 각각 존재합니다.")
      }

      // 경우 ) 1.동일한 이름 있는것 2. 동일한 가격 3. 동일한 이름,가격
      // 좁은 범위부터 지정해주기.
      else if (results.length == 1) {
        if (results[0].itemName == req.body.itemName && results[0].itemPrice == req.body.itemPrice) {
          res.send("동일한 이름, 가격을 가진 아이템이 존재합니다.")
        } else if (results[0].itemName == req.body.itemName) {
          res.send("동일한 이름을 가진 아이템이 존재합니다.")
        } else if (results[0].itemPrice == req.body.itemPrice) {
          res.send("동일한 가격을 가진 아이템이 존재합니다.")
        }
      } else if (results.length == 0) {
        connection.query(`insert into item (itemName, itemPrice)
        values ('${req.body.itemName}', ${req.body.itemPrice})`,
          function(error, results, fields) {
            if (error) {
              res.send("error");
            }
            res.send("ok")
          });
      }
    });
});


app.get('/getItem', function(req, res) {
  connection.query(`SELECT * FROM item ORDER BY itemPrice`,
    function(error, results, fields) {

      let priceTable = results;
      let itemName = "구매불가"; // if문 조건이 맞는게 없으면 자동으로 구매불가뜸
      let price = req.query.price;
      // req.query : 쿼리스트링 파라미터에 전부를 가져온다.

      console.log(priceTable);

      for (let i = 0; i < priceTable.length; i++) {
        if (priceTable[i].itemPrice <= price) {
          itemName = priceTable[i].itemName;
        }
      }
      res.send(itemName);
    })
});

// 목록보기
app.get('/getList', function(req, res) {
  // order by price : 가격에 따라서 정렬하기 ! 여기서 price는 데이터 베이스 안에 있는 값
  connection.query(`SELECT * FROM item order by itemPrice`,
    function(error, results, fields) {
      res.send(results);
      // console.log(error);  // 이건 뭐지 ?
      console.log(fields);
      // 여기서 console.log 는 cmd창에 나옴 !
      console.log(results);
    })
})

// 업데이트
app.get('/getOneItem', function (req, res) {
  connection.query(`select * from item where no=${req.query.no}`,
    function(error, results, fields) {
    	res.send(results);
    });
});


app.put('/updateItem', function (req, res) {
  connection.query(`select * from item
    where (itemName = '${req.body.name}'
    or itemPrice = ${req.body.price})
    and no != ${req.body.no}
    `,
    function(error, results, fields) {
      if(results.length==2)  {
        res.send("동일한 이름, 가격이 각각 존재합니다(2개)");
      }

      else if(results.length==1) {
        if(results[0].itemName==req.body.name && results[0].itemPrice==req.body.price) {
          res.send("동일한 이름, 가격을 가진 아이템이 존재합니다.");
        }
        else if(results[0].itemName==req.body.name) {
          res.send("동일한 이름을 가진 아이템이 존재합니다.");
        }
        else if(results[0].itemPrice==req.body.price) {
          res.send("동일한 가격을 가진 아이템이 존재합니다.");
        }
      }

      else if(results.length==0) {
        connection.query(`update item
          set itemName='${req.body.name}'
          , itemPrice=${req.body.price}
          where no =${req.body.no}
          `,
          function(error, results, fields) {
            if(error) {
              console.log(error);
              res.send("error");
            }
            else if(results.affectedRows==1) {
              res.send("ok");
            }
          });
      }
    });
});


// 삭제하기 // ${} $안에 넣어주면 변수로 !
app.delete('/deleteItem', function(req, res) {
  connection.query(`delete from item where no=${req.body.no}`,
    function(error, results, fields) {
      if (error) console.log(error);
      console.log(results);

      if (results.affectedRows == 1) {
        res.send("ok")
      } else {
        res.send("error");
      }
    });
});
