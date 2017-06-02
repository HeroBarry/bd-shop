define(['jquery', "template", "components", "ZeroClipboard", "jqueryValidate", "ueditorConfig", "ueditorAll", "manageCommon"], function(jquery, template, components, ZeroClipboard, validator, ueditorConfig, UE, manageCommon) {
    getModules();
    function getModules() {
        var flag1 = false;
        var flag2 = false;
        var flag3 = false;
        var flag4 = false;
        var flag5 = false;
        var flag6 = false;
        //$.ajax({
        //    url: apiUrl + "/admin/module/module/queryModules",
        //    type: 'GET',
        //    xhrFields: {
        //        withCredentials: true
        //    },
        //    crossDomain: true,
        //}).done(function (msg) {
        components.getMsg(apiUrl + "/admin/module/module/queryModules").done(function (msg) {
            if (msg.res == 1) {
                var objList = msg.obj;
                for (var i = 0; i < objList.length; i++) {
                    var module = objList[i];
                    var id = module.moduleId;
                    var pid = module.parentId;
                    if (id == 7) {
                        $("#goodsList").css("display", "block");
                        flag1 = true;
                    }
                    if (id == 8) {
                        $("#goodsOrder").css("display", "block");
                        flag1 = true;
                    }
                    if (id == 9) {
                        $("#goodsCatory").css("display", "block");
                        flag1 = true;
                    }
                    if (id == 10) {
                        $("#memberManage").css("display", "block");
                        flag2 = true;
                    }
                    if (id == 11) {
                        $("#messageManage").css("display", "block");
                        flag2 = true;
                    }
                    if (id == 12) {
                        $("#articleManage").css("display", "block");
                        flag3 = true;
                    }
                    if (id == 13) {
                        $("#adManage").css("display", "block");
                        flag4 = true;
                    }
                    if (id == 14) {
                        $("#goodsReport").css("display", "block");
                        flag5 = true;
                    }
                    if (id == 15) {
                        $("#orderReport").css("display", "block");
                        flag5 = true;
                    }
                    if (id == 16) {
                        $("#adminManage").css("display", "block");
                        flag6 = true;
                    }
                    if (id == 17) {
                        $("#roleManage").css("display", "block");
                        flag6 = true;
                    }
                    if (flag1) {
                        $("#div1").css("display", "block");
                    }
                    if (flag2) {
                        $("#div2").css("display", "block");
                    }
                    if (flag3) {
                        $("#div3").css("display", "block");
                    }
                    if (flag4) {
                        $("#div4").css("display", "block");
                    }
                    if (flag5) {
                        $("#div5").css("display", "block");
                    }
                    if (flag6) {
                        $("#div6").css("display", "block");
                    }
                    if (flag1 || flag2 || flag3 && flag4 || flag5 || flag6) {
                        $('.container-wrap').css('display', 'block')
                    }
                }
            }
            //location.href = "/page/manage_login.html";
        });
    }
      //设置全局变量
    window.ZeroClipboard = ZeroClipboard;
    var num=0;
    //初始化富文本框
    var ue = UE.getEditor('container', {
        initialFrameWidth: 800,
        initialFrameHeight: 350,
        // initialContent: "请填写详细描述",
    });
    var goods= components.GetQueryString("id");
    var submitUrl = "";
    var atr="";
	var goodscategory=0;//保存初始化时候的商品分类，修改时则保存商品原来的分类

    if (goods) {
        submitUrl = apiUrl + "/admin/goods/goodsAdmin/editGoods?goodsId="+goods;
        getData(goods);
        $("#addState").text("编辑商品");
    } else {
        submitUrl = apiUrl + "/admin/goods/goodsAdmin/addGoods";
        $("#addState").text("添加商品");
		initEditGoodsCategoryInfo();
    }	
	
    //上传LOGO
    function upPic() {
        $("#div-box").on("change", "#pic-upload", function() {
            var formData = new FormData(); //构造空对象，下面用append 方法赋值。
            formData.append("param", "");
            formData.append("file", $("#pic-upload")[0].files[0]);
            var url = apiUrl + "/upload/uploadimg/dydz/user";
            $.ajax({
                url: url,
                type: 'POST',
                dataType: "json",
                data: formData,
                processData: false,
                contentType: false,
                success: function(msg) {
                    var picListHtml = '<li picUrl="' + msg.result + '"class="apply-book"> <img  src=" ' + apiUrlPic + msg.result + '"> <a docUrl="' + msg.result + '" href="javascript:void(0)" class="text-basic del-doc"><i class="iconfont icon-delete"></i></a></li>';
                    $("#pic-document-list").append(picListHtml);
                    num+=1;
                    if(num==6){
                       $(".a-upload").css("display","none");
                    }
                }

            });
        });
    }

    upPic();
    delpic();
    function delpic() {
        $("#div-box").on("click", ".del-doc", function() {
            var $this = $(this);
            var url = apiUrl + "/upload/removeFile";
            var docUrl = $this.attr("picUrl");
            $.ajax({
                url: url,
                type: 'get',
                dataType: "json",
                data: "preImg=" + docUrl,
                success: function(msg) {
                    if (msg.res == 1) {
                        $this.parents("li").remove();
                        num-=1;
                    if(num<6){
                       $(".a-upload").css("display","block");
                    }
                   }
                }
               
            });
        });
    }

    function getData(id) {
        var url = apiUrl + "/admin/goods/goodsAdmin/getGoodsById?goodsId=" + id;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
                if(msg.obj.image!=""){
                    var arr = msg.obj.image.split(',');
                    num=arr.length;
                    if(num==6){
                       $(".a-upload").css("display","none");
                    }
                    for(var i=0; i<arr.length; i++){
                        var imgUrl = apiUrlPic+arr[i];
                       $('#pic-document-list').append($('<li picUrl="' + arr[i] + '"class="apply-book"> <img  src=" ' + imgUrl + '"> <a docUrl="' + arr[i] + '" href="javascript:void(0)" class="text-basic del-doc"><i class="iconfont icon-delete"></i></a></li>'));
                    }										
                }
				goodscategory=$("#categoryId").val(); 
				initEditGoodsCategoryInfo(goodscategory);
					
                ue.ready(function() {
                    //设置编辑器的内容
                    ue.setContent(msg.obj.detailDescribe);
                });
            }
        });
		
		//初始化规格数据
		var url = apiUrl + "/admin/goodsPrice/goodsPriceAdmin/getGoodsPriceListByGoodsId?goodsId=" + id;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {                
                if(msg.obj ==undefined){
                    //没有规格数据                    
                }else{
					var objList=msg.obj;
					for(var ij=0;ij<objList.length;ij++){
						var goodsprice=objList[ij];
						
						var arr = new Array();
						arr[0] = goodsprice.priceId;;//新增规格默认id
						arr[1] = goodsprice.unitName;
						arr[2] = goodsprice.buyPrice/100; 
						arr[3] = goodsprice.retailPrice/100;
						arr[4] = goodsprice.wholesalePrice/100;
						arr[5] ="<a style='text-align:center;color:blue;cursor:pointer;' onclick='delRow(this);'>删除</a>";
						var x = document.getElementById('table').insertRow(1); //获取第一行对象    
						for(var i=0;i<arr.length;i++){
							x.insertCell(i).innerHTML = arr[i] ;  //用循环把每个数据插入第一行的每一列		
						}	
						x.cells[0].style.display = "none";//隐藏第一列，保存的是规格id						
					}
				}
            }
        });
    }

    Validate();


    jQuery.validator.addMethod("num", function(value, element) {
        var num = /^(([1-9]+\d*)|(\d+(\.\d[1-9]))|(\d+(\.[1-9])))$/g;
        return this.optional(element) || (num.test(value));
    }, "请填写非负正数且最多保留小数点后两位 ");


    function Validate() {
        $("#form-box").validate({
            rules: {
                goodsName: {
                    required: true,
                    maxlength: 20
                },
                recommend: {
                    required: true
                }
            },
            messages: {
                goodsName: {
                    required: "商品名称必填",
                    maxlength:"最多填写20个字符"
                },
                recommend: {
                    required: "请选择一个"
                }
            },
            submitHandler: function(form) {

			if($("#categoryId").val()==0){
				alert("请选择商品分类！");
				return;
			}; 
             var price = $("#price").val()*100;
             $("#pic-document-list > li").each(function() {
                atr += $(this).attr("picUrl") + ",";
             });
             var reg=/,$/gi; 
             atr=atr.replace(reg,""); 
			 var goodspriceList=getAllTableData();
			  var data = $("#form-box").serialize()+"&image="+atr;
			 if(goodspriceList == undefined){
				 data=data;
			 }else{
				 data=data+"&goodspriceList="+JSON.stringify(goodspriceList);
			 }
            //var data = $("#form-box").serialize()+"&image="+atr+"&goodspriceList="+JSON.stringify(goodspriceList);
             
            components.getMsg(submitUrl, data, "post").done(function(msg){
                if (msg.res == 1) {
                    components.Alert("success", "修改成功");
                    setTimeout(function() {
                        window.history.go(-1);
                    }, 2000);
                }
            });
            }
        });
    }
    
	//拉取分类信息并加载；levelCategoryId表示信息加载所在div的id,parentId表示用来查询子级分类的id,selectOptionValue默认选中的value
	function initLevelCategoryDataList(levelCategoryId,parentId,selectOptionValue){
		var url = apiUrl + "/admin/productcategory/productcategory/getAllNormalChildCategoryByCategoryId?categoryId=" + parentId;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
					var dataList=msg.obj;					
					msg.dataList=dataList;
					var html = template('levelCategoryDataList', msg);
					if(levelCategoryId=="firstLevelList"){
						html= '<option  value="0">一级分类</option>'+html;
					}else{
						html='<option  value="0">二级分类</option>'+html;
					}
					$("#"+levelCategoryId).html(html);
					if(selectOptionValue){
						$("#"+levelCategoryId).val(selectOptionValue);
					}
            }
        });
	}
		
	//一级分类值改变
	function firstLevelListOnChange(value){
		var html='<option  value="0">二级分类</option>';
		$("#secondLevelList").html(html);
		initLevelCategoryDataList("secondLevelList",value,0);
		$("#categoryId").val(value); 
	}
	
	//二级分类值改变
	function secondLevelListOnChange(value){
		if(value==0){
			//选择二级分类0,则取一级分类下面的选项
			var objS = document.getElementById("firstLevelList");
			var grade = objS.options[objS.selectedIndex].value;
			$("#categoryId").val(grade);
		}else{			
			$("#categoryId").val(value); 
		}
	}
	
	//初始化商品分类展示信息
	function initEditGoodsCategoryInfo(goodscategory){
		if(goods){
			//编辑商品
			var url = apiUrl + "/admin/productcategory/productcategory/getProductCategoryInfo?categoryId=" + goodscategory;
			components.getMsg(url).done(function(msg) {
				var res = msg.res;
				if (res == 1) {
					var productCategory=msg.obj;
					if(productCategory.parentId==0){
						//是一级分类
						initLevelCategoryDataList("firstLevelList",0,productCategory.categoryId);//初始化一级分类
					}else{
						//是二级分类
						initLevelCategoryDataList("firstLevelList",0,productCategory.parentId);//初始化一级分类
						initLevelCategoryDataList("secondLevelList",productCategory.parentId,productCategory.categoryId); 
					}
				}
			});
		}else{
			//新增商品
			initLevelCategoryDataList("firstLevelList",0,0);//初始化一级分类
		}
		
			
	$('#firstLevelList').on('change', function(){
		var objS = document.getElementById("firstLevelList");
        var grade = objS.options[objS.selectedIndex].value;
		firstLevelListOnChange(grade);
	});				
	$('#secondLevelList').on('change', function(){
		var objS = document.getElementById("secondLevelList");
        var grade = objS.options[objS.selectedIndex].value;
		secondLevelListOnChange(grade);
	});
	}
	
	
	
});
