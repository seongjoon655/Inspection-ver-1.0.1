
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
app.use('/login', require('./routes/login'));
app.use('/', require('./routes/home'));

//app.get('/loginid', require('./routes/home'));

//AJAX GET METHOD
/*app.get('/loginid',function(req,res) {

    console.log('call app.get');
    var userid = req.query.userid;
    var pw = req.query.pw;

    console.log('GET Parameter = ' + userid + '/' + pw);

    var result = userid;

    //console.log(result );



    //res.send('./routes/home');
    res.send({result : result});
    //res.render('main/index',null);
});
*/
//app.use('/send', require('./routes/home'));

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
