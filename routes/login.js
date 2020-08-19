var express = require('express');
var router = express.Router();
const { poolPromise } = require('../modules/contact');
const sql = require('mssql');
var TYPES = require('tedious').TYPES;
const internalIp = require('internal-ip');



//ACTION - 1
//최초 로그인 페이지 시작시 해당 ROUTER 수행
router.get('/',async function(req,res){

  console.log('logintheme page call');
  var    Logindata;
  try{
    const pool = await poolPromise;
    const result = await pool.request();
    result.query('select * from insp_employee where delflag=1', async function (err, recordset) {
        console.log('select * from insp_employee');
        var data = JSON.stringify(recordset);

        if (err){ console.log(err);}
        else{
          Logindata = JSON.parse(data);
//          res.render('main/login',{Logindata:Logindata});
            res.render('main/logintheme',{Logindata:Logindata});
        }
    });
  }catch(err){
    res.status(500);
    res.send(err.message);
  }

  //res.send('login page');
});



//ACTION - 2
//사용자가 로그인 버튼을 누룰시 해당 ROUTER 를 수행
router.get('/loginid',async function(req,res,next) {
     console.log('router /loginid call~!');

      var userid = req.query.userid;
      var pw = req.query.pw;
      //console.log('router /login call~!  params ['+ userid + '/' + pw + ']');

      var    Logindata;
      try{
        const pool = await poolPromise;
        const result = await pool.request();
        var query = `select count(*) as cnt from insp_employee where delflag=1 and id=${userid} and pass='${pw}'`;
        console.log(query);
        result.query(query, async function (err, data) {
            //console.log(data);
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
                  "id" : userid,
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
