define(['jquery', "template", "components", "bootstrap", "manageCommon"], function(jquery,template, components, bootstrap, manageCommon) {
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

    listUrl = apiUrl + "/admin/productcategory/productcategory/getProductcategoryByPage";
    require(['./table']);
    //删除通知通告
    delMessage();

    function delMessage() {
        $("#table-list-content").on("click", ".del-btn", function() {
            var url = apiUrl + "/admin/productcategory/productcategory/delProductcategoryById?categoryId=" + $(this).attr("god");
            $("#del-modal").modal('show');
            $("#submit-btn").click(function() {
                components.getMsg(url).done(function(msg) {
                    if (msg.res == 1) {
                        components.Alert("success", "删除成功");
                        location.reload();
                        $("#del-modal").modal('hide');
                    } else {
						alert(msg.msg);
						location.reload();
                        $("#del-modal").modal('hide');
                       // components.Alert("", "删除失败");
                    }
                });
            });
        });
		
		$("#table-list-content").on("click", ".showorhidechildcategory", function() {
			var categoryId=$(this).attr("god");
			var src=this.src;
			if(src.indexOf("add")>0){
				src=src.substring(0,src.indexOf("add"))+"substact.png";
				this.src=src;//"/src/image/substact.png";
			}else{
				src=src.substring(0,src.indexOf("substact"))+"add.png";
				this.src=src;//"/src/image/substact.png";
				//this.src="/src/image/add.png";
				document.getElementById('child_'+categoryId).style.display = "none";
				document.getElementById('child_table_'+categoryId).innerHTML = '';
				return;
			}
            var url = apiUrl + "/admin/productcategory/productcategory/getAllNormalChildCategoryByCategoryId?categoryId="+categoryId;
            components.getMsg(url).done(function(msg) {
            if (msg.res == 1) {
				msg.dataList=msg.obj;
				 for (var j = 0; j < msg.dataList.length; j++) {
                    msg.dataList[j].createTime = components.formatDate(msg.dataList[j].createTime);
                }
                var html = template('child_table_tp', msg);
				document.getElementById('child_table_'+categoryId).innerHTML = html;
				document.getElementById('child_'+categoryId).style.display = "";
            } else {
				components.Alert("", "该分类没有相应的二级分类!");
            }
            });
        });
    }
});