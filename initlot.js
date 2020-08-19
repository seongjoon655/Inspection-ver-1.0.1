//전역변수 선언
let HTTP = 'http://';
let IP = '172.29.2.42';
let PORT = '8001';
let DEFAULT_URL = HTTP + IP + ':' + PORT;

let SAVE_ENABLE = 1;

let EMP = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;";
//global.DEFAULT_URL = DEFAULT_URL;

$(function() {

  //중복상태 취소
 $(".cancel-check").on("click", function () {
    $(".duplicate-check")[0].style.visibility = 'visible';
    $(".cancel-check")[0].style.visibility = 'hidden';

    blewDefault();
    duplstting(true);


    var lotNM = $('#lotNM');
    lotNM[0].disabled = false;
    /*
    var se_sel = $('#se_sel');
    se_sel[0].selectedIndex = 0;
    se_sel[0].disabled = false;*/
    $('#se_sel')[0].disabled = false;


    lotNM.focus();
  });//중복상태 취소

  //중복검사
 $(".duplicate-check").on("click", function () {
    var lotNM = $('#lotNM').val();
//    var se_sel_val = 0;// se_sel.options[se_sel.selectedIndex].value;
//    var se_sel_idx = se_sel.options[se_sel.selectedIndex].value;
    var se_sel_val = $('#se_sel').val();

    var row = {
      'lotname' : $('#lotNM').val(),
      'se_val' : se_sel_val
    }

    if(lotNM.trim().length <= 0){
      lotNM = lotNM.trim();
      $('#lotNM')[0].value = lotNM;
      alert('LOT 이름을 정확하게 입력해주세요.');
      return;
    }
    else{
      lotNM = lotNM.trim();
      $('#lotNM')[0].value = lotNM;
    }

    if(se_sel_val==-1){
      alert('START/END 원단의 타입을 선택해주세요.');
      return;
    }

    //중복검사를 할떄는 전체적으로 한번 초기화를 해준다.
    //안정성을 위해서 - 신뢰성...
    //불필요시..제거해도됨
    var hogisel_div = $('#slct_hogi_sel');
    hogisel_div.children().remove();
    $('#hogi_sel').val(-1);
    $('#hogi_sel').html(EMP);
    var pummsel_div = $('#slct_pumm_sel');
    pummsel_div.children().remove();
    $('#pumm_sel').val(-1);
    $('#pumm_sel').html(EMP);
    //불필요시..제거해도됨

    $.ajax({
      type:'POST',
      url:'/initlot/:id/check',
      dataType:'json',
      data:{rowD : row},
      success:function(data){
        if(data.status=='200'){
          console.log('success');
          var islot = data.islot;
          //var hogilist = data.hogilist;
          var emplist = data.emplist;

          var hogisel_div = $('#slct_hogi_sel');

          var tr= document.createElement("tr");
          hogisel_div[0].appendChild(tr);

          var newel = document.createElement("td");
          newel.tabIndex = 0;
          newel.innerText = '                             ';
          //var id = 'none';
          var useid = $('#user_id').val();
          var text =  newel.innerText;
          newel.onclick= new Function("","selAction('hogi_sel',-1,"+useid+",'"+text+"',false);");
          newel.onkeydown= new Function("","selAction('hogi_sel',-1,"+useid+",'"+text+"',true);");
          newel.className = 'my_dclass dropdown-item';
          tr.appendChild(newel);


          var rowObj = data.hogilist;
          var rowCnt = rowObj.length;
          if(rowCnt>0){
              for(i=0;i<rowCnt;i++){
                var newel = document.createElement("td");
                newel.className = 'my_dclass dropdown-item';
                newel.tabIndex = i+1;
                newel.innerText = rowObj[i].name;
                newel.value = rowObj[i].id;
                var id = newel.value;
                var useid = $('#user_id').val();
                var text =  newel.innerText;
                newel.onclick= new Function("","selAction('hogi_sel',"+id+","+useid+",'"+text+"',false);");
                newel.onkeydown= new Function("","selAction('hogi_sel',"+id+","+useid+",'"+text+"',true);");
                tr.appendChild(newel);
              }
          }

          var lotNM = $('#lotNM');
          lotNM[0].disabled = true;
          $('#se_sel')[0].disabled = true;

          $(".duplicate-check")[0].style.visibility = 'hidden';
          $(".cancel-check")[0].style.visibility = 'visible';

          duplstting(false);

          alert('사용 가능한 LOT 입니다.');
          //hogi_select.focus();
          $('#hogi_sel').focus();
        }
        else{
          console.log('fail');
          alert('이미 등록된 LOT 입니다.');

          var lotNM = $('#lotNM');
          lotNM[0].value = "";

          //var se_sel = $('#se_sel');
          //se_sel[0].selectedIndex=0;

          $('#se_sel')[0].disabled = false;

          $('#se_sel').focus();
        }

      },
      err:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }

    });//ajax

  });//duplicate-check

  //로그아웃
 $(".log-out2").on("click", function () {
    var url = DEFAULT_URL+"/login";
    //var url = DEFAULT_URL;
    window.location=url;
    return;
  });//logout


  //이전페이지 - Inspection Page
 $(".pre-page").on("click", function () {

    var loginid = $('#user_id')[0].value;

    var url = DEFAULT_URL+"/"+ loginid;
    //var url = DEFAULT_URL;
    window.location=url;
    return;
  });//move - Inspcetion Page


  //저장
 $(".save2").on("click",function(){
    if(saveConditionCheck()){
      alert('필수(*) 입력사항을 전부 입력해주세요.');
      return;
    }
    else{
      ;//none;
    }

    //저장 중복 입력 방지
    if(SAVE_ENABLE==1){
      SAVE_ENABLE=0;
    }
    else{ // SAVE_ENABLE==0 이라면 동작하지 않음
      return;
    }



    var row = {
      'user_id' : $('#user_id').val(),                                                          //사용자id
      'user_name' : $('#user_name').val(),                                                      //사용자명
      'lotname' : $('#lotNM').val(),                                                            //lot이름
      'se_sel' : $('#se_sel').val(),                        //START/END 인지 값
      'hogi_sel' : $('#hogi_sel').val(),                //호기 값
      'pumm_sel' : $('#pumm_sel').val(),                //품명 값
      'regiDT' :  $('#regiDT').val(),                                                           //날짜 값
      'pyunM' :  $('#pyunM').val(),                                                             //편광자폭 값
      'inspM' :  $('#inspM').val(),                                                             //검사M 값
      'ppi_sel' : $('#ppi_sel').val(),                                                          //PPI 값
      'inspP1' : $('#inspP1').val(),                                                            //검사자(名)-1 값
      'inspP2' : $('#inspP2').val(),                                                            //검사자(名)-2 값
      'inspP3' : $('#inspP3').val(),                                                            //검사자(名)-3 값
      'excelP' : $('#excelP').val()                                                             //엑셀(名) 값
    };

    duplstting(true);

    $.ajax({
      type:'POST',
      url:'/initlot/:id/save2',
      dataType:'json',
      data:{rowD : row},
      success:function(data){

          if(data.status=='200'){

            if(confirm('등록이 완료되었습니다. <Inspection Page> 로 이동할까요?')){
              var url = DEFAULT_URL+"/" + data.user_id;
              window.location=url;
              return;
            }
            else{
              SAVE_ENABLE=1;
              var url = DEFAULT_URL+"/initlot/" + data.user_id;
              window.location=url;
            }
          }//status - 200
          else{
            alert('품명등록 실패');
            SAVE_ENABLE=1;
          }

      },
      err:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }
    });//ajax

  });//save


}); //$(function()


