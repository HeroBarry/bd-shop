define(['jquery', "components", "common", "weui"], function (jquery, components, common, weui) {
    var orderNumber = components.GetQueryString("orderNumber");
    var price = components.GetQueryString("price");
    var startTime=components.GetQueryString("startTime");
    var endTime =components.GetQueryString("endTime");
    var index = price.indexOf(".");
    var str;
    price = parseFloat(price);
    if (index < 0) {
        str = price + ".00";
    } else {
        str = price;
    }
    $("#total-money").text(str);
    $("#total-money2").text("¥" + str);
    $("#time").text("确认结算： "+ startTime +"至"+endTime+"订单费用");
    if (price > 10000) {
        $("#pay-accounts-box").removeClass("hide");
        $("#outstand-amount").text(sub(price, 10000));
    } else {
        $("#full-payout-box").removeClass("hide");
        $("#pay-amount").text(price);
    }

    $("#pay-btn").click(function () {

        if ($("#x11")[0].checked) {
            payByWX();
        } else {
            payByALi();
        }

    });
    var paySign;
    var nonceStr;
    var prepay_id;
    var appId;
    var timeStamp;

    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": appId, //公众号名称，由商户传入
                "timeStamp": timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": nonceStr, //随机串
                "package": "prepay_id=" + prepay_id,
                "signType": "MD5", //微信签名方式：
                "paySign": paySign //微信签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    //$.toast(JSON.stringify(res));
                    // var html = '<div class="weui-msg"><div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div><div class="weui-msg__text-area"><h2 class="weui-msg__title">支付成功</h2></div></div>';
                    window.location = "/page/pay_success.html";
                    // $("#content-box").html(html);
                    // $.toast("支付成功", "text");
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                } else {
                    //$.toast(JSON.stringify(res));
                    $.toast("支付失败", "text");
                }
            }
        );
    }

    function payByWX() {
        $.post(apiUrl + "/wxpay/pay", {
            "orderNumber": orderNumber
        }, function (data) {
            if (data.code == -1) {
                $.toast("下单失败", "text");
                return;
            }
            paySign = data.paySign.toString();
            nonceStr = data.nonce_str.toString();
            prepay_id = data.prepay_id.toString();
            appId = data.appid.toString();
            timeStamp = data.timeStamp.toString();
            alert(paySign);
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }
        });
    }

    function payByALi() {
        $.post(apiUrl + "/alipay/pay", {
            "orderNumber": orderNumber
        }, function (data) {
            if (data.code == -1) {
                $.toast("下单失败", "text");
                return;
            }
            //paySign = data.paySign.toString();
            //nonceStr = data.nonce_str.toString();
            //prepay_id = data.prepay_id.toString();
            //appId = data.appid.toString();
            //timeStamp = data.timeStamp.toString();
            ////alert(paySign);
            //if (typeof WeixinJSBridge == "undefined") {
            //    if (document.addEventListener) {
            //        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            //    } else if (document.attachEvent) {
            //        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            //        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            //    }
            //} else {
            //    onBridgeReady();
            //}
        });
    }


    function add(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    }

    function sub(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    }

    function mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {
        }
        try {
            c += e.split(".")[1].length;
        } catch (f) {
        }
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }

    function div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {
        }
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {
        }
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }
});
