
//전역변수 선언
let HTTP = 'http://';
let IP = '172.29.2.42';
let PORT = '8001';
let DEFAULT_URL = HTTP + IP + ':' + PORT;

let EMP = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;";
//global.DEFAULT_URL = DEFAULT_URL;


//버튼별 동작 function
$(function() {

  //로그인
  $(".login100-form-btn").on("click", function () {

//    var sel = $('#slct1')[0];
//    var uid = sel.options[sel.selectedIndex].value;
    var uid = $('#slct1').val();
    var pass = $("#pass").val();

    //if(uid!="none"){

        $.ajax({
          //url:'/login/'+uid,
          type:'GET',
          url:'/login/loginid',
          dataType:'json',
          data : {userid:uid,pw:pass},
          success:function(data){
            if(data.status=='200'){
              console.log('success');
              //alert('로그인 성공 : ' + data.id);
              //window.location.replace("../" + data.id);
              //window.location="http://172.29.2.42:8001/"+ data.id;
              window.location=DEFAULT_URL +"/" + data.id;


              //var newurl = "http://172.29.2.42:8001/" + data.id;
              //var newurl = "http://localhost:8001/" + data.id;
              //window.history.pushState("", "", newurl);
              //window.location.reload();
            }
            else{
              console.log('fail');
              //alert('로그인 실패 : ' + data.id);
              //window.location.replace("/login");
              //window.location="http://172.29.2.42:8001/login";
              window.location=DEFAULT_URL+"/login";

              //var newurl = "http://172.29.2.42:8001/login";
              //window.history.pushState("", "", newurl);
              //window.location.reload();
            }
    //        window.location.replace("/login");   - login 페이지로 이동
          },
          err:function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
          }

        });//ajax

  });//login

  //로그아웃
  $(".log-out").on("click", function () {
    //var newurl = "http://172.29.2.42:8001/login";
    //window.history.pushState("", "", newurl);
    //window.location.reload();
    window.location=DEFAULT_URL+"/login";
  });//logout

  //저장
  $(".save").on("click",function(){
    //alert('save button click');

    var row = {
      'user_id' : $('#user_id').val(),                                                          //사용자id
      'user_name' : $('#user_name').val(),                                                      //사용자명
      'lotid' : $('#dropdownMenuButton').val(),                         //저장할 lot id
      'ngname' : $('#ngMenuButton').text(),                               //불량명
      'ngvalue_cc' : $('#ngMenuButton').val(),                          //불량명id값
      'ngcnt' :  $('#ngcnt').val(),                                                             //불량카운터
      'howto' : $('#howto').val(),                          //검사방법
      'level' : $('#level').val(),                          //레벨
      'len' :  $('#len').val(),                                                                 //길이
      'size' :  $('#size').val(),                                                               //사이즈
      'decision' : $('#decision').val(),                  //판정
      'posi_standard' : $('#posi_standard').val(),   //위치기준
      'calibration' : $('#calibration').val(),        //계측기준
      'pos' :  $('#pos').val(),                                                                 //위치
      'wid' :  $('#wid').val(),                                                                 //폭
      'period' :  $('#period').val(),                                                           //주기
      'unit' : $('#unit').val(),                              //단위
      'comment' :  $('#comment').val()                                                          //비고
    };

    if(row.ngvalue_cc=="none"){
      alert('불량명은 반드시 선택해주세요.');
      return;
    }

    if(parseInt(row.ngvalue_cc)==0){ //기타(その他) 선택이면 판정이 없이도
      //none 아무 동작도 하지 않는다.
    }
    else{
      if(parseInt(row.decision)==0){
        alert('판정은 반드시 선택해주세요.');
        return;
      }
    }


    var dymanicArr_key = [];
    var dk_table = $('#dynamic_input_tb thead tr td label');
    for(idx=0;idx<dk_table.length;idx++){
      dymanicArr_key.push(dk_table[idx].innerText);
    }

    var dymanicArr_val = [];
    var dv_table = $('#dynamic_input_tb tbody tr td input');
    for(idx=0;idx<dv_table.length;idx++){
      dymanicArr_val.push(dv_table[idx].value);
    }

    var lit = {};
    var lit1 = {};
    if(dymanicArr_key.length == dymanicArr_val.length){
      for(i=0;i<dymanicArr_key.length;i++){
        lit[dymanicArr_key[i]] = dymanicArr_val[i];
        lit1[dymanicArr_key[i]] = dymanicArr_key[i];
      }
    }

    row.dymanicData = lit;
    row.dymanicKey = lit1;

    $.ajax({
      type:'POST',
      url:'/save',
      dataType:'json',
      data:{rowD : row},
      success:function(data){
          var body = "";

          var dynamic_body = "";
          for(i=0;i<Object.keys(data.dymanicData).length;i++){
            dynamic_body += `<td width="80px">${Object.values(data.dymanicData)[i]}</td>`;
          }

            //color
            //#fa7217 => 오렌지
            var calor = (parseInt(data.decision)==2 || parseInt(data.decision)==3)?"#fa7217":"";

            //hidden 값을 보면 save 의 경우는 router 에서 parser 로 받은 data 를 그대로 다시 넘겨주기 때문에,
            //ngvalue_cc 를 사용해야한다.
            body += `<tr bgcolor=${calor}>
            <td width="80px"><input type="checkbox" id="record_${data.id}" name="record"  onclick="selbox(this.id,${data.id},${data.lotid})" />
              <input type="hidden" value=${data.id} />
              <input type="hidden" value=${data.ngvalue_cc} />
              <input type="hidden" value=${data.ngname} />
              </td>
            <td width="220px">${data.ngname}</td>
            <td width="80px">${data.ngcnt}</td>
            <td width="120px">${howto_sel[`${data.howto}`]}</td>
            <td width="80px">${level_sel[`${data.level}`]}</td>
            <td width="80px">${data.len}</td>
            <td width="80px">${data.size}</td>
            <td width="80px">${decision_sel[`${data.decision}`]}</td>
            <td width="80px">${posi_standard_sel[`${data.posi_standard}`]}</td>
            <td width="80px">${calibration_sel[`${data.calibration}`]}</td>
            <td width="80px">${data.pos}</td>
            <td width="80px">${data.wid}</td>
            <td width="80px">${data.period}</td>
            <td width="220px">${unit_sel[`${data.unit}`]}</td>
            <td width="250px">${data.comment}</td>
            ${dynamic_body}
            </tr>`;

          $("#dynamic_list_b").append(body);

          //동적 테이블 입력칸 clear
          var dv_table = $('#dynamic_input_tb tbody tr td input');
          for(idx=0;idx<dv_table.length;idx++){
            dv_table[idx].value="0";
          }


          //정적 테이블 input clear
          var maintb_input =  $('#maintb tr td').children('input');
          for(idx=0;idx<maintb_input.length;idx++){
            maintb_input[idx].value="0";
          }

          //정적 테이블 dropdown clear
          var maintb_select =  $('#maintb tr td').children('select');
          for(idx=0;idx<maintb_select.length;idx++){
            maintb_select[idx].selectedIndex = 0;
          }
          //$('#maintb tr td').children('select')[0].selectedIndex

          $('#comment')[0].value="";

          $('#spec').html('');
          $('#save')[0].style.visibility = 'hidden';

          //저장 후 불량명으로 focus 로 가게 진행
          //document.getElementById("ng").focus();
          dropdownSetdefault();

          var el = document.getElementById("ngMenuButton")
          el.value="none";
          el.textContent = "";
          el.focus();

      },
      err:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }
    });//ajax
  });//save

  //수정
  $(".update").on("click",()=>{
        //alert('수정완료~!');
        var nowSel_record = $('#selbox_record_id')[0].value;
        var _userid = $('#user_id').val();
        var _username = $('#user_name').val();
        //alert('선택값 : ' + nowSel_record);
        //alert('_userid : ' + _userid + '   /   _username : ' + _username);

        var row = {
          'record_id': nowSel_record,                                                               //선택된 selectbox id
          'user_id' : $('#user_id').val(),                                                          //사용자id
          'user_name' : $('#user_name').val(),                                                      //사용자명
          'lotid' : $('#dropdownMenuButton').val(),                         //저장할 lot id
          'ngname' : $('#ngMenuButton').text(),                               //불량명
          'ngvalue_cc' : $('#ngMenuButton').val(),                          //불량명id값
          'ngcnt' :  $('#ngcnt').val(),                                                             //불량카운터
          'howto' : $('#howto').val(),                    //검사방법
          'level' : $('#level').val(),                         //레벨
          'len' :  $('#len').val(),                                                                 //길이
          'size' :  $('#size').val(),                                                               //사이즈
          'decision' : $('#decision').val(),            //판정
          'posi_standard' : $('#posi_standard').val(),   //위치기준
          'calibration' : $('#calibration').val(),        //계측기준
          'pos' :  $('#pos').val(),                                                                 //위치
          'wid' :  $('#wid').val(),                                                                 //폭
          'period' :  $('#period').val(),                                                           //주기
          'unit' : $('#unit').val(),                           //단위
          'comment' :  $('#comment').val()                                                          //비고
        };

        if(row.ngvalue_cc=="none"){
          alert('불량명은 반드시 선택해주세요.');
          return;
        }

        if(parseInt(row.ngvalue_cc)==0){ //기타(その他) 선택이면 판정이 없이도
          //none 아무 동작도 하지 않는다.
        }
        else{
          if(parseInt(row.decision)==0){
            alert('판정은 반드시 선택해주세요.');
            return;
          }
        }

        var dymanicArr_key = [];
        var dk_table = $('#dynamic_input_tb thead tr td label');
        for(idx=0;idx<dk_table.length;idx++){
          dymanicArr_key.push(dk_table[idx].innerText);
        }

        var dymanicArr_val = [];
        var dv_table = $('#dynamic_input_tb tbody tr td input');
        for(idx=0;idx<dv_table.length;idx++){
          dymanicArr_val.push(dv_table[idx].value);
        }

        var lit = {};
        var lit1 = {};
        if(dymanicArr_key.length == dymanicArr_val.length){
          for(i=0;i<dymanicArr_key.length;i++){
            lit[dymanicArr_key[i]] = dymanicArr_val[i];
            lit1[dymanicArr_key[i]] = dymanicArr_key[i];
          }
        }

        row.dymanicData = lit;
        row.dymanicKey = lit1;


            $.ajax({
              type:'POST',
              url:'/update',
              dataType:'json',
              data:{rowD : row},
              success:function(data){

                  $('#spec').html('');

                  selAction('dropdownMenuButton',$('#dropdownMenuButton').val(),$('#user_id').val(),$('#dropdownMenuButton').text(),false);

              },
              err:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
              }
            });//ajax

  });//update

  //삭제
  $(".delete-row").on("click",()=>{
      var delRow = [];
      $("table tbody").find('input[name="record"]').each(function(){

        if($(this).is(":checked")){
              //$(this).parents("tr").remove();
              delRow.push($(this).next()[0].value);
          }
      });

      if(delRow.length>0){
            $.ajax({
              type:'POST',
              url:'/delete',
              dataType:'json',
              data : {delRowIds:delRow },
              success:function(data){
                //강제 select 의 onChange 이벤트를 생성해낸다.
                //$('#slct1').trigger('change');

                selAction('dropdownMenuButton',$('#dropdownMenuButton').val(),$('#user_id').val(),$('#dropdownMenuButton').text(),false);

      //          alert('삭제완료' + data.status);
                alert('삭제완료');

                document.getElementById("ngMenuButton").focus();
              },
              err:function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
              }
            });//ajax
      }
      else{
          ;//반응이 없다.
          //alert('선택없음');
      }
  });//delete function



}); //$(function()