//LOT정보입력
function InspectionPage(id){
    //alert('page call : ' + DEFAULT_URL);
    var url = DEFAULT_URL+"/" + id;
    //var url = DEFAULT_URL;
    window.location=url;
    return;
}

//각 옵션에 대한 부분을 저장
function addOption(selector,datalist){
  var option = document.createElement("option");
  option.text = '';
  option.value = -1;
  selector[0].appendChild(option);

  datalist.forEach((item, i) => {
    var id = item.id;
    var name = item.name;
    var option = document.createElement("option");
    option.text = name;
    option.value = id;
    selector[0].appendChild(option);
  });
}

//중복검사에 대한 ok,ng 상태
function duplstting(status){
  $("#hogi_sel")[0].disabled = status;
  $("#pumm_sel")[0].disabled = status;
  $("#regiDT")[0].disabled = status;
  $("#pyunM")[0].disabled = status;
  $("#inspM")[0].disabled = status;
  $("#ppi_sel")[0].disabled = status;
  $("#inspP1")[0].disabled = status;
  $("#inspP2")[0].disabled = status;
  $("#inspP3")[0].disabled = status;
  $("#excelP")[0].disabled = status;
}

//중복상태 취소버튼 누를때 하단의 diable 될 메뉴를 다시 초기화 시키는 부분
function blewDefault(){

  $("#hogi_sel").val(-1);
  $("#hogi_sel").html(EMP);
  $("#pumm_sel").val(-1);
  $("#pumm_sel").html(EMP);

  $("#regiDT")[0].value = '';
  $("#pyunM")[0].value = '';
  $("#inspM")[0].value = '';

  $("#ppi_sel")[0].value = '';
  $("#inspP1")[0].value = '';
  $("#inspP2")[0].value = '';
  $("#inspP3")[0].value = '';
  $("#excelP")[0].value = '';
}

