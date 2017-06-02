define(['jquery', "components", "common", "weui"], function(jquery, components, common, weui) {
    // 姓名验证
    var isphone = false;
    var iscode = false;
    var isReSend = true;
    var isphoneText = "请输入手机号码";
    var iscodeText = "请输入您的验证码";
    var $phone = $("#phone");
    var $code = $("#auto-code");
    var countdown = 60; //定义短信发送时间间隔

    //// 判断手机号码
    //$phone.blur(function() {
    //    var str = $(this).val();
    //    var re = /^1([3578]\d|4[57])\d{8}$/;
    //    if (getStrLength(str) == 0) {
    //        $.toast("请输入手机号码", "text");
    //        isphone = false;
    //        isphoneText = "请输入手机号码";
    //    } else if (!re.test(str)) {
    //        $.toast("手机格式错误", "text");
    //        isphone = false;
    //        isphoneText = "手机格式错误";
    //    } else {
    //        isphone = true;
    //    }
    //});



    //点击获取手机验证码
    $("#code-btn").click(function(e) {
        e.preventDefault();
        var phone = $phone.val();
        var phone = $phone.val();
        var code = $code.val();
        var re = /^1([3578]\d|4[57])\d{8}$/;
        if (getStrLength(phone) == 0) {
            isphone = false;
            isphoneText = "请输入手机号码";
        } else if (!re.test(phone)) {
            isphone = false;
            isphoneText = "手机格式错误";
        } else {
            isphone = true;
        }
        $this = $(this);
        // var code = $code.val();
        if (isphone&&isReSend) {
                    components.getMsg(apiUrl + "/front/user/user/sendCode", "phone=" + phone, "post").done(function(msg) {
                        var res = msg.res;
                        if (res == 1) {
                            $.toast("发送成功", "text");
                            isReSend = false;
                            countdown = 60;
                            settime($this);
                        } else if (res == 303) {
                            $.toast("操作频繁", "text");
                        } else {
                            $.toast("请求失败", "text");
                        }
                    });           
        } else if(!isphone){
            $.toast(isphoneText, "text");
        }
    });

    $("#bind-btn").click(function(e) {
        e.preventDefault();
        var phone = $phone.val();
        var code = $code.val();
        var re = /^1([3578]\d|4[57])\d{8}$/;
        if (getStrLength(phone) == 0) {
            isphone = false;
            isphoneText = "请输入手机号码";
        } else if (!re.test(phone)) {
            isphone = false;
            isphoneText = "手机格式错误";
        } else {
            isphone = true;
        }
        var re = /^[1-9]\d{5}$/;
        if (getStrLength(code) == 0) {
            iscode = false;
            iscodeText = "请输入您的验证码";
        } else if (!re.test(code)) {
            iscode = false;
            iscodeText = "验证码格式错误";
        } else {
            iscode = true;
        }
        if (!isphone) {
            $.toast(isphoneText, "text");
        } else if (!iscode) {
            $.toast(iscodeText, "text");
        } else {
            components.getMsg(apiUrl + "/front/user/user/checkCode", "phone=" + phone + "&code=" + code, "post").done(function(msg) {
                var res = msg.res;
                if (res == 401 || res==411) {
                    $.toast("验证码错误", "text");
                } else if (res == 503) {
                    $.toast("请求超时", "text");
                } else {
                    $.toast("登录成功", "text");
                    setTimeout(function() {
                        history.go(-1);
                    }, 3000);
                }
            });
        }
    });




    // 得到字符串长度
    function getStrLength(str) {
        return str.replace(/[^\x00-xff]/g, "xx").length;
    }
    //获取验证码倒计时
    function settime(val) {
        if (countdown == 0) {
            val.text("重新发送");
            clearTimeout(t);
            isReSend = true;
        } else {
            val.text("重新发送(" + countdown + ")");
            countdown--;
            t = setTimeout(function() {
                settime(val);
            }, 1000);
        }
    }
});
