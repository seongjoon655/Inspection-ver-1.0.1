//========================================================================
//edit history
//
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
//========================================================================
var express = require('express');
var router = express.Router();
const { poolPromise } = require('../modules/contact');
const sql = require('mssql');
var TYPES = require('tedious').TYPES;


//ACTION - 3
//로그인 페이지에서 로그인 성공시 해당 ROUTER 수행
router.get('/:id',async function(req,res){

  var   Name;
  var   LOTdata;
  var   Id;
  const pool = await poolPromise;
  const result = await pool.request();

  try{

      var id = req.params.id;
      console.log('router /:id call -  login user : '+id);
      Id = id;
      //console.log(req.params);
      var query = `select id,name from insp_employee where delflag=1 and id=${id}`;
      console.log(query);
      result.query(query, async function (err, data) {
          //var data = JSON.stringify(recordset);

          Name = data;
          //console.log('Name : ' + Name);
          if (err){ console.log('??'); console.log(err);}
          else{
            //Jdata = JSON.parse(data);
            res.render('main/index',{LOTdata:null, Name:Name});
            /*
            console.log('select * from lot_test1 where delflag=1');
            result.query('select * from lot_test1 where delflag=1', async function (err, recordset) {
                var lotdata = JSON.stringify(recordset);
                if (err){ console.log(err);}
                else{
                  LOTdata = JSON.parse(lotdata);
                  //console.log(Name);
                  res.render('main/index',{LOTdata:LOTdata, Name:Name});
                }

            });
            */
          }//else

      });



  }catch(err){
    res.status(500);
    res.send(err.message);
  }//try&catch
});


