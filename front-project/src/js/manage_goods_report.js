define(['jquery', "template","components", "bootstrap", "jqueryValidate","paginator","manageCommon"], function(jquery, template,components, bootstrap, jqueryValidate,paginator,manageCommon) {
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

    listUrl = apiUrl + "/admin/order/orderAdmin/getPageByOrderDetailsAdminSearchVO";
   	
	
	$('#submit-btn').on('click', function(){
		getData(1);
		getTotalNumAmountAndTotalDetailsAmount();
	});	 
	
	
	function getData(pageNo) {
        $("#cloading").removeClass("hidden");
       var pageSize=10;
		var data = $("#form-box").serialize();	
			data=data+"&pageNo="+pageNo+"&pageSize="+pageSize;
		
        var url = listUrl;
        components.getMsg(url, data, "post").done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
				for (var i = 0; i < msg.dataList.length; i++) {
                    msg.dataList[i].unitPrice = msg.dataList[i].unitPrice /100.00;
					msg.dataList[i].detailsAmount = msg.dataList[i].detailsAmount /100.00;
                }
                /*  for (var j = 0; j < msg.dataList.length; j++) {
                    msg.dataList[j].createTime = components.formatDate(msg.dataList[j].createTime);
                } */
                render(msg);
                var options = {
                    bootstrapMajorVersion: 3, //版本
                    currentPage: 1, //当前页数
                    totalPages: 1, //总页数
                    itemTexts: function(type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "末页";
                            case "page":
                                return page;
                        }
                    }, //点击事件，用于通过Ajax来刷新整个list列表
                    onPageClicked: function(event, originalEvent, type, page) {
                        $("#cloading").removeClass("hidden");
						var data = $("#form-box").serialize();	
							data=data+"&pageNo="+page+"&pageSize="+pageSize
							
                        components.getMsg(url, data, "post").done(function(msg) {
                            render(msg.obj);
                        });
                    }
                };
                options.totalPages = msg.pages;
                $(".page-sum").html('当前页面总数：<span class="text-333">' + msg.pages + '</span> 当前总个数：<span class="text-333">' + msg.total + '</span>');
                $("#cloading").addClass("hidden");
                $('#pagination').bootstrapPaginator(options);
                $("#pagination li").removeClass("active").eq(data.pageNo - 1).addClass("active");
                if (options.totalPages == 1) {
                    $("#pagination").hide();
                } else {
                    $("#pagination").show();
                }
            } else {
                document.getElementById('table-list-tpl').innerHTML = "没有数据";
                $("#cloading").addClass("hidden");
                $(".page-sum").html('');
				$("#pagination").hide();
				document.getElementById('table-list-content').innerHTML = "没有数据";
            }
        });
    }

    function render(msg) {
        var html = template('table-list-tpl', msg);
        document.getElementById('table-list-content').innerHTML = html;
		$("#table-list-content").on("click", ".detailClass", function () {
			var oid =$(this).attr("oid");
			reportdetailClick(oid);
    });
		
    }
	
	//获取商品总金额和已销商品总数
	function getTotalNumAmountAndTotalDetailsAmount(){
		//初始化规格数据
		var url = apiUrl + "/admin/order/orderAdmin/getTotalNumAmountByOrderDetailsAdminSearchVO";		
		var data = $("#form-box").serialize();
		components.getMsg(url, data, "post").done(function(msg) {
			if(msg.res==1){
				document.getElementById('totalNumAmount').innerHTML= msg.obj;
			}
		});
		var aurl = apiUrl + "/admin/order/orderAdmin/getTotalDetailsAmountByOrderDetailsAdminSearchVO";	
		components.getMsg(aurl, data, "post").done(function(msg) {
			if(msg.res==1){
				document.getElementById('totalDetailsAmount').innerHTML= msg.obj/100;
			}
		});
		
	}
	
	
	//日期格式化
	Date.prototype.Format = function(fmt)   
	{ //author: meizz   
	var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
   "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
	};   
	if(/(y+)/.test(fmt))   
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
		if(new RegExp("("+ k +")").test(fmt))   
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
	}  

	
	
	
	//订单详情点击
	function reportdetailClick(priceId){
		if(priceId==undefined || isNaN(parseInt(priceId))){
			return false;
		}
		
		var createTime_le=$("#createTime_le").val();
		var createTime_ge=$("#createTime_ge").val();
		if(createTime_le==undefined ||createTime_le=="" ){
			createTime_le=new Date().Format("yyyy-MM-dd 23:59:59");
		}
		if(createTime_ge==undefined ||createTime_ge=="" ){
			var date = new Date();//获取当前时间  
			date.setDate(date.getDate()-15);//设置天数 -15 天  
			createTime_ge = date.Format("yyyy-MM-dd hh:mm:ss");
		}
		window.location.href="/page/manage_goods_report_detail.html?goodsName="+priceId+"&createTime_le="+createTime_le+"&createTime_ge="+createTime_ge+"&lid=7"; 
	}
	
	getTotalNumAmountAndTotalDetailsAmount();
    getData(1);
});