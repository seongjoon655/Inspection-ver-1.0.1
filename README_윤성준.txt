======================================================================
���� �����丮
[1] 2020.07.31	������	�����ۼ�
[2] 2020.08.19	������	�߰����� �����丮(�º� ���̽�)
[3] 2020.08.19	������	�������ε�� ���ǻ���
======================================================================
[1]
[�ϵ��ڵ� �κ�] 
�ϵ��ڵ����� : 
���� DB�� ���� �� �������⿣ �ʹ� ���� ������ ���������� 
��ȿ���� �������⿡ �ϵ��ڵ� �κ��� ������.

<Node js>
script.js
 => ���� ���ϴ� ���� ����ü �κ� (�˻��� �Է°��� ������)

<Asp.net>
cCommon.cs
 => ���� �ֻ�� ���� ����ü �κ� (������ �˻������� - ����/rawdata �Ѵ�)




[������ CSS]

Datepicker ���� 
./jquery-ui-1.12.1/jquery-ui.min.css

jquery-ui.min.css ���Ͽ��� ������


-���� background ���� ��
#ededed


-���� ������ background ���� ��
#ff634e


Datepicker ������ ���� �ڵ� (�߰�����)
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




[���ν��� ����]
RPA ���� ���� �������� ���ؼ� ���� �������� ���μ���
(���� 2020.07.31 �������� �������� 
���Ŀ� �ٸ� ���ν��� �̿��ϴ� �������� ���� ���ɼ� ��)
mkBase
mkBase1



������ �˻��������� �� ���� �Դϴ�.
1. ����(����)������
	���� lot / start&end ������ �˻��� �ÿ��� 
	lot_mngSearch
	lot_mngSearch1
	�� ����ϰ�

	��¥,ȣ�� �� ������ �����ϴ� ������� (+@ �˻��� ǰ��,�ҷ���,lot / start&end ) 
	���� �˻��Ҷ���
	mngSearch
	mngSearch1

2. Rawdata ������
	���� lot / start&end ������ �˻��� �ÿ��� 
	lot_mngSearch
	lot_mngSearch1_rowdata
	�� ����ϰ�

	��¥,ȣ�� �� ������ �����ϴ� ������� (+@ �˻��� ǰ��,�ҷ���,lot / start&end ) 
	���� �˻��Ҷ���
	mngSearch
	mngSearch1_rowdata



======================================================================
======================================================================
[2]
[����]
������ select ������Ʈ�� �����ϴ� �κ��� �º� ȯ�濡�� onChange �̺�Ʈ�� �ǽð����� �����ϴ�
�������� ���ؼ� �ش� �κ��� �ذ��ϱ� ���ؼ� bootstrap �� dropdown ������Ʈ�� �����Ͽ�,
onChnage, onClick �� ���� �̺�Ʈ�� �º����� ��� �����ϰ� ������.

��ǥ������ ���ø� ���
script.js ���Ͽ���
$("#date1").datepicker({  �Լ�������
---------------------------------------------------------------------------------------
�����ڵ�
                if(rowCnt>0){
                    for(i=0;i<rowCnt;i++){
                      //0 �̸� start ����
                      //1 �̸� end ����
                      var se = rowObj[i].se==0?'START':'END';
                      var option = document.createElement("option");
                      option.text = rowObj[i].lot + '   [  '+ se + '  ]';
                      option.value = rowObj[i].id;
                      lotsel[0].appendChild(option);

                    }
                }
---------------------------------------------------------------------------------------
�ű��ڵ�
                if(rowCnt>0){
                    for(i=0;i<rowCnt;i++){
                      //0 �̸� start ����
                      //1 �̸� end ����
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

�� ���� �ٸ����� select ��� ������Ʈ Ư���� �̺�Ʈ�� ���� �ݹ� �Լ��� �ý��ۿ���
�����Ǿ� ������,
bootstrap �� dropdown �� Ŀ���͸���¡ �� ���� ���´� 
�Ʒ��� ���� ���·� �����ؼ� ���������,
<tr> �� ������Ʈ�� ����� ��� �������� �ݹ� �̺�Ʈ �Լ�( selAction )�� ����ؼ� �����Ѵ�.

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
�� ������ ���Ͽ��� �̵���ο� ���� IP������ �����������.

���𳻿��� �Ʒ� �� ���� ���ϸ�� �����ϸ�, 
�� ���� ��� ���� IP�� 172.29.2.32 �� �����ؾߵȴ�.
�ϱ��� 172.29.2.42 �� ���� �׽�Ʈ PC ������ ����

----------------------------------------------
let HTTP = 'http://';
let IP = '172.29.2.42';
let PORT = '8001';
let DEFAULT_URL = HTTP + IP + ':' + PORT;