//ACTION-3.5
//사용자가 날짜를 선택할 때 수행
router.get('/login/loginid/datesel',async function(req,res,next) {
      var   Name;
      var   LOTdata;
      var   Id;
      var dateText = req.query.dateText;
      var userid = req.query.userid;
      console.log('router /login/loginid/datesel call~!  params ['+ dateText + ']');

      const pool = await poolPromise;
      const result = await pool.request();

      try{

        var id = userid;
        console.log('router /login/loginid/datesel call -  login user : '+id);
        Id = id;
        //console.log(req.params);
        var query = `select id,name from insp_employee where delflag=1 and id=${id}`;
        console.log(query);
        result.query(query, async function (err, data) {
            //var data = JSON.stringify(recordset);

            Name = data;
            //console.log('Name : ' + Name);
            if (err){ console.log('??'); console.log(err);}
            else{



                    var query = `
                    SELECT * FROM (
                        SELECT
                            id,
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
                            delflag,
                            ISNULL( CONVERT( VARCHAR, convert(date, [timestamp])),'' ) as dpic
                            FROM lot_test1
                        ) AS TT
                     where delflag=1 and dpic='${dateText}'`;
                    console.log(query);
                    result.query(query, async function (err, lotlist) {
                        //var lotdata = JSON.stringify(recordset);
                        if (err){ console.log(err);}
                        else{
                          //LOTdata = JSON.parse(lotdata);
                          console.log(lotlist);
                          //res.render('main/index',{LOTdata:LOTdata, Name:Name});





                            if(data.recordset.length>0){ //로그인 접속 정보가 맞다면
                              status={
                                "lotlist" : lotlist.recordset,
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

                            var result_status = JSON.stringify(status);
                            res.send(result_status);






                        }
                    });



            }//else

        });







      }catch(err){
        res.status(500);
        res.send(err.message);
      }

});//ACTION-3.5


//ACTION - 4
//사용자가 LOT를 선택시 해당 ROUTER 수행
router.get('/login/loginid/lot',async function(req,res,next) {

      var lot_id = req.query.lot_id;
      var uid = req.query.user_id;
      console.log('router /login/loginid/lot call~!  params ['+ lot_id + ']');

      const pool = await poolPromise;
      const result = await pool.request();
      var    pummData;
      try{
        var status;
        var query = `select * from lotDetailView where pid=(select pid from lot_test1 where delflag=1 and id=${lot_id})`;
        console.log(query);
        result.query(query, async function (err, data) {
            //console.log(data.recordset.length);
            //console.log(data);
            if (err){ console.log(err);}
            else{

                    var query = `
                    select * from
                    (select * from ng_info where delflag=1) as t1
                    right outer join
                    (
                    	select ng_id from sy_info
                    		where
                    			hogi_id=(select pid from pumm_info where delflag=1 and id=(select pid from lot_test1 where delflag=1 and id=${lot_id}))
                    			and
                    			pumm_id=(select pid from lot_test1 where delflag=1 and id=${lot_id})
                          and
                          delflag=1
                    ) as t2
                    on t1.id=t2.ng_id
                    `;
                    console.log(query);
                    result.query(query, async function (err1, ngdata) {
                      if (err1){ console.log(err1);}
                      else{

/*
                              잘못된 쿼리 - 일단은 유정선 책임으로 부터 데이터 입력 받은 부분이 있어서 일단은 놔둠
                              var joinQuery = `
                              select * from
                              (select * from ng_rowdata where delflag=1 and lotid=(select pid from lot_test1 where id=${lot_id}) and user_id=${uid}) as t1
                              inner join
                              (
                              select * from(
                              	select d_id
                              	,STUFF((select ',' + lbname from dynamic_list where d_id = A.d_id FOR XML PATH('')),1,1,'') AS 'lbnames'
                              	,STUFF((select ',' + convert(VARCHAR,val) from dynamic_list where d_id = A.d_id FOR XML PATH('')),1,1,'') AS 'lbvalues'
                              	from dynamic_list as A
                              ) A group by A.d_id, A.lbnames, A.lbvalues having
                               d_id IN (select dynamic_id from ng_rowdata  where delflag=1 and lotid=(select pid from lot_test1 where id=${lot_id}) and user_id=${uid})
                               ) as t2
                               on t1.dynamic_id = t2.d_id
                              `;
                              */
                              //불량 리스트 쿼리
                              var joinQuery = `
                              select * from
                              (select * from ng_rowdata where delflag=1 and lotid=${lot_id} and user_id=${uid}) as t1
                              inner join
                              (
                              select * from(
                              	select d_id
                              	,STUFF((select ',' + lbname from dynamic_list where d_id = A.d_id FOR XML PATH('')),1,1,'') AS 'lbnames'
                              	,STUFF((select ',' + convert(VARCHAR,val) from dynamic_list where d_id = A.d_id FOR XML PATH('')),1,1,'') AS 'lbvalues'
                              	from dynamic_list as A
                              ) A group by A.d_id, A.lbnames, A.lbvalues having
                               d_id IN (select dynamic_id from ng_rowdata  where delflag=1 and lotid=${lot_id} and user_id=${uid})
                               ) as t2
                               on t1.dynamic_id = t2.d_id
                              `;
                              console.log(joinQuery);
                              result.query(joinQuery, async function (err2, ngrow) {
                                if (err2){ console.log(err2);}
                                else{
                                    console.log(ngrow);



                                                                if(data.recordset.length>0){ //로그인 접속 정보가 맞다면
                                                                  status={
                                                                    "lot_id" : lot_id,
                                                                    "ngrow" : ngrow.recordset,
                                                                    "ngjson" : ngdata.recordset,
                                                                    "inspNum" : data.recordset[0].hinspNum,
                                                                    "status" : '200',
                                                                    "pname" : data.recordset[0].pname,
                                                                    "pnicname" : data.recordset[0].pnicname,
                                                                    "labelname" : data.recordset[0].hlabelname,
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

                                                                var result_status = JSON.stringify(status);
                                                                res.send(result_status);


                                }
                              });//query3

                      }
                    });//query2


            }//else

        });//query1



      }catch(err){
        res.status(500);
        res.send(err.message);
      }

});


//ACTION-SAVE
router.post('/save',async function(req,res,next){
  console.log('router /save call  '  + req);

  var obj = req.body.rowD;
  console.log(obj);

  const pool = await poolPromise;
  const result = await pool.request();


//ng id 를 추가
  try{

    //begin tran 이 필요함..
      var new_id = await pool.request().query('select isnull(max(d_id)+1,1) as cnt from dynamic_list');
      //console.log('----------');
      //console.log(new_id);
      //console.log('----------');
      //console.log(new_id.recordset[0].cnt);
      //console.log(new Date());
      const dynamic_tbKey = new_id.recordset[0].cnt ;
      console.log('dynamic_tbKey : ' + dynamic_tbKey);

      result.input('lotid'    , sql.Int,			obj.lotid                        );
      result.input('ngid'    , sql.Int,			obj.ngvalue_cc                         );
      result.input('ngname'    , sql.NVarChar,			obj.ngname                       );
      result.input('ngcnt'    , sql.Int,			obj.ngcnt                        );
      result.input('howto'    , sql.Int,			obj.howto                        );
      result.input('lev'    , sql.Int,			obj.level                          );
      result.input('len'    , sql.Int,			obj.len                          );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
//      result.input('size'    , sql.Float,			obj.size                         );
result.input('size'    , sql.Int,			obj.size                         );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
      result.input('decision'    , sql.Int,			obj.decision                     );
      result.input('posi_standard'    , sql.Int,			obj.posi_standard                );
      result.input('calibration'    , sql.Int,			obj.calibration                  );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
//      result.input('pos'    , sql.Float,			obj.pos                          );
result.input('pos'    , sql.Int,			obj.pos                          );
//      result.input('wid'    , sql.Float,			obj.wid                          );
result.input('wid'    , sql.Int,			obj.wid                          );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
      result.input('period'    , sql.Int,			obj.period                       );
      result.input('unit'    , sql.Int,			obj.unit                         );
      result.input('comment'    , sql.NVarChar,			obj.comment                      );
      result.input('hogi_id'    , sql.Int,			Object.keys(obj.dymanicData).length                      );
      result.input('dynamic_id'    , sql.Int,			dynamic_tbKey                 );
      result.input('user_id'    , sql.Int,			obj.user_id                 );
      result.input('datatime'    , sql.DateTime,			new Date()               );
      result.input('delflag'    , sql.Int,			1               );



    var query = `insert into ng_rowdata(
      lotid,
      ngid,
      ngname,
      ngcnt,
      howto,
      lev,
      len,
      size,
      decision,
      posi_standard,
      calibration,
      pos,
      wid,
      period,
      unit,
      comment,
      hogi_id,
      dynamic_id,
      user_id,
      datatime,
      delflag
    ) values (
      @lotid,
      @ngid,
      @ngname,
      @ngcnt,
      @howto,
      @lev,
      @len,
      @size,
      @decision,
      @posi_standard,
      @calibration,
      @pos,
      @wid,
      @period,
      @unit,
      @comment,
      @hogi_id,
      @dynamic_id,
      @user_id,
      @datatime,
      @delflag
    )`;
    //console.log(query);
    result.query(query, async function (err, data) {
        var status;

        if (err){ console.log(err);}
        else{

          //console.log(data);
          /*
          status={
            "id" : 999,
            "status" : '400',
            "message" : 'test'
          };
          console.log('1');
          var result = JSON.stringify(status);
          console.log('2');
          */
          //res.send(obj);
        }
      });

      var dlen = Object.keys(obj.dymanicData).length;

console.log('---------------');
console.log(Object.keys(obj.dymanicData));
console.log('---------------');

      var dymaic_queryCnt = 0;

      for(i=0;i<dlen;i++){
        /*
        var query1 = `insert into dynamic_list(
          d_id,
          lbname,
          val
        ) values (
          ${dynamic_tbKey},
          '${Object.keys(obj.dymanicData)[i]}',
          ${Object.values(obj.dymanicData)[i]}
        )`;
        */
        var query1 = `insert into dynamic_list(
          d_id,
          lbname,
          val
        ) values (
          ${dynamic_tbKey},
          '${Object.values(obj.dymanicKey)[i]}',
          ${Object.values(obj.dymanicData)[i]}
        )`;


console.log(Object.values(obj.dymanicKey)[i] + '    ' + Object.values(obj.dymanicData)[i] );
console.log('---------------');
          //console.log(query1);

          result.query(query1, async function (err, data) {
              var status;

              if (err){ console.log(err);}
              else{


                  console.log(dymaic_queryCnt);

                  if(dymaic_queryCnt==(dlen-1)){
                    //쿼리 수정 진행
                    //이 부분을 밖으로
                    // result.query(query1, async function (err, data)  쿼리 밖으로 빼서 실행할 경우
                    // 정상적은 동작이 되지 않음..
                    // async 동작 때문에 일어나는 것으로 판단되어,
                    // 상단 쿼리가 종료 후에 해당 id 를 얻어올 수 있기 때문에 함수 실행 후 콜백 내에서 진행하게 변경
                    //추가적으로  dynamic column 의 갯수만큼 불리기 때문에 마지막 루프의 쿼리에서만 종료 쿼리를 날리게 추가
                    var obj_id = await pool.request().query('select id from ng_rowdata where dynamic_id='+dynamic_tbKey);
                    console.log(obj_id);
                    const resid = obj_id.recordset[0].id ;
                    console.log("[obj_id]   : " + resid);
                    obj.id = resid;

                    res.send(obj);
                    //쿼리 수정 진행
                  }
                  else{
                    dymaic_queryCnt++
                  }

              }
            });
        }



  }
  catch(err){
    console.log(err);
  }

});


//ACTION-UPDATE
router.post('/update',async function(req,res,next){
  console.log('router /update call  '  + req);
  var obj = req.body.rowD;
  console.log(obj);

  const pool = await poolPromise;
  const result = await pool.request();

  try{

    //begin tran 이 필요함..
    var selrow = await pool.request().query(`select dynamic_id from ng_rowdata where id=${obj.record_id}`);
    //console.log('----------');
    const dynamic_tbKey = selrow.recordset[0].dynamic_id ;
    console.log('dynamic_tbKey : ' + dynamic_tbKey);

    //기본 static field
    result.input('ngcnt'    , sql.Int,			obj.ngcnt                        );
    result.input('howto'    , sql.Int,			obj.howto                        );
    result.input('lev'    , sql.Int,			obj.level                          );
    result.input('len'    , sql.Int,			obj.len                          );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
//    result.input('size'    , sql.Float,			obj.size                         );
result.input('size'    , sql.Int,			obj.size                         );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
    result.input('decision'    , sql.Int,			obj.decision                     );
    result.input('posi_standard'    , sql.Int,			obj.posi_standard                );
    result.input('calibration'    , sql.Int,			obj.calibration                  );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
//    result.input('pos'    , sql.Float,			obj.pos                          );
result.input('pos'    , sql.Int,			obj.pos                          );
//    result.input('wid'    , sql.Float,			obj.wid                          );
result.input('wid'    , sql.Int,			obj.wid                          );
//담당자 유정선 책임과 상담 후 전부 float 에서 int 로 변경 - 2020.07.28
    result.input('period'    , sql.Int,			obj.period                       );
    result.input('unit'    , sql.Int,			obj.unit                         );
    result.input('comment'    , sql.NVarChar,			obj.comment                      );
    //추가적인 업데이트 정보
    result.input('dynamic_id'    , sql.Int,			dynamic_tbKey                 );
    result.input('user_id'    , sql.Int,			obj.user_id                 );
    result.input('datatime'    , sql.DateTime,			new Date()               );


    //수정을 할 때 날짜가 업데이트가 되면 나중에 조회 시에 문제가 발생되기 때문에
    //업데이트에 대한 부분의 datatime 은 저장하지 않는다.
    //datatime=@datatime 제거
    var rowdataQuery = `
      update
      ng_rowdata set
        ngcnt=@ngcnt,
        howto=@howto,
        lev=@lev,
        len=@len,
        size=@size,
        decision=@decision,
        posi_standard=@posi_standard,
        calibration=@calibration,
        pos=@pos,
        wid=@wid,
        period=@period,
        unit=@unit,
        comment=@comment
      where id=${obj.record_id}
    `;


    console.log('obj.unit : '+obj.unit);//rowdataQuery);

    result.query(rowdataQuery, async function (err, data) {
        var status;
        if (err){ console.log(err);}
        else{
          console.log(data);

        }
    });


      var dlen = Object.keys(obj.dymanicData).length;

console.log('---------------');
console.log(Object.keys(obj.dymanicData));
console.log('---------------');

      var errorCnt = 0;
      var okCnt = 0;
      for(i=0;i<dlen;i++){

        var query1 = `
        update
        dynamic_list set
          val=${Object.values(obj.dymanicData)[i]}
        where d_id=${dynamic_tbKey} and lbname='${Object.values(obj.dymanicKey)[i]}'
        `;

console.log(Object.values(obj.dymanicKey)[i] + '    ' + Object.values(obj.dymanicData)[i] );
console.log('---------------');
          console.log(query1);

          result.query(query1, async function (err, data) {
              var status;

              if (err){
                errorCnt++;
                console.log(err);
              }
              else{
                  //console.log(data);
                  okCnt++;
                  console.log(okCnt);
                  /*
                  if(data.recordset.length>0){ //로그인 접속 정보가 맞다면
                    status={
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

                  var result_status = JSON.stringify(status);
                  res.send(result_status);
                  */
              }
            });

        }// for 문

        if(errorCnt>0){ //로그인 접속 정보가 맞다면
          status={
            "id" : 999,
            "status" : '300',
            "message" : 'login fail'
          }
        }
        else{
          status={
            "status" : '200',
            "message" : 'login success'
          }
        }//else

        var result_status = JSON.stringify(status);
        res.send(result_status);


  }
  catch(err){
    console.log(err);
  }


});


//ACTION - 5
//사용자가 NG를 선택시 해당 ROUTER 수행
router.get('/login/loginid/ngsel',async function(req,res,next) {

        var lot_pids = req.query.lot_pid;
        var ng_ids = req.query.ng_id;
        //console.log('router /login/loginid/ngsel call~!  params ['+ lot_pids + '/' + ng_ids ']');
        //console.log(req.query);
        //console.log(lot_pids);
        //console.log(ng_ids);
        var logdata = `router /login/loginid/ngsel call~!  params [ ${lot_pids} / ${ng_ids} ]`;
        console.log(logdata);

        const pool = await poolPromise;
        const result = await pool.request();

        try{
          //var query = `select * from lotDetailView where pid=${lot_pid}`;
          var query = `select pid as hnum, id as pnum from pumm_info where id=(select pid from lot_test1 where id=${lot_pids})`;
          console.log(query);
          result.query(query, async function (err, data) {
                  if (err){ console.log(err);}
                  else{

                    var hid = data.recordset[0].hnum;
                    var pid = data.recordset[0].pnum;
                        var addQuery = `
                        select * from sy_info where
                          hogi_id= ${hid} and
                          pumm_id= ${pid} and
                          ng_id= ${ng_ids}
                        `;
                        console.log(addQuery);
                        result.query(addQuery, async function (err2, ngdata) {
                            if (err){ console.log(err2);}
                            else{
                                      //console.log('///////////////////////'+ng_ids);
                                      if(ngdata.recordset.length>0){ //로그인 접속 정보가 맞다면
                                          status={
                                            "ngid" : ng_ids,
                                            "ngtxt" : ngdata.recordset[0].ok_stdd_txt,
                                            "sytxt" : ngdata.recordset[0].sy_cond_txt,
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
                                      var result_status = JSON.stringify(status);
                                      res.send(result_status);

                            }
                        });//query2
                  }
          });//query1

        }catch(err){
          res.status(500);
          res.send(err.message);
        }

});


//ACTION - 6
//사용자의 리스트 삭제 요청
router.post('/delete',async function(req,res,next){

  var obj = req.body.delRowIds;
  console.log('router /delete call  '  + obj);
  /*
  var delid;
  for(i=0;i<obj.length;i++){
    delid += obj[i];
    delid += ',';
  }

  delid = delid.slice(0,-1);
  console.log(delid);
  */

  const pool = await poolPromise;
  const result = await pool.request();

  try{
      var query = `delete from ng_rowdata where id in (${obj})`;
      result.query(query, async function (err, data) {
              var status;

              if (err){ console.log(err);}
              else{
                console.log(data.rowsAffected);

                  if(data.rowsAffected>0){
                      status={
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

                  var result_status = JSON.stringify(status);
                  res.send(result_status);

              }

      });
  }
  catch(err){
    console.log(err);
  }

});



/*
router.post('/initlot/check', async function(req,res,next){
  console.log('router /inilotCheck call 1 ' );
});
*/

module.exports = router;



/*
router.get('/logiid',()=>{
  //res.render('main/home',{Logindata:''});
  console.log('route call loginid');
});
*/

/*
router.post('/', async function(req,res,next){
  try{
    //const pool = await poolPromise;
    //const result = await pool.request();
//    var query = "insert into email_test1 (name,email) values(@name, @email)";

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
*/
/*
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
*/