//SELECT BOX - 좌측 선택
function selbox(elemet_id, rid, lotid){
    //alert(elemet_id + "/" + lotid);
    $('#save')[0].style.visibility = 'hidden';
  //버튼을 보일지 말지
  //else{//선택된 것이 한개라도 있다면..
    var selEle = document.getElementById(elemet_id);
    if(selEle.checked){

      $('#selbox_record_id')[0].value = rid;
      $('#update')[0].style.visibility = 'visible';
      //수정
      $('#ngMenuButton')[0].disabled = true;
    }
    else{

      $('#selbox_record_id')[0].value = '-1';
      //$('#save')[0].style.visibility = 'hidden';
      $('#update')[0].style.visibility = 'hidden';
      $('#ngMenuButton')[0].disabled = false;

    }

      var ngid_hiddenVal ;
      var ngname_hiddenVal ;
      var dynamic_index = 0;
      //for each는 0번 부터 시작이지만 실제 원하는 데이터는 1부터 시작, 0은 배열은 select 이다.
      //td 밑에서 있는 각 td 의 해당 index 와 text 값을 가져와서 for each 를 돌린다.
      $(selEle.parentNode.parentNode).find('td').each((i,ele)=>{
        if(i==0){//0번째 인덱스는 select 이기 때문에 아무 처리를 안해주기 위해서 for each 문에서 return 해준다.
          //hidden value 는 2, 3 번 값을 가져온다.
          //0번은 실제 check box 관련 부분이다.
          //1번은 row를 지울때 필요한 row 에 대한 rowdata id 값이며
          //2번은 ng id
          //3번은 ng name
          //이해를 돕기 위한 코드 부분 참고
          /*
          <td width="80px"><input type="checkbox" id="record_${row.id}" name="record" onclick="selbox(this.id,${row.id},${row.lotid})" />
            <input type="hidden" value=${row.id} />
            <input type="hidden" value=${row.ngvalue_cc} />
            <input type="hidden" value=${row.ngname} />
            </td>
          */
          ngid_hiddenVal = $(ele).find('input')[2].value;
          ngname_hiddenVal = $(ele).find('input')[3].value;
          return;
        }

        if(i==1){
          return;
        }

        var nIdx = $(ele)[0].cellIndex;
        var nTxt = $(ele)[0].textContent;


        var obj = document.getElementById(fixField[nIdx]);


                if(selEle.checked){//선택한 객체가 check 를 선택했다면..

                  $('#ngMenuButton')[0].value = ngid_hiddenVal;
                  $('#ngMenuButton')[0].textContent = ngname_hiddenVal;


                  var lot_pid = $('#dropdownMenuButton').val();
                  var ng_id = $('#ngMenuButton').val();

                  if(obj==null){
                    var dv_table = $('#dynamic_input_tb tbody tr td input');
                    dv_table[dynamic_index++].value = nTxt;
                  }
                  else{

                    if(onlyVal[nIdx]=='ok'){
                      //var obj = document.getElementById(fixField[nIdx]);
                      obj.value = nTxt;
                    }
                    else{
                      var id_txt = fixField[nIdx];
                      //수정필요
                      //slct_howto
                      $($('#'+id_txt).next()[0].children[0]).find('td').each((i,ele)=>{
                          var textcheck = ele.textContent;
                          if(nTxt==textcheck){
                            $('#'+id_txt)[0].value = i;
                            $('#'+id_txt)[0].textContent = textcheck;
                          }
                      });

                    }//else
                  }


                    $.ajax({
                      type:'GET',
                      url:'/login/loginid/ngsel',
                      dataType:'json',
                      data : {lot_pid:lot_pid, ng_id:ng_id},
                      success:function(data){

                        $('#spec').html('');
                        var ngtxt = data.ngtxt; //OK규격
                        var sytxt = data.sytxt; //SY발행조건

                        var specDiv =
                        `&nbsp;&nbsp;
                        <label><span style="color:#e9ecef;"> SY 규격 : </span></label>
                        <br/><br/>
                        <table class="table table-striped table-bordered table-hover">
                          <tr>
                            <td width="100px">OK규격</td>
                            <td width="500px">${ngtxt}</td>
                          </tr>
                          <tr>
                            <td>SY발행조건</td>
                            <td>${sytxt}</td>
                          </tr>
                        </table>
                        <hr />
                        `;

                        $('#spec').append(specDiv);
                        //alert(data.ngtxt + "   " + data.sytxt);
                      },
                      err:function(request,status,error){
                        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                      },
                      complete : function() {
                        document.getElementById("ngcnt").focus();
                      }
                    });//ajax*/

                }
                else{//선택한 객체가 check 를 풀었다면..

                  $('#ngMenuButton')[0].value = "none";
                  $('#ngMenuButton')[0].textContent = "";

                    if(obj==null){
                      var dv_table = $('#dynamic_input_tb tbody tr td input');
                      dv_table[dynamic_index++].value = '0';
                    }
                    else{
                            if(onlyVal[nIdx]=='ok'){
                              //var obj = document.getElementById(fixField[nIdx]);
                              if(fixField[nIdx]=='comment'){
                                obj.value = '';
                              }
                              else{
                                obj.value = '0';
                              }
                            }
                            else{
                              var id_txt = fixField[nIdx];

                              $($('#'+id_txt).next()[0].children[0]).find('td').each((i,ele)=>{
                                  var textcheck = ele.textContent;
                                  if(nTxt==textcheck){
                                    $('#'+id_txt)[0].value = "0";
                                    $('#'+id_txt)[0].textContent = '';
                                  }
                              });
                              /*
                              var options = $('#'+id_txt+' option');
                            	for(i = 0; i < options.length; i++)
                            	{
                            		if (options[i].text == nTxt){
                                  //$('#'+id_txt+' option').setValue(options[i].value);
                                  $('#'+id_txt)[0].selectedIndex = 0;
                                  if(id_txt=='ng'){
                                    //ng 경우는 강제 선택 이벤트를 발생시킨다.
                                    $('#'+id_txt).trigger('change');
                                  }
                                }
                            	}
                              */

                            }//else
                    }

                    $('#spec').html('');

                    document.getElementById("ngMenuButton").focus();

                }//else

      });//$(selEle.parentNode.parentNode)

  //}//선택된 것이 한개라도 있다면..
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
        if (obj.value == '0' ) //아무것도 없거나 현재 값이 0일 경우에서 0을 눌렀을경우
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

//숫자필터링(다이나믹 필드)
function handlerNum1( obj , tabkeyAction ) {
  //숫자만 입력 받게끔 하는 함수.
    e = window.event; //윈도우의 event를 잡는것입니다.

    if(parseInt(tabkeyAction)!=0 && e.keyCode==9){
      document.getElementById("dropdownMenuButton").focus();
      return;
    }


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
        if (obj.value == '0' ) //아무것도 없거나 현재 값이 0일 경우에서 0을 눌렀을경우
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
     e.returnValue=false;
     alert('숫자만 입력해주세요.');//문자
     return;
   }
   else{
     ;//숫자
   }

}

