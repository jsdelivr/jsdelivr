var container = 'wt-18133137674-0';
var fn =  'return function(ctx, callback) { callback(null, ctx.data.price > 10.0 ? "SELL" : "HOLD");}';
var request = require('request');
var price = Math.random() * 20;

  request({
    method: 'POST',
    url: 'https://webtask.it.auth0.com/api/run/' + container + '?price=' + price,
    headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmMzhjMTUzNzk1ZmE0YzFjYTNiNTU2NjM2ZTY0MGIyZiIsImlhdCI6MTQ2MzUyNjIxNCwiY2EiOlsiOTAwNzMzNGRiMDhjNGQ2M2E0MTNjZGFmM2YzYjYxNGMiXSwiZGQiOjEsInRlbiI6Ii9ed3QtMTgxMzMxMzc2NzQtWzAtMV0kLyJ9.11Q1OnYoadAYVX78QMJ7AQ5JAU7AscWuA0tCTOOL8bI'
  },
    body: fn
  }, function(error, res, body) {
console.log(body);
});
