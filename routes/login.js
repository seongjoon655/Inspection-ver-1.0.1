var express = require('express');
var router = express.Router();
const { poolPromise } = require('../modules/contact');
const sql = require('mssql');
var TYPES = require('tedious').TYPES;


router.get('/',async function(req,res){
  console.log('login page call');
  var    Logindata;
  try{
    const pool = await poolPromise;
    const result = await pool.request();
    result.query('select * from insp_imployee', function (err, recordset) {
        var data = JSON.stringify(recordset);

        if (err){ console.log(err);}
        else{
          Logindata = JSON.parse(data);
          res.render('main/login',{Logindata:Logindata});
        }
    });
  }catch(err){
    res.status(500);
    res.send(err.message);
  }

  //res.send('login page');
});


router.get('/loginid',async function(req,res,next) {
    // console.log('router /login call~!');

      var userid = req.query.userid;
      var pw = req.query.pw;
      console.log('router /login call~!  params ['+ userid + '/' + pw + ']');

      var    Logindata;
      try{
        const pool = await poolPromise;
        const result = await pool.request();
        var query = `select count(*) as cnt from insp_imployee where id=${userid} and pass='${pw}'`;
        result.query(query, function (err, data) {
            console.log(data);
            //console.log(data.recordset[0].cnt);


            var status;

            if (err){ console.log(err);}
            else{
              if(data.recordset[0].cnt=="1"){ //로그인 접속 정보가 맞다면
                status={
                  "id" : userid,
                  "status" : '200',
                  "message" : 'login success'
                }
              }
              else{
                status={
                  "id" : 999,
                  "status" : '300',
                  "message" : 'login fail'
                }
              }//else
              var result = JSON.stringify(status);
              res.send(result);
            }//else


        });//request
      }catch(err){
        res.status(500);
        res.send(err.message);
      }

});



module.exports = router;
