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

    var adid= components.GetQueryString("id");
    var submitUrl = "";
    if (adid) {
        submitUrl = apiUrl + "/admin/ad/ad/editAdPosition?adPositionId="+ adid;
        $("#addState").text("编辑广告位置");
        getData(adid);
    } else {
        submitUrl = apiUrl + "/admin/ad/ad/addAdPosition";
        $("#addState").text("添加广告位置");
    }

    function getData(id) {
        var url = apiUrl + "/admin/ad/ad/getAdPositionById?adPositionId=" + id;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
            }
        });
    }

    Validate();

    function Validate() {
        $("#form-box").validate({
            rules: {
                name: {
                    required: true,
                    maxlength: 30
                },
                position: {
                    required: true,
                    maxlength: 30
                },
                measure: {
                    required: true,
                    maxlength: 11
                },
                state: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "广告名称必填",
                    maxlength: "最多填写30个字符"
                },
                position: {
                    required: "广告位置必填",
                    maxlength: "最多填写30个字符"
                },
                measure: {
                    required: "广告尺寸必填",
                    maxlength: "最多填写11个字符"
                },
                state: {
                    required:"请选择一个"
                }
            },
            submitHandler: function(form) {
                var data = $("#form-box").serialize();

                components.getMsg(submitUrl, data, "post").done(function(msg){
                    console.log(msg);
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

});