//DATEPICKER - 등록날짜 선택
$(function(){
  $("#regiDT").datepicker({
    onSelect:function(dateText, inst) {
      $('#pyunM').focus();
    }//onSelect
  });//datepicker
});//function

//save 가 가능한지 조건 체크
function saveConditionCheck(){
  var checkcnt = 0;
  var lotNM = $('#lotNM').val();
  if(lotNM.trim().length<=0){
    checkcnt++;
  }
  if($('#se_sel').val()==-1){
    checkcnt++;
  }
  if($('#hogi_sel').val()==-1){
    checkcnt++;
  }
  if($('#pumm_sel').val()==-1){
    checkcnt++;
  }
  if($("#regiDT")[0].value.trim().length<=0){
    checkcnt++;
  }
  if($("#pyunM")[0].value.trim().length<=0){
    checkcnt++;
  }
  if($("#inspM")[0].value.trim().length<=0){
    checkcnt++;
  }

  return checkcnt;
}

//숫자필터링
function handlerNum( obj ) {
  //숫자만 입력 받게끔 하는 함수.
    e = window.event; //윈도우의 event를 잡는것입니다.

    //입력 허용 키
    if( ( e.keyCode >=  48 && e.keyCode <=  57 ) ||   //숫자열 0 ~ 9 : 48 ~ 57
        ( e.keyCode >=  96 && e.keyCode <= 105 ) ||   //키패드 0 ~ 9 : 96 ~ 105
          e.keyCode ==   8 ||    //BackSpace
          e.keyCode ==  46 ||    //Delete
          e.keyCode == 110 ||    //소수점(.) : 문자키배열
          e.keyCode == 190 ||    //소수점(.) : 키패드
          e.keyCode ==  37 ||    //좌 화살표
          e.keyCode ==  39 ||    //우 화살표
          e.keyCode ==  35 ||    //End 키
          e.keyCode ==  36 ||    //Home 키
          e.keyCode ==   9       //Tab 키
      ) {

      if(e.keyCode == 48 || e.keyCode == 96) { //0을 눌렀을경우
        if ( obj.value == '0' ) //아무것도 없거나 현재 값이 0일 경우에서 0을 눌렀을경우
          e.returnValue=false; //-->입력되지않는다.
        else //다른숫자뒤에오는 0은
          return; //-->입력시킨다.
        }

      else //0이 아닌숫자
        return; //-->입력시킨다.
      }
      else //숫자가 아니면 넣을수 없다.
   {
    //alert('숫자만 입력가능합니다');
    e.returnValue=false;
   }
   if(isNaN(obj.value)==true){
     alert('숫자만 입력해주세요.');//문자
     return;
   }
   else{
     ;//숫자
   }
}


//일반 router 쿼리없이 사용하는 dropdown 에서 포커싱을 넘길떄 사용하는 함수
function dropdownSetting(motherid,id,text,keydown,next){
    if(keydown){
      e = window.event; //윈도우의 event를 잡는것입니다.
      if(e.keyCode == 13 ){
        ;
      }
      else{
         return;
      }
    }
    var el = motherid;
    el.value=id;
    el.textContent = text;
    /*
    if(keydown){
      $(el).dropdown('toggle');
    }
    */
    next.focus();
    /*
    if(id==-1){
    }
    else{
      next.focus();
    }
    */
}


