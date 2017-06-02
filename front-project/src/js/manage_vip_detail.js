define(['jquery', "template", "components",  "jqueryValidate", "manageCommon"], function(jquery, template, components, validator, manageCommon) {
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

    var userId = components.GetQueryString("id");
     getUserInfo(userId);
    getUserHigherPayment(userId);
    getUserPrivilege(userId);

     function getUserInfo(id){
            var url = apiUrl + "/admin/user/userAdmin/getUserById?userId="+id;
            components.getMsg(url, "post").done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                msg.obj.image = apiUrlPic+msg.obj.image;
                var html = template('list-box-tpl', msg);
                document.querySelector('#userDetail').innerHTML = html;
            } else {
                components.Alert("", "出错了！");
            }
        });

     }

    function getUserHigherPayment(id){
        var url = apiUrl + "/admin/user/userAdmin/queryUserHigherPayment?userId="+id;
        components.getMsg(url, "post").done(function(msg2) {
            var res = msg2.res;
            if (res == 1) {
                var html = template('method-tp', msg2);
                document.querySelector('#method').innerHTML = html;
            } else {
                components.Alert("", "出错了！");
            }
        });

    }

    function getUserPrivilege(id){
        var url = apiUrl + "/admin/user/userAdmin/queryUserPrivilege?userId="+id;
        components.getMsg(url, "post").done(function(msg3) {
            var res = msg3.res;
            if (res == 1) {
                //msg.obj.image = apiUrlPic+msg.obj.image;
                var html = template('privilege-tp', msg3);
                document.querySelector('#privilege').innerHTML = html;
            } else {
                components.Alert("", "出错了！");
            }
        });
    }
    Validate();
    function Validate() {
        $("#form-box").validate({
            submitHandler: function(form) {
                var submitUrl = apiUrl + "/admin/user/userAdmin/editUser";
                 var  isWholeSalePrice=0;
                var discount=100;
                var isDiscount=0;
                if($("#isDiscount")[0].checked){
                     isDiscount=1;
                     discount=$("#discount").val();
                }
                if($("#isWholeSalePrice")[0].checked){
                    isWholeSalePrice=1;
                }
                var paymentbox = document.getElementsByName("paymentbox");
                var paymentString = "";

                for ( var i = 0; i < paymentbox.length; i++) {
                    if (paymentbox[i].checked) {
                        if (paymentString.length != 0) {
                            paymentString = paymentString + ",";
                        }
                        paymentString = paymentString + (paymentbox[i].value);
                    }
                }
                var data = {
                    "userId": userId,
                    "paymentString": paymentString,
                    "discount" : discount,
                    "isDiscount" : isDiscount,
                    "isWholeSalePrice" : isWholeSalePrice
                }
                components.getMsg(submitUrl, data, "post").done(function(msg){
                    if (msg.res == 1) {
                        components.Alert("success", "分配成功");
                        setTimeout(function() {
                            window.history.go(-1);
                        }, 2000);
                    }else{
                        components.Alert("success", "失败");
                    }
                });

            }
        });
    }
});