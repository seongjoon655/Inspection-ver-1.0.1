
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const { poolPromise } = require('./modules/contact');
//const conn = require('../models/contact1');
var app = express();

const sql = require('mssql');
var TYPES = require('tedious').TYPES;



// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));


//router 사용
//login 페이지
app.use('/login', require('./routes/login'));
//lot 검사 페이지
app.use('/', require('./routes/home'));
//lot 정보 입력
app.use('/initlot', require('./routes/initlot'));


var server = app.listen(8001, function () {
    console.log('Server is running..');
});

















/*
app.get('/', async function (req, res) {
    //var re = request;
    try{
      const pool = await poolPromise;
      const result = await pool.request();
      result.query('select * from HEATINFOtb', function (err, recordset) {
          if (err) console.log(err)
          res.send(recordset);
      });
    }
    catch(err){
      res.status(500);
      res.send(err.message);
    }

    //res.send('wait..');
});
*/

/*
app.get('/', function (req, res) {
  conn.runQuery('select * from HEATINFOtb', function(err, recordset) {
    res.send(recordset);
  });
});
*/
