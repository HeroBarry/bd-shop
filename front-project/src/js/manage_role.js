define(['jquery', "components", "bootstrap", "manageCommon","jqueryValidate"], function(jquery, components, bootstrap, manageCommon,jqueryValidate) {
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

	listUrl = apiUrl + "/admin/role/role/queryRoleByPage";
    require(['./table']);
    var  _adminId;
    
    $("#table-list-content").on("click",".modify-pwd",function() {
		_adminId =$(this).attr("aod");
		$('#modify-pwd').modal({
			show: true
		});
	});
    $("#rePw").validate({
	    rules: {
	      newPassword: {
	        required: true,
	        minlength: 6
	      },
	      lastpass: {
	        required: true,
	        minlength: 6,
	        equalTo: "#password"
	      }
	    },
	    messages: {
	      newPassword: {
	        required: "请输入密码",
	        minlength: "密码长度不能小于 6 个字母"
	      },
	      lastpass: {
	        required: "请输入密码",
	        minlength: "密码长度不能小于 6 个字母",
	        equalTo: "两次密码输入不一致"
	      }
	    },
	    submitHandler: function(form) {
	        var _newPassword = $("#password").val();
            var data ={
            	newPassword:_newPassword,
            	adminId:_adminId
            };
            components.getMsg(apiUrl + "/admin/admin/adminUser/resetPasswordByAdminId", data, "post").done(function(msg) {
                if (msg.res == 1) {
                   components.Alert("success", "修改成功");
                   $("#modify-pwd").modal("hide");
                }else if(msg.res == 403){
                   components.Alert("", "密码错误");
                }
                else {
                   components.Alert("", "修改失败");
                }
            });
        }
	});
});