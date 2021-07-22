let express = require('express');
let http = require('http');
let app = express();
let mysql = require('mysql');
let server = http.createServer(app).listen(80);


app.get('/form', function(req, res) {


  res.sendfile("price.html");
});

app.get('/selectMax', function(req, res) {
  let price = Number(req.query.price);
  let priceArr = [500000, 100000, 50000, 30000, 10000, 5000, 1000];
  //let priceArr=[1000,5000,10000,50000,100000,500000];
  //  let sortedArr= priceArr.sort();
  //  console.log(priceArr);
  if (price < 1000) {
    let alertMent = "구매불가";
    res.send(alertMent);
  } else {
    for (let i = 0; i < priceArr.length; i++) {
      if (priceArr[i] <= price) {
        //  let maxPrice = priceArr[i];
        let product = "item" + (7 - i);
        console.log(i);

        res.send(product);
        break;

      }
      // else if(priceArr[i]<= price){
      //   continue;
      // }
    }
  }
  //  console.log(price);
  //  console.log(maxPrice);
  // function (error, results, fields) {
  //   console.log(results);
  //   res.send(results)
  // });
});
