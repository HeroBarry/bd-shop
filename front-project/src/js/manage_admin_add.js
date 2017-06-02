define(['jquery', "template", "components",  "jqueryValidate","cityPicker","cityselect", "manageCommon"], function(jquery, template, components, validator,cityPicker,cityselect,manageCommon) {
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

    var adid= components.GetQueryString("id");
    var submitUrl = "";
    var adminName = "";
    //initCity();
    if (adid) {
        submitUrl = apiUrl + "/admin/admin/adminUser/editAdmin?adminId="+adid;
        $("#addState").text("编辑管理员");
        getData(adid);
    } else {
        submitUrl = apiUrl + "/admin/admin/adminUser/addAdmin";
        $("#addState").text("添加管理员");
        queryRoleByPage();
    }
    function queryRoleByPage(){
        var url=apiUrl + "/admin/role/role/queryRoleByPage";
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                var html = template('role-tp-1', msg);
                document.getElementById('role-tp').innerHTML = html;

            }
        });
    }
    function getData(id) {
        var url = apiUrl + "/admin/admin/adminUser/getAdminInfo?adminId=" + id;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            var adminInfo;
            if (res == 1) {
                adminInfo=msg.obj;
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
                var settings={
                    url: "/src/libs/city.min.js",
                    prov: null,
                    city: null,
                    dist: null,
                    nodata: null,
                    required: false
                }
                $("#editAdress").citySelect(settings);
                var url=apiUrl + "/admin/role/role/queryRoleByPage";
                components.getMsg(url).done(function(msg) {
                    var res = msg.res;
                    if (res == 1) {
                        var msg=msg.obj;
                        var option;
                        for (var i = 0; i < msg.dataList.length; i++) {
                            if(msg.dataList[i].roleId == adminInfo.role.roleId){
                                option +="<option value='"+msg.dataList[i].roleTypeId+"'  selected >"+msg.dataList[i].name+"</option>";
                            }else{
                                option +="<option value='"+msg.dataList[i].roleTypeId+"'>"+msg.dataList[i].name+"</option>";
                            }
                        }
                        $("#roleList").append(option);
                    }
                });
          }
        });
    }
    function initCity(){
            var settings={
                url: "/src/libs/city.min.js",
                prov: null,
                city: null,
                dist: null,
                nodata: null,
                required: false
            }
            $("#addAdress").citySelect(settings);

    }
    Validate();
    function Validate() {
        $("#form-box").validate({
            rules: {
                state: {
                    required: true
                },
                adminName: {
                    required: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
                lastpass: {
                    required: true,
                    minlength: 6,
                    equalTo: "#passWd"
                },
                companyName: {
                    required: true
                },
                description: {
                    required: true
                }
            },
            messages: {
                state: {
                    required: "请选择一个"
                },
                adminName: {
                    required: "管理账号名称"
                },
                password: {
                    required: "密码请填写",
                    minlength: "密码长度不能小于 6 个字符"
                },
                lastpass: {
                    required: "请输入密码",
                    minlength: "密码长度不能小于 6 个字符",
                    equalTo: "两次密码输入不一致"
                },
                companyName: {
                    required: "公司名称请填写"
                },
                description: {
                    required: "简要描述请填写"
                }
            },
            submitHandler: function(form) {        
            var data = $("#form-box").serialize();
             
            components.getMsg(submitUrl, data, "post").done(function(msg){
                if (msg.res == 1) {
                    components.Alert("success", "添加成功");
                    setTimeout(function() {
                        window.history.go(-1);
                    }, 2000);
                }else if(msg.res == 410){
                    components.Alert("success", "管理账号名称已存在");
                }else if(msg.res == 411 ){
                     components.Alert("success", "管理账号名称已存在");
                }else{
                    components.Alert("success", "失败");
                }
            });
            }
        });
    }

});
