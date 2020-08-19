======================================================================
문서 히스토리
[1] 2020.07.31	윤성준	최초작성
[2] 2020.08.19	윤성준	추가사항 히스토리(태블릿 베이스)
[3] 2020.08.19	윤성준	서버업로드시 주의사항
======================================================================
[1]
[하드코딩 부분] 
하드코딩사유 : 
전부 DB에 저장 후 가져오기엔 너무 많은 공수와 구조적으로 
비효율을 가져오기에 하드코딩 부분을 선택함.

<Node js>
script.js
 => 파일 최하단 선언 구조체 부분 (검사자 입력관련 페이지)

<Asp.net>
cCommon.cs
 => 파일 최상단 선언 구조체 부분 (관리자 검색페이지 - 취합/rawdata 둘다)




[변경점 CSS]

Datepicker 에서 
./jquery-ui-1.12.1/jquery-ui.min.css

jquery-ui.min.css 파일에서 변경점


-기존 background 설정 색
#ededed


-내가 변경한 background 설정 색
#ff634e


Datepicker 사이즈 변경 코드 (추가지점)
   .ui-datepicker{ font-size: 17px; width: 400px; }
   .ui-datepicker select.ui-datepicker-month{ width:80%; height: 80%; font-size: 17px; }
   .ui-datepicker select.ui-datepicker-year{ width:90%; height: 80%; font-size: 17px; }
   .ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default, .ui-button, html .ui-button.ui-state-disabled:hover, html .ui-button.ui-state-disabled:active {
       border: 1px solid #c5c5c5;
       font-weight: normal;
       color: #454545;
       height: 30px;
       font-size: large;
   }




[프로시저 참고]
RPA 에서 값을 가져가기 위해서 만든 페이지의 프로서저
(현재 2020.07.31 개발중인 시점에선 
추후에 다른 프로시저 이용하는 페이지로 변경 가능성 有)
mkBase
mkBase1



관리자 검색페이지는 두 가지 입니다.
1. 취합(압축)페이지
	오직 lot / start&end 만으로 검색할 시에는 
	lot_mngSearch
	lot_mngSearch1
	를 사용하고

	날짜,호기 를 무조건 선택하는 기반으로 (+@ 검색인 품명,불량명,lot / start&end ) 
	까지 검색할때는
	mngSearch
	mngSearch1

2. Rawdata 페이지
	오직 lot / start&end 만으로 검색할 시에는 
	lot_mngSearch
	lot_mngSearch1_rowdata
	를 사용하고

	날짜,호기 를 무조건 선택하는 기반으로 (+@ 검색인 품명,불량명,lot / start&end ) 
	까지 검색할때는
	mngSearch
	mngSearch1_rowdata



======================================================================
======================================================================
[2]
[참고]
기존의 select 엘리먼트로 동작하던 부분이 태블릿 환경에서 onChange 이벤트가 실시간으로 동작하는
현상으로 인해서 해당 부분을 해결하기 위해서 bootstrap 의 dropdown 엘리먼트를 변형하여,
onChnage, onClick 두 가지 이벤트를 태블릿에서 모두 만족하게 변경함.

대표적으로 예시를 들면
script.js 파일에서
$("#date1").datepicker({  함수내에서
---------------------------------------------------------------------------------------
기존코드
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
---------------------------------------------------------------------------------------
신규코드
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
---------------------------------------------------------------------------------------

두 가지 다른점은 select 라는 엘리먼트 특성상 이벤트에 대한 콜백 함수가 시스템에서
결정되어 있지만,
bootstrap 의 dropdown 을 커스터마이징 한 변형 형태는 
아래와 같은 형태로 변경해서 만들었으며,
<tr> 쪽 엘리먼트는 상단의 경우 동적으로 콜백 이벤트 함수( selAction )를 등록해서 진행한다.

<div class="dropdown">
<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
--
</button>
<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
  <table id="slct_lot">
	<tr>
	</tr>
  </table>
</div>
</div>


======================================================================
======================================================================
[3]
script.js / initlot.js 
두 가지의 파일에서 이동경로에 대한 IP변수를 변경해줘야함.

선언내용은 아래 두 가지 파일모두 동일하며, 
두 파일 모두 서버 IP를 172.29.2.32 로 변경해야된다.
하기의 172.29.2.42 는 개인 테스트 PC 에서의 진행

----------------------------------------------
let HTTP = 'http://';
let IP = '172.29.2.42';
let PORT = '8001';
let DEFAULT_URL = HTTP + IP + ':' + PORT;