//DATEPICKER - 최상단 달력 선택
var trigger = false;
$(function(){

  $("#date1").datepicker({

    onSelect:function(dateText, inst) {
      if(!trigger){
        trigger=true;
      }
      else{
        return;
      }

      //console.log(dateText);
      //console.log(inst);

      $('#slct1').children().remove();
      $('#slct_lot').children().remove();//동일동작
      var mid = document.getElementById('dropdownMenuButton');
      mid.textContent = '--' ;
      mid.value="";
      $('#slct_ng').children().remove();
      var mid1 = document.getElementById('ngMenuButton');
      mid1.textContent = '' ;
      mid1.value="";

      dropdownSetdefault();

      $('#pumm').html('');
      $("#dynamic_list_h").html('');
      $("#dynamic_list_b").html('');
      $("#dynamic_head").html('');
      $("#dynamic_body").html('');
      //$('#save').setAttribute("display","none");
      $('#save')[0].style.visibility = 'hidden';
      $('#update')[0].style.visibility = 'hidden';
      $('#spec').html('');

      //datepicker-onSelect 를 선택시 기본 값으로 초기화
      //동적테이블 값 초기화
      $('#dynamic_input_tb tbody tr td input').each((i,ele)=>{
          $(ele)[0].value = '0';
      });

      var fcount = Object.keys(fixField).length;
      for(nIdx=1;nIdx<(fcount+1);nIdx++){
          var obj = document.getElementById(fixField[nIdx]);
          if(onlyVal[nIdx]=='ok'){
            //var obj = document.getElementById(fixField[nIdx]);
            if(fixField[nIdx]=='comment'){
              obj.value = '';
            }
            else{
              obj.value = '0';
            }
          }
          else{
            var id_txt = fixField[nIdx];
            //$('#'+id_txt)[0].selectedIndex = 0;
            /*
            $($('#'+id_txt).next()[0].children[0]).find('td').each((i,ele)=>{
                var textcheck = ele.textContent;
                $('#'+id_txt)[0].value = i;
                $('#'+id_txt)[0].textContent = textcheck;
            });
            */

          }//else
      }
      //datepicker-onSelect 를 선택시 기본 값으로 초기화

      //$('#date1')._hideDatepicker();
      //inst.preventDefault();
      //$(inst.dpDiv).find('.ui-state-highlight.ui-state-hover').removeClass('ui-state-highlight ui-state-hover');

      var userid = $('#user_id')[0].value;
      //alert(dateText + "  " + userid );
      $.ajax({
        type:'GET',
        url:'/login/loginid/datesel',
        dataType:'json',
        data : {dateText:dateText, userid:userid},
        success:function(data){

              var lotsel_div = $('#slct_lot');

              if(data.status=='200'){
                var tr= document.createElement("tr");
                lotsel_div[0].appendChild(tr);

                var newel = document.createElement("td");
                newel.tabIndex = 0;
                newel.innerText = '--';
                //var id = 'none';
                var useid = $('#user_id').val();
                var text =  newel.innerText;
                newel.onclick= new Function("","selAction('dropdownMenuButton','none',"+useid+",'"+text+"',false);");
                newel.onkeydown= new Function("","selAction('dropdownMenuButton','none',"+useid+",'"+text+"',true);");
                newel.className = 'my_dclass dropdown-item';
                tr.appendChild(newel);


                var rowObj = data.lotlist;
                var rowCnt = rowObj.length;
                if(rowCnt>0){
                    for(i=0;i<rowCnt;i++){
                      //0 이면 start 원단
                      //1 이면 end 원단
                      var se = rowObj[i].se==0?'START':'END';
                      var newel = document.createElement("td");
                      newel.className = 'my_dclass dropdown-item';
                      newel.tabIndex = i+1;
                      newel.innerText = rowObj[i].lot + '   [  '+ se + '  ]';
                      newel.value = rowObj[i].id;
                      var id = newel.value;
                      var useid = $('#user_id').val();
                      var text =  newel.innerText;
                      newel.onclick= new Function("","selAction('dropdownMenuButton',"+id+","+useid+",'"+text+"',false);");
                      newel.onkeydown= new Function("","selAction('dropdownMenuButton',"+id+","+useid+",'"+text+"',true);");
                      tr.appendChild(newel);
                    }
                }

                /*
                var rowObj = data.lotlist;
                var rowCnt = rowObj.length;
                if(rowCnt>0){
                    for(i=0;i<rowCnt;i++){
                      //0 이면 start 원단
                      //1 이면 end 원단
                      var se = rowObj[i].se==0?'START':'END';
                      var option = document.createElement("option");
                      option.text = rowObj[i].lot + '   [  '+ se + '  ]';
                      option.value = rowObj[i].id;
                      lotsel[0].appendChild(option);

                    }
                }
                */


              }//if

              trigger = false;
        },
        err:function(request,status,error){
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        },
        complete : function() {
            //document.getElementById("ui-datepicker-div");
            //$('#ui-datepicker-div').trigger('_selectDate');
            //$('#ui-datepicker-div').trigger('_selectDay');
            //$('#ui-datepicker-div').blur();
            //$('#ui-datepicker-div').datepicker('hide');

        }
      });//ajax
      //alert(dateText + " 11 " + inst );

    }//onSelect
  });//datepicker
});//function


