var row = 0 ;  //定义全局行数用于修改
var reg_email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;  //用于判断邮箱格式
var reg_name = /^((\w*\d\w*[a-z]\w*)|(\w*[a-z]\w*\d\w*))$/i; //用于判断用户名格式
var reg_chinese =  /^[\u0391-\uFFE5]+$/  ; //用于判断姓名格式
var reg_pass = /^((\w*\d\w*[a-z]\w*)|(\w*[a-z]\w*\d\w*))$/i;//用于判断密码格式
var reg_price =	/^([0-9]*)+(.[0-9]{1,2})?$/;
//----获取行号-----
function getRow(r){
    var i=r.parentNode.parentNode.rowIndex;    
    return i ;
}
//----获取行号-----

//----删除某一行-----
function delRow(r){    
    document.getElementById('table').deleteRow(getRow(r));
}
//----删除某一行-----

//----清除添加信息框的内容-----
function cleanAddInput(){
    document.getElementById('id_unitName').value='';
    document.getElementById('id_retailPrice').value=''; 
    document.getElementById('id_buyPrice').value='';
    document.getElementById('id_wholesalePrice').value='';
}
//----清除添加信息框的内容-----

//----显示添加信息框-----
function showAddInput(){
	$("#del-modal").modal('show');
    //document.getElementById('addinfo').style.display="" ;
    document.getElementById('btn_add').style.display="" ;
    cleanAddInput(); 
	document.getElementById('form-box').style.display="none" ;
}
//----显示添加信息框-----

//----隐藏添加信息框-----
function hideAddInput(){
	cleanAddInput();
	$("#del-modal").modal('hide');
	//document.getElementById('addinfo').style="display:none" ;
	document.getElementById('form-box').style="display:" ;

}
//----隐藏添加信息框-----

//----判断输入框的信息是否符合要求-----
function judge(){
    //根据id获取表单信息
    var id_unitName = document.getElementById('id_unitName').value;
    var id_retailPrice = document.getElementById('id_retailPrice').value; 
    var id_buyPrice = document.getElementById('id_buyPrice').value;
    var id_wholesalePrice = document.getElementById('id_wholesalePrice').value;
    var judge = true ;  //用于判断表单信息是否符合
    if(id_unitName=='' ||id_unitName.length >18){
        judge = false ;
        alert('请重新输入规格/单位');
    }
	else if(id_buyPrice =='' ||id_buyPrice=='' ||id_wholesalePrice==''){
		judge = false ;
        alert('请输入价格');
	}else{
		id_retailPrice = parseInt(id_retailPrice*100)/100; 
		id_buyPrice = parseInt(id_buyPrice*100)/100; 
		id_wholesalePrice = parseInt(id_wholesalePrice*100)/100; 
		document.getElementById('id_retailPrice').value=id_retailPrice;
		document.getElementById('id_buyPrice').value=id_buyPrice;
		document.getElementById('id_wholesalePrice').value=id_wholesalePrice;
		if(id_buyPrice<0 ||id_retailPrice<0 ||id_wholesalePrice<0){
			judge = false ;
			alert('价格不能为负数');
		}
	}
	
    return judge ;
}
//----判断输入框的信息是否符合要求-----

//----新增信息的插入方法-----
function insertInfo(){
    //根据id获取表单信息
    var arr = new Array();
	arr[0] = 0;//新增规格默认id
    arr[1] = document.getElementById('id_unitName').value;
    arr[2] = document.getElementById('id_buyPrice').value;
    arr[3] = document.getElementById('id_retailPrice').value;
    arr[4] = document.getElementById('id_wholesalePrice').value;
    arr[5] ="<a style='text-align:center;color:blue;cursor:pointer;' onclick='delRow(this);'>删除</a>";
    var x = document.getElementById('table').insertRow(1); //获取第一行对象
    
    for(var i=0;i<arr.length;i++){
        x.insertCell(i).innerHTML = arr[i] ;  //用循环把每个数据插入第一行的每一列		
    }
	x.cells[0].style.display = "none";//隐藏第一列，保存的是规格id
}
//----新增信息的插入方法-----

//----新增信息-----
function addInfo(){    
    if(judge()==true){
        //alert('添加成功');
        insertInfo();  //执行插入
        hideAddInput();  //隐藏添加信息框        
    }else{
        //alert('添加失败');
    }
}
//----新增信息-----

//----获取表中所有数据-----三种价格均扩大100倍--
function getAllTableData(){
	var tb=document.getElementById('table');
	var result=new Array();
	if(tb.rows.length>=2){
		for(var i=1;i<tb.rows.length;i++){
			var rows=tb.rows;
			var tr=rows[i];
			var value=new GoodsPrice("","","","","");
			var td=tr.cells;
			value.priceId = tb.rows[i].cells[0].innerHTML;
			value.unitName = td[1].innerHTML;
			value.buyPrice = td[2].innerHTML*100;
			value.retailPrice = td[3].innerHTML*100;
			value.wholesalePrice = td[4].innerHTML*100;
			result[i-1]=value;
		}
		return result;
	}
}
//----获取表中所有数据-------

//----初始化所有规格数据-------
function initAllTableData(goodsPriceList){
	var tb=document.getElementById('table');
	var result=new Array();
	if(tb.rows.length>=2){
		for(var i=1;i<tb.rows.length;i++){
			var rows=tb.rows;
			var tr=rows[i];
			var value=new GoodsPrice("","","","","");
			var td=tr.cells;
			value.priceId = tb.rows[i].cells[0].innerHTML;
			value.unitName = td[1].innerHTML;
			value.buyPrice = td[2].innerHTML;
			value.retailPrice = td[3].innerHTML;
			value.wholesalePrice = td[4].innerHTML;
			result[i-1]=value;
		}
		return result;
	}
}
//----初始化所有规格数据-------

//-----js规格类-----
function GoodsPrice(priceId,unitName,buyPrice,retailPrice,wholesalePrice){
	this.priceId = priceId;
	this.unitName = unitName;
	this.retailPrice = retailPrice;
	this.buyPrice = buyPrice;
	this.wholesalePrice = wholesalePrice;
}
//-----js规格类-----