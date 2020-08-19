var express = require('express');
var router = express.Router();
const { poolPromise } = require('../modules/contact');
const sql = require('mssql');
var TYPES = require('tedious').TYPES;

//ACTION-1
//신규 LOT 입력 화면 로그인
router.get('/:id', async function(req,res){

    var   Name;
    var   Id;
    const pool = await poolPromise;
    const result = await pool.request();

    try{

        var id = req.params.id;
        console.log('router /initlot/:id page call : ' + id);
        Id = id;
        var query = `select id,name from insp_employee where delflag=1 and id=${id}`;
        console.log(query);
        result.query(query, async function (err, data) {
            Name = data;
            //console.log('Name : ' + Name);
            if (err){ console.log('??'); console.log(err);}
            else{
              res.render('main/init_lot',{Name:Name});
            }//else

        });
    }catch(err){
      res.status(500);
      res.send(err.message);
    }//try&catch
});//ACTION-1

//ACTION-2
//중복체크 버튼
router.post('/:id/check', async function(req,res,next){
  console.log('router /:id/check call  ' );
  var obj = req.body.rowD;
  console.log(obj);

  var    IsLot = 0; //기본은 등록불가의 상태
  var    Hogi ;
  var    Empdata ;

  try{
    const pool = await poolPromise;
    const result = await pool.request();

    var query = `select * from lot_test1 where delflag=1 and lot='${obj.lotname}' and se=${obj.se_val}`;
    result.query(query, async function (err, data) {
        console.log(query);

        if (err){ console.log(err);}
        else{
            if(data.recordset.length>0){ //존재하는 lot 라면
                IsLot = 0;

                status={
                  "id" : 999,
                  "status" : '300',
                  "message" : 'login fail'
                }

                var result_status = JSON.stringify(status);
                res.send(result_status);
                return ;
            }
            else{ //존재하지 않는다면 등록 할 수 있는 환경을 조회해서 넘겨준다.
              IsLot = 1;

                  var query_h = `select * from hogi_info where delflag=1`;
                  result.query(query_h, async function (err, data_h ) {
                      console.log(query_h);
                      if (err){ console.log(err);}
                      else{
                            Hogi = data_h;

                            var query_e = `select id,name from insp_employee where delflag=1`;
                            console.log(query_e);
                            result.query(query_e, async function (err, empdata) {
                                Empdata = empdata;

                                if (err){ console.log('??'); console.log(err);}
                                else{
                                    //res.render('main/init_lot',{IsLot:IsLot, Hogi:Hogi, Empdata:Empdata});

                                      status={
                                        "islot" : IsLot,
                                        "hogilist" : Hogi.recordset,
                                        "emplist" : Empdata.recordset,
                                        "status" : '200',
                                        "message" : 'login success'
                                      }
                                      var result_status = JSON.stringify(status);
                                      res.send(result_status);


                                }//else
                            });//query_e


                      }//else
                  });//query_h


              }//else
        }//else
    });//query

  }catch(err){
    res.status(500);
    res.send(err.message);
  }

});//ACTION-2

//ACTION-3
//호기선택
router.post('/:id/hogisel', async function(req,res,next){
    console.log('router /:id/hogisel call  ' );
    var hogi_id = req.body.hogi_id;
    var user_id= req.body.user_id;


    var    Pumm ;


    try{
      const pool = await poolPromise;
      const result = await pool.request();

      var query = `select * from pumm_info where delflag=1 and pid=${hogi_id}`;
      console.log(query);
      result.query(query, async function (err, data) {
          Pumm = data;

          if (err){ console.log(err);}
          else{
              status={
                "pummlist" : Pumm.recordset,
                "status" : '200',
                "message" : 'login success'
              }
              var result_status = JSON.stringify(status);
              res.send(result_status);
          }//else
      });//query
    }catch(err){
      res.status(500);
      res.send(err.message);
    }
});//호기선택

//ACTION-4
//SAVE-저장기능
router.post('/:id/save2',async function(req,res,next){
  console.log('router /save2 call  '  + req);

  var obj = req.body.rowD;
  console.log(obj);

  const pool = await poolPromise;
  const result = await pool.request();

  var insp1 = obj.inspP1;
  var insp2 = obj.inspP2;
  var insp3 = obj.inspP3;

  var inspData="";
  //각 selet 기본값이 -1 이기 때문에 전 부 선택이 안되면 -3
  if((String(insp1).trim().length+String(insp2).trim().length+String(insp3).trim().length)>0){
    if(String(insp1).trim().length>0){
      inspData = String(insp1)+",";
    }

    if(String(insp2).trim().length>0){
      inspData = inspData+String(insp2)+",";
    }

    if(String(insp3).trim().length>0){
      inspData = inspData+String(insp3)+",";
    }
  }

  inspData = inspData.slice(0,-1);
  console.log(inspData);

  try{
      //user_id , user_name 은 사용안하지만 일단 담아놓음
      result.input('user_id'    , sql.Int,			obj.user_id                        );
      result.input('user_name'    , sql.NVarChar,			obj.user_name                       );

      //실제사용은 여기서부터
      result.input('lotname'    , sql.NVarChar,			obj.lotname                       );
      result.input('se_sel'    , sql.Int,			obj.se_sel                        );
      result.input('inspM'    , sql.Float,			obj.inspM                        );
      result.input('pyunM'    , sql.Float,			obj.pyunM                        );

      //이 부분에서
      //sql.VarChar 타입을 하면 대입하는 부분이 안됨
      //sql.NVarChar 타입을 해야지 대입이 된다.. 이뉴는 현재 모르겠음..
      /*
      result.input('excelP'    , sql.VarChar,			obj.excelP                          );
      result.input('ppi_sel'    , sql.VarChar,			obj.ppi_sel                          );
      result.input('inspP'    , sql.VarChar,			inspData                          );
      */

      result.input('excelP'    , sql.NVarChar,			obj.excelP                          );
      result.input('ppi_sel'    , sql.NVarChar,			obj.ppi_sel                          );
      result.input('inspP'    , sql.NVarChar,			inspData                          );


      result.input('pumm_sel'    , sql.Int,			obj.pumm_sel                          );
      result.input('regiDT'    , sql.DateTime,			obj.regiDT                      );
      result.input('bigo'    , sql.NVarChar,			''               );
      result.input('delflag'    , sql.Int,			1               );



    var query = `insert into lot_test1(
      lot,
      se,
      inspM,
      pyunM,
      excelP,
      ppi,
      inspP,
      pid,
      timestamp,
      bigo,
      delflag
    ) values (
      @lotname,
      @se_sel,
      @inspM,
      @pyunM,
      @excelP,
      @ppi_sel,
      @inspP,
      @pumm_sel,
      @regiDT,
      @bigo,
      @delflag
    )`;
    console.log(query);
    result.query(query, async function (err, data) {
        var status;

        if (err){ console.log(err);}
        else{
          status={
            "user_id" : obj.user_id,
            "status" : '200',
            "message" : 'login success'
          }
          var result_status = JSON.stringify(status);
          res.send(result_status);
        }
      });//result

  }
  catch(err){
    console.log(err);
  }

});//SAVE-저장기능


module.exports = router;
