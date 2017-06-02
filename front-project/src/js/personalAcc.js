define(['jquery', "components", "common", "template", "weui"], function(jquery, components, common, template, weui) {
    getUserInfo();
    // getOrderList();
    $("#index-menu li").eq(2).addClass("active");
    var headimgrul=null;
    var nickname=null;
    var phone=null;
    var $orderList = $("#order-box");
    function getUserInfo() {
        components.getMsg(apiUrl + "/front/user/user/getUserById").done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                var html = template('user-info-tpl', msg);
                $("#user-info").html(html);
                phoneVild();
            }
        });
    }
    upPic();
    function upPic() {
        $("#user-info").on("change", "#uploaderInput", function() {
            var formData = new FormData(); 
            formData.append("param", "");
            formData.append("file", $("#uploaderInput")[0].files[0]);
            var url = apiUrl + "/upload/uploadimg/dydz/user";
            $.ajax({
                url: url,
                type: 'POST',
                dataType: "json",
                data: formData,
                processData: false,
                contentType: false,
                success: function(msg) {
                    updateHeadimgurl(msg.result);

                }

            });
        });
    }
    function updateHeadimgurl(headimgurl){
         headimgurl=apiUrlPic +headimgurl;
        var data={
            'headimgurl' :headimgurl,
        };
        var url =apiUrl + "/front/user/user/updateUser";
        components.getMsg(url,data,"POST").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                window.location.href = '/page/personalAcc.html';
            }
        });
    }
    // $("#user-info").on("change", "#nickname", function() {
    //     var nickname =$("#nickname").val();
    //     var data={
    //         'nickname' :nickname,
    //     };
    //     var url =apiUrl + "/front/user/user/updateUser";
    //     components.getMsg(url,data,"POST").done();
    // });
    // $("#user-info").on("change", "#phone", function() {
    //     var phone=$("#phone").val();
    //     var data={
    //         'phone' :phone,
    //     };
    //     var url =apiUrl + "/front/user/user/updateUser";
    //     components.getMsg(url,data,"POST").done();
    // });
    $('#user-info').on('click','#save',function(){
        var phone = $("#phone").val();
        var nickname =$("#nickname").val();
        var url =apiUrl + "/front/user/user/updateUser";
        var userData={
           'phone' :phone,
           'nickname' :nickname
        }
        if (!isphone) {
            $.toast(isphoneText, "text");
        } else if(!nickname){
            $.toast("请填写昵称", "text");
        }else{
          components.getMsg(url,userData,"POST").done(function (msg) {
                var res = msg.res;
                if (res == 1) {
                    $.toast("保存成功！", "text");
                    setTimeout(function() {
                        window.history.go(-1);
                    }, 2000);
                }
            });
        }
    })

    // 判断手机号码
    var isphone = false, isphoneText = "请输入手机号码";
    function phoneVild(){
        $("#phone").blur(function() {
            var str = $(this).val();
            str.replace(/[^\x00-xff]/g, "xx").length;
            var re = /^1([3578]\d|4[57])\d{8}$/;
            if (str == 0) {
                $.toast("请输入手机号码", "text");
                isphone = false;
                isphoneText = "请输入手机号码";
            } else if (!re.test(str)) {
                $.toast("手机格式错误", "text");
                isphone = false;
                isphoneText = "手机格式错误";
            } else {
                isphone = true;
            }
        });
    }


});
