var express = require('express');
var router = express.Router();
const { poolPromise } = require('../modules/contact');
const sql = require('mssql');
var TYPES = require('tedious').TYPES;

router.get('/',async function(req,res){
  var    Jdata;
  var    LOTdata;
  try{
    const pool = await poolPromise;
    const result = await pool.request();
    result.query('select * from email_test1', function (err, recordset) {
        var data = JSON.stringify(recordset);

        if (err){ console.log(err);}
        else{
          Jdata = JSON.parse(data);
          //console.log(Jdata);
          result.query('select * from lot_test1', function (err1, recordset) {
              var data1 = JSON.stringify(recordset);

              if (err1){ console.log(err1);}
              else{
                LOTdata = JSON.parse(data1);
                //console.log(LOTdata);
                res.render('main/index',{Jdata:Jdata, LOTdata:LOTdata});
              }

          });

        }
        //res.render('main/index');
    });

  }catch(err){
    res.status(500);
    res.send(err.message);
  }

});

router.get('/:id',async function(req,res){
  var   Name;
  var   LOTdata;
  const pool = await poolPromise;
  const result = await pool.request();

  try{
/*
      result.query('select * from lot_test1', function (err, recordset) {
          var data = JSON.stringify(recordset);
          if (err){ console.log(err);}
          else{
            Jdata = JSON.parse(data);
            res.render('main/index',{Jdata:Jdata});
          }
      });
*/

      var id = req.params.id;
      var query = `select name from insp_imployee where id=${id}`;
      console.log(query);
      result.query(query, function (err, data) {
          //var data = JSON.stringify(recordset);

          Name = data;
          if (err){ console.log(err);}
          else{
            //Jdata = JSON.parse(data);
            result.query('select * from lot_test1', function (err, recordset) {
                var lotdata = JSON.stringify(recordset);
                if (err){ console.log(err);}
                else{
                  LOTdata = JSON.parse(lotdata);
                  console.log(Name);
                  res.render('main/index',{LOTdata:LOTdata, Name:Name});
                }

            });
          }

      });



  }catch(err){
    res.status(500);
    res.send(err.message);
  }//try&catch


});

//router.post('/send', async function(req,res,next){
router.post('/', async function(req,res,next){
  try{
    //const pool = await poolPromise;
    //const result = await pool.request();
    /*
    var result = new sql.Request();


    var newUser = {
      name : req.body.name,
      email : req.body.email
    };

    console.log(req.body);


    result.input("name",sql.VarChar(50),req.body.name);
    result.input("mail",sql.VarChar(50),req.body.email);


    console.log('ok - 1');
    //프로시저일떄...
    result.execute("dbo.email_test1").then(function(dataset){
      console.log('ok - 2');
      if(dataset && dataset.recordsets && dataset.recordsets.length > 0){
        res.status(200).send(dataset.recordsets[0]);
        res.redirect('/');
      }
      else{
        res.status(400).send({Error:"Something ..."});
      }
    });

    */

//    var query = "insert into email_test1 (name,email) values(@name, @email)";





    /*
    //result.query(query, [newUser], function (err, result) {
    result.query(query,  function (err, result) {
        //var data = JSON.stringify(recordset);

        if (err){ console.log(err);}
        else{
          console.log("Number of records inserted: " + result.affectedRows);
          //var    Jdata = JSON.parse(data);
          //console.log(Jdata);
          //res.render('main/index',{Jdata:Jdata});
          res.redirect('/');
        }
        //res.send(recordset);
        //res.render('main/index');
    });
    */



//되는 코드

    var Connection = require('tedious').Connection;
    var config = {
        server: '172.29.2.40',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'sa', //update me
                password: '@Bee%tho*ven'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'developTest'  //update me
        }
    };
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log("Connected");
        //executeStatement1();
        var Request = require('tedious').Request  ;
        var TYPES = require('tedious').TYPES;
        var request  = new Request("insert into email_test1 (name,mail) values(@name, @mail)",function(err){
          if(err){ console.log(err) ; }
        });
        request.addParameter('name', TYPES.NVarChar, req.body.name);
        request.addParameter('mail', TYPES.NVarChar , req.body.email);
        request.on('row', function(columns) {
            columns.forEach(function(column) {
              if (column.value === null) {
                console.log('NULL');
              } else {
                console.log("Product id of inserted item is " + column.value);
              }
            });
        });
        connection.execSql(request);


        res.redirect('/');
    });

//되는 코드










  }
  catch(err){
    res.status(500);
    res.send(err.message);
  }
});

router.get('/logiid',()=>{
  //res.render('main/home',{Logindata:''});
  console.log('route call loginid');
});




router.get('/login/loginid/lot',async function(req,res,next) {

      var lot_pid = req.query.lot_pid;
      console.log('router /login/loginid/lot call~!  params ['+ lot_pid + ']');

      var    pummData;
      try{
        const pool = await poolPromise;
        const result = await pool.request();
        var query = `select * from lotDetailView where pid=${lot_pid}`;
        result.query(query, function (err, data) {
            console.log(data.recordset.length);
            //console.log(data.recordset[0].pname);

            var status;

            if (err){ console.log(err);}
            else{
              if(data.recordset.length>0){ //로그인 접속 정보가 맞다면
                status={
                  "inspNum" : data.recordset[0].hinspNum,
                  "status" : '200',
                  "pname" : data.recordset[0].pname,
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