//LOT정보입력
function initial_lot(id){
    //alert('page call : ' + DEFAULT_URL);
    var url = DEFAULT_URL+"/initlot/" + id;
    //var url = DEFAULT_URL;
    window.location=url;
    return;
}

//static field 하드코딩 고정 object
//db연동을 하지 않은 부분 이기에 만약에 db쪽에서 데이터 수정 및 동기화를 위해선 이부분도 하드코딩으로 맞춰야한다.
//db연동을 하지 않은 사유는
//query hell? 쿼리지옥을 피하기 위함이며, 속도 측면에서도 굳이 일일히 db를 가져오는것보다 하드코딩으로 관라하는 편이
//효율면에서 좋기 때문이다.
var howto_sel = [
  '',
  '반사',
  '투과cross',
  '반사cross',
  '투과'
];

var level_sel = [
  '',
  'Lv 1',
  'Lv 2',
  'Lv 3',
  'Lv 4',
  'Lv 5',
  'Lv 6',
  'Lv 7',
  'Lv 8',
  'Lv 9'
];

var decision_sel = [
  '',
  'OK',
  'NG',
  'HO',
  'IR'
];

var posi_standard_sel = [
  '',
  '左(좌)',
  '右(우)'
];

var calibration_sel = [
  '',
  '편광판',
  '필름'
];