function selAction(motherid,id,user,text_lot,keydown){

    var retEl = document.getElementById(motherid);
    if(keydown){
      e = window.event; //윈도우의 event를 잡는것입니다.
      if(e.keyCode == 13 ){
        ;
      }
      else{
         return;
      }
    }

    var s1 = id;
    var uid = user;
    var text = text_lot;

    if(s1==-1){
      var pummsel_div = $('#slct_pumm_sel');
      pummsel_div.children().remove();
      $('#pumm_sel').val(id);
      $('#pumm_sel').html(EMP);

      retEl.value = id;
      $('#hogi_sel').html(EMP);
      /*
      if(keydown){
        $(retEl).dropdown('toggle');
      }
      */
      document.getElementById("hogi_sel").focus();
    }
    else{

          $.ajax({
            type:'POST',
            url:'/initlot/:id/hogisel',
            dataType:'json',
            data : {hogi_id:s1, user_id:uid},
            success:function(data){
              if(data.status=='200'){
                console.log('success');
                //var pummlist = data.pummlist;

                var pummsel_div = $('#slct_pumm_sel');

                pummsel_div.children().remove();

                var tr= document.createElement("tr");
                pummsel_div[0].appendChild(tr);

                var newel = document.createElement("td");
                newel.tabIndex = 0;
                newel.innerText = '                             ';
                //var id = 'none';
                var useid = $('#user_id').val();
                var text =  newel.innerText;
                newel.onclick= new Function("","selAction_pm('pumm_sel',-1,"+useid+",'"+text+"',false);");
                newel.onkeydown= new Function("","selAction_pm('pumm_sel',-1,"+useid+",'"+text+"',true);");
                newel.className = 'my_dclass dropdown-item';
                tr.appendChild(newel);


                var rowObj = data.pummlist;
                var rowCnt = rowObj.length;
                if(rowCnt>0){
                    for(i=0;i<rowCnt;i++){
                      var newel = document.createElement("td");
                      newel.className = 'my_dclass dropdown-item';
                      newel.tabIndex = i+1;
                      newel.innerText = rowObj[i].name;
                      newel.value = rowObj[i].id;
                      var id = newel.value;
                      var useid = $('#user_id').val();
                      var text =  newel.innerText ;
                      newel.onclick= new Function("","selAction_pm('pumm_sel',"+id+","+useid+",'"+text+"',false);");
                      newel.onkeydown= new Function("","selAction_pm('pumm_sel',"+id+","+useid+",'"+text+"',true);");
                      tr.appendChild(newel);
                    }
                }

                //pumm_select.focus();
                $('#pumm_sel').focus();
              }//status - 200
              else{
                alert('품명정보 실패 : ' + data.message);
              }
            },
            err:function(request,status,error){
              alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            },
            complete : function() {
              retEl.value = id;
//            retEl.textContent = text ;
              $('#hogi_sel').html(text + "&emsp;&emsp;&emsp;&emsp;&emsp;");

              $('#pumm_sel').val(-1);
              $('#pumm_sel').html(EMP);


              if(keydown){
                $(retEl).dropdown('toggle');
              }
              document.getElementById("pumm_sel").focus();
            }
          });//ajax
    }
}


function selAction_pm(motherid,id,user,text_lot,keydown){
  var retEl = document.getElementById(motherid);
  if(keydown){
    e = window.event; //윈도우의 event를 잡는것입니다.
    if(e.keyCode == 13 ){
      ;
    }
    else{
       return;
    }
  }

  if(id==-1){
    $('#pumm_sel').val(id);
    $('#pumm_sel').html(EMP);

    if(keydown){
      $(retEl).dropdown('toggle');
    }
    $('#pumm_self').focus();
  }
  else{
    retEl.value = id;
    retEl.textContent = text_lot ;
    if(keydown){
      $(retEl).dropdown('toggle');
    }
    $('#regiDT').focus();
  }

}
