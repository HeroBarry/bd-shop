define(["jquery", "components", "template", "manageCommon", "bootstrap", "jqueryValidate"], function (jquery, components, template, manageCommon, bootstrap, jqueryValidate) {
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

    var orderNumber = components.GetQueryString("id");
    var sendState = components.GetQueryString("sendState");
    var _orderId = components.GetQueryString("orderId");
    var state = components.GetQueryString("state");
    getUserInfo(orderNumber);
    function getUserInfo(id) {
        var url = apiUrl + "/admin/order/orderAdmin/getOrderByOrderNumber?orderNumber=" + id;
        components.getMsg(url, "post").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template("logisticsInfo-tpl", msg);
                document.querySelector("#logisticsInfo").innerHTML = html;
                var div = template("table-list-tpl", msg);
                document.querySelector("#table-list-content").innerHTML = div;
               /* var box = template("userinfo-tpl", msg);
                document.querySelector("#userinfo").innerHTML = box;*/

                if (msg.obj.state == 1) {
                    $(".dis").css("display", "none");
                }
            } else {
                components.Alert("", "出错了！");
            }
        });
    }

    $("#box-list-content").on("click", ".modal-send", function () {
        $("#modal-send").modal({
            show: true
        })
    });

    $("#sub").bind("click", function(){
        var data = {
            orderId: _orderId
        };
        components.getMsg(apiUrl + "/admin/order/orderAdmin/toSend", data, "post").done(function (msg) {
            if (msg.res == 1) {
                components.Alert("success", "发货成功");
                //$("#send-modal").modal("hide");
                setTimeout(function () {
                    window.history.go(-1);
                }, 2000);
            } else {
                //$("#send-modal").modal("hide");
                components.Alert("", "失败");
            }
        });
    });
    validate();

    function validate() {
        $("#sePw").validate({
            rules: {
                logisticsNumber: {
                    required: true
                }
            },
            messages: {
                logisticsNumber: {
                    required: "请输入物流单号"
                }
            },
            submitHandler: function (form) {
                var _logisticsNumber = $("#logNumber").val();
                var data = {
                    logisticsNumber: _logisticsNumber,
                    orderId: _orderId
                };
                components.getMsg(apiUrl + "/admin/order/orderAdmin/toSend", data, "post").done(function (msg) {
                    if (msg.res == 1) {
                        components.Alert("success", "发货成功");
                        $("#send-modal").modal("hide");
                        setTimeout(function () {
                            window.history.go(-1);
                        }, 2000);
                    } else {
                        $("#send-modal").modal("hide");
                        components.Alert("", "失败");
                    }
                });
            }
        });
    }

});