var unit_sel = [
  '',
  '발생수/검사m수',
  '발생수/150mmX150mm',
  '레벨'
];
//static field 하드코딩 고정 object

//static field setting obejct - 고정 테이블 값 세팅 객체
//해당 객체로 기본 디폴트 값 또는 업데이트의 형식의 기준을 잡는다.
var onlyVal = {
    1:'ng',
    2:'ok',
    3:'ng',
    4:'ng',
    5:'ok',
    6:'ok',
    7:'ng',
    8:'ng',
    9:'ng',
    10:'ok',
    11:'ok',
    12:'ok',
    13:'ng',
    14:'ok'
  };

var fixField ={
    1:'ngMenuButton',
    2:'ngcnt',
    3:'howto',
    4:'level',
    5:'len',
    6:'size',
    7:'decision',
    8:'posi_standard',
    9:'calibration',
    10:'pos',
    11:'wid',
    12:'period',
    13:'unit',
    14:'comment'
  };
//static field setting obejct - 고정 테이블 값 세팅 객체

//LOT 선택
function selAction(motherid,id,user,text_lot,keydown){

    /*
    alert(id+'/'+userid+'/'+text+'/'+keydown);
    return;
    */
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

    var s1 = id; //lot id 정보를 가져옴
    //alert(user);
    var uid = user;
    //alert(s1.value);

    $('#slct_ng').children().remove();
    var mid = document.getElementById('ngMenuButton');
    mid.textContent = '' ;

    dropdownSetdefault();

    $('#ngMenuButton').children().remove();
    $('#ngMenuButton')[0].disabled = false;


    $('#save')[0].style.visibility = 'hidden';
    $('#update')[0].style.visibility = 'hidden';

    //lot 를 선택시 기본 값으로 초기화
    //동적테이블 값 초기화
    $('#dynamic_input_tb tbody tr td input').each((i,ele)=>{
        $(ele)[0].value = '0';
    });

    var fcount = Object.keys(fixField).length;
    for(nIdx=1;nIdx<(fcount+1);nIdx++){
        var obj = document.getElementById(fixField[nIdx]);
        if(onlyVal[nIdx]=='ok'){
          //var obj = document.getElementById(fixField[nIdx]);
          if(fixField[nIdx]=='comment'){
            obj.value = '';
          }
          else{
            obj.value = '0';
          }
        }
        else{
          var id_txt = fixField[nIdx];
          /*
          $($('#'+id_txt).next()[0].children[0]).find('td').each((i,ele)=>{
              var textcheck = ele.textContent;
              $('#'+id_txt)[0].value = i;
              $('#'+id_txt)[0].textContent = textcheck;
          });
          */
        }//else
    }
    //lot 를 선택시 기본 값으로 초기화


    var ngsel_div = $('#slct_ng');


    if(s1=='none'){
//      $('#ng').html('<option value="none"></option>');
      $('#pumm').html('');
      $("#dynamic_list_h").html('');
      $("#dynamic_list_b").html('');
      $("#dynamic_head").html('');
      $("#dynamic_body").html('');
      //$('#save').setAttribute("display","none");
      $('#spec').html('');
      retEl.textContent = text_lot ;
      retEl.value = "";
      //키 다운과 클릭은 서로 동작이 같지 않기 때문에 키 다운일 때만 토글
      if(keydown){
        $(retEl).dropdown('toggle');
      }

      document.getElementById("ngMenuButton").focus();
    }
    else{
      $.ajax({
        type:'GET',
        url:'/login/loginid/lot',
        dataType:'json',
        data : {lot_id:s1, user_id:uid},
        success:function(data){
          //기존 저장된 row 정보
          var rowObj = data.ngrow;

          $('#spec').html('');
          $('#pumm').html('');
          $("#dynamic_list_b").html('');

          var lotid = data.lot_id;

          if(data.status=='200'){

            var tr= document.createElement("tr");
            ngsel_div[0].appendChild(tr);

            var newel = document.createElement("td");
            newel.tabIndex = 0;
            newel.innerText = '';
            //var id = 'none';
            var useid = $('#user_id').val();
            var text =  newel.innerText;
            newel.onclick= new Function("","selAction_ng('ngMenuButton',"+lotid+",'none',"+useid+",'"+text+"',false);");
            newel.onkeydown= new Function("","selAction_ng('ngMenuButton',"+lotid+",'none',"+useid+",'"+text+"',true);");
            newel.className = 'my_dclass dropdown-item';
            tr.appendChild(newel);

            var newel = document.createElement("td");
            newel.tabIndex = 1;
            newel.innerText = '기타(その他)';
            //var id = 'none';
            var useid = $('#user_id').val();
            var text =  newel.innerText;
            newel.onclick= new Function("","selAction_ng('ngMenuButton',"+lotid+",0,"+useid+",'"+text+"',false);");
            newel.onkeydown= new Function("","selAction_ng('ngMenuButton',"+lotid+",0,"+useid+",'"+text+"',true);");
            newel.className = 'my_dclass dropdown-item';
            tr.appendChild(newel);

            var ngarr = data.ngjson;
            for(i=0;i<ngarr.length;i++){
              var newel = document.createElement("td");
              newel.className = 'my_dclass dropdown-item';
              newel.tabIndex = i+2;
              newel.innerText = ngarr[i].name;
              newel.value = ngarr[i].id;
              var id = newel.value;
              var useid = $('#user_id').val();
              var text =  newel.innerText;
              newel.onclick= new Function("","selAction_ng('ngMenuButton',"+lotid+","+id+","+useid+",'"+text+"',false);");
              newel.onkeydown= new Function("","selAction_ng('ngMenuButton',"+lotid+","+id+","+useid+",'"+text+"',true);");
              tr.appendChild(newel);
            }







            //alert('품명정보 : ' + data.pname);
            var label = (data.labelname).split(',');
            //alert('라벨 : ' + label);
            var inspNum = data.inspNum;
            //alert('검사칸수 : ' + inspNum);

            if(parseInt(inspNum)<=0){
              $("#dynamic_head").html('');
              $("#dynamic_body").html('');
            }else{

              var ngpx = 220;
              var howtopx = 120;
              var normalpx = 80;
              var commentpx = 250;


              //하부 리스트 헤더
              var head = "<tr>";
              head += `
                        <td width="${normalpx}px">SELECT</td>
                        <td width="${ngpx}px">불량명</td>
                        <td width="${normalpx}px">불량수</td>
                        <td width="${howtopx}px">검사방법</td>
                        <td width="${normalpx}px">Lv.</td>
                        <td width="${normalpx}px">길이(mm)</td>
                        <td width="${normalpx}px">사이즈(um)</td>
                        <td width="${normalpx}px">판정</td>
                        <td width="${normalpx}px">위치기준</td>
                        <td width="${normalpx}px">계측기준</td>
                        <td width="${normalpx}px">위치(mm)</td>
                        <td width="${normalpx}px">폭(mm)</td>
                        <td width="${normalpx}px">주기</td>
                        <td width="${ngpx}px">단위</td>
                        <td width="${commentpx}px">비고</td>`;
              //하부 리스트 헤더

              var mark_head = "<tr>";
              var mart_body = "<tr>";
              for(i=0; i<inspNum;i++){

                var lastnum = inspNum-1;
                var paramAction = 0;
                if(lastnum==i){
                  paramAction = lastnum;
                }

                var lab = label[i];

                mark_head +=  "<td width='"+normalpx+"px'><label>"+ lab + "</label></td>";  //`<td bgcolor='#f2f2f2'><label>${label[i]}</label></td>`;
                mart_body += "<td ><input type='text' value='0' id='"+lab+"' name='"+lab+"' size='4' onKeydown='javascript:handlerNum1(this,"+paramAction+")'/></td>";

                head += "<td width='"+normalpx+"px'>"+lab+"</td>";
              }
              mark_head +="</tr>";
              mart_body +="</tr>";
              head +="</tr>";

              $("#dynamic_head").html('');
              $("#dynamic_body").html('');

              $("#dynamic_head").append(mark_head);
              $("#dynamic_body").append(mart_body);


              //하부 리스트업 할 list


              $("#dynamic_list_h").html('');
              $("#dynamic_list_h").append(head);
            }

            //회의 후 닉네임쪽은 헷갈림을 유도 할 수 있기 때문에 hidden 시키는 개념으로 코드로 보여주지 않는다.
            //주석처리
            //$('#pumm').html(data.pname + "  (" + data.pnicname +")");
            $('#pumm').html(data.pname+"");
            var body = "";
            var rowCnt = rowObj.length;
            if(rowCnt>0){
                  for(i=0;i<rowCnt;i++){
                          var row = rowObj[i];
                          var arrlb = row.lbnames.split(',');
                          var valuelb = row.lbvalues.split(',');

                          var dynamic_body = "";
                          /*
                          for(j=0;j<arrlb.length;j++){
                            dynamic_body += `<td width="80px">${valuelb[j]}</td>`;
                          }
                          */

                          var ia = 0;
                          for(j=0;j<label.length;j++){
                            for(k=0;k<arrlb.length;k++){
                              ia = (label[j] + ' =  '+ arrlb[k]) ;
                              if(label[j]==arrlb[k]){
                                dynamic_body += `<td width="80px">${valuelb[k]}</td>`;

                              }

                            }
                          }

                          //color
                          //#fa7217 => 오렌지
                          var calor = (parseInt(row.decision)==2 || parseInt(row.decision)==3)?"#fa7217":"";

                          //hidden 값을 보면 selAction 의 경우는 router 에서 parser 로 받은 data 가 ngid 를 사용해서 save 때와 다르게 값을 써준다.
                          body += `<tr bgcolor=${calor}>
                          <td width="80px"><input type="checkbox" id="record_${row.id}" name="record" onclick="selbox(this.id,${row.id},${row.lotid})" />
                            <input type="hidden" value=${row.id} />
                            <input type="hidden" value=${row.ngid} />
                            <input type="hidden" value=${row.ngname} />
                            </td>
                          <td width="220px">${row.ngname}</td>
                          <td width="80px">${row.ngcnt}</td>
                          <td width="120px">${howto_sel[`${row.howto}`]}</td>
                          <td width="80px">${level_sel[`${row.lev}`]}</td>
                          <td width="80px">${row.len}</td>
                          <td width="80px">${row.size}</td>
                          <td width="80px">${decision_sel[`${row.decision}`]}</td>
                          <td width="80px">${posi_standard_sel[`${row.posi_standard}`]}</td>
                          <td width="80px">${calibration_sel[`${row.calibration}`]}</td>
                          <td width="80px">${row.pos}</td>
                          <td width="80px">${row.wid}</td>
                          <td width="80px">${row.period}</td>
                          <td width="220px">${unit_sel[`${row.unit}`]}</td>
                          <td width="250px">${row.comment}</td>
                          ${dynamic_body}
                          </tr>`;

                  }
            }

            $("#dynamic_list_b").append(body);


            retEl.value = lotid;
            //document.getElementById('dropdownMenuButton').textContent = 'aa click['+tag+']' ;
            retEl.textContent = text_lot ;
            //$("#dropdownMenuButton").dropdown('toggle');
            //키 다운과 클릭은 서로 동작이 같지 않기 때문에 키 다운일 때만 토글
            if(keydown){
              $(retEl).dropdown('toggle');
            }

            //document.getElementById("ng").focus();
            document.getElementById("ngMenuButton").focus();

          }//status - 200
          else{
            $('#spec').html('');
            alert('품명정보 실패 : ' + data.message);
          }
        },
        err:function(request,status,error){
          $('#spec').html('');
          $('#pumm').html('');
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
      });//ajax
    }//else
}//selAction




function selAction_ng(motherid,lotid,id,user,text,keydown){
  //var sid = document.getElementById(id); //lot id 정보를 가져옴
  /*
  alert(id+'/'+userid+'/'+text+'/'+keydown);
  return;
  */

  if(keydown){
    e = window.event; //윈도우의 event를 잡는것입니다.
    if(e.keyCode == 13 ){
      ;
    }
    else{
       return;
    }
  }
  var retEl1 = document.getElementById(motherid);


  dropdownSetdefault();

  $('#dynamic_input_tb tbody tr td input').each((i,ele)=>{
      $(ele)[0].value = '0';
  });

  var fcount = Object.keys(fixField).length;
  for(nIdx=2;nIdx<(fcount+1);nIdx++){
      var obj = document.getElementById(fixField[nIdx]);
      if(onlyVal[nIdx]=='ok'){
        //var obj = document.getElementById(fixField[nIdx]);
        if(fixField[nIdx]=='comment'){
          obj.value = '';
        }
        else{
          obj.value = '0';
        }
      }
      else{
        var id_txt = fixField[nIdx];
        $($('#'+id_txt).next()[0].children[0]).find('td').each((i,ele)=>{
            var textcheck = ele.textContent;
            $('#'+id_txt)[0].value = 0;
            $('#'+id_txt)[0].textContent = '';
        });
      }//else
  }



  var sid = id; //lot id 정보를 가져옴
  var uid = user;

    if(sid == "none"){ // IF -1
      $('#spec').html('');
      $('#save')[0].style.visibility = 'hidden';

      retEl1.textContent = text ;
      retEl1.value="";
      //키 다운과 클릭은 서로 동작이 같지 않기 때문에 키 다운일 때만 토글
      if(keydown){
        $(retEl1).dropdown('toggle');
      }

    }
    else{ // ELSE - 1
          if($('#ngMenuButton')[0].disabled){
            $('#save')[0].style.visibility = 'hidden';
          }
          else{
            $('#save')[0].style.visibility = 'visible';
          }


          var ng_id = sid;
          var lot_pid = lotid;

          $.ajax({
            type:'GET',
            url:'/login/loginid/ngsel',
            dataType:'json',
            data : {lot_pid:lot_pid, ng_id:ng_id},
            success:function(data){

              $('#spec').html('');
              var ngtxt = data.ngtxt; //OK규격
              var sytxt = data.sytxt; //SY발행조건

              var specDiv =
              `&nbsp;&nbsp;
              <label><span style="color:#e9ecef;"> SY 규격 : </span></label>
              <br/><br/>
              <table class="table table-striped table-bordered table-hover">
                <tr>
                  <td width="100px">OK규격</td>
                  <td width="500px">${ngtxt}</td>
                </tr>
                <tr>
                  <td>SY발행조건</td>
                  <td>${sytxt}</td>
                </tr>
              </table>
              <hr />
              `;

              $('#spec').append(specDiv);


              //주의
              //success 이지만 기타() 같은 경우는 error 상태값을 리턴받아서 예외처리를 진행해야한다.
              //불량 코드가 따로 존재하는 것이 아니기 때문에 html 형태는 undefined 로 잡아주고..
              //ngid 의 값을 0 으로 강제 지정한다.
              if(sid==0){
                retEl1.value = 0;
              }
              else{
                retEl1.value = data.ngid;
              }
              //document.getElementById('dropdownMenuButton').textContent = 'aa click['+tag+']' ;
              retEl1.textContent = text ;
              //$("#dropdownMenuButton").dropdown('toggle');
              //키 다운과 클릭은 서로 동작이 같지 않기 때문에 키 다운일 때만 토글
              if(keydown){
                $(retEl1).dropdown('toggle');
              }

              //alert(data.ngtxt + "   " + data.sytxt);
            },
            err:function(request,status,error){
              alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            },
            complete : function() {
                document.getElementById("ngcnt").focus();
            }
          });//ajax*/
  }// ELSE - 1
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
    if(text==''){
      el.textContent='';
    }
    else{
      el.textContent = text;
    }

    if(keydown){
      $(el).dropdown('toggle');
    }
    next.focus();
}



function dropdownSetdefault(){
  var selarr = ['howto','level','decision','posi_standard','calibration','unit'];

  selarr.forEach((item, i) => {
    var el = document.getElementById(item);
    el.value = "0";
    el.textContent = '';
  });
}



//이 함수만 login page 에서 사용함.
function loginSetting(motherid,id,text,keydown,next){
  if(keydown){
    e = window.event; //윈도우의 event를 잡는것입니다.
    if(e.keyCode == 13 ){
      ;
    }
    else{
       return;
    }
  }

  var el = $(motherid);

  el.val(id);
  if(id==-1){
    el.html(EMP);
  }
  else{
//    el.html('윤성준78912345678');
      var trims;
      if(text.length==2){
        trims = '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;';
      }
      else if(text.length==3){
        trims = '&emsp;&emsp;&emsp;&emsp;&emsp;';
      }
      else{
        trims =  '&emsp;&emsp;';
      }
      el.html('&emsp;'+text+trims);
  }
  if(keydown){
    el.dropdown('toggle');
  }
  //next.focus();
}
