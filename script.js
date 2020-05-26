

$(function() {

  //로그인
  $(".login_btn").on("click", function () {
    var sel = $('#slct1')[0];
    var uid = sel.options[sel.selectedIndex].value;
    //alert(uid); - 유저 id 확인
    var pass = $("#pass").val();
    $.ajax({
      //url:'/login/'+uid,
      type:'GET',
      url:'/login/loginid',
      dataType:'json',
      data : {userid:uid,pw:pass},
      success:function(data){
        if(data.status=='200'){
          alert('로그인 성공 : ' + data.id);
          window.location.replace("../" + data.id);
        }
        else{
          alert('로그인 실패 : ' + data.id);
          window.location.replace("/login");
        }
//        window.location.replace("/login");   - login 페이지로 이동
      },
      err:function(request,status,error){
        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }

    });
  });


  //로그아웃
  $(".log-out").on("click", function () {
      window.location.replace("/login");
  });





}); //$(function()


function onSelectLot(id){
    var s1 = document.getElementById(id);
    //alert(s1.value);
    if(s1.value == "none"){
      $('#pumm').html('');
    }
    else{
      $.ajax({
        type:'GET',
        url:'/login/loginid/lot',
        dataType:'json',
        data : {lot_pid:s1.value},
        success:function(data){
          $('#pumm').html('');
          if(data.status=='200'){
            alert('품명정보 : ' + data.pname);
            $('#pumm').html(data.pname);
          }
          else{
            alert('품명정보 실패 : ' + data.message);
          }
        },
        err:function(request,status,error){
          $('#pumm').html('');
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
      });//ajax
    }//else
}
