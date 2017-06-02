define(['jquery', "components", "common", "template", "weui"], function(jquery, components, common, template, weui) {
    var goodsId = components.GetQueryString("id");
    var goodsName = "";
    var receiveState = "";
    var price = "";
    getDate();

    function getDate() {
        var url = apiUrl + "/front/order/order/doOrder?goodsIds=" + goodsId;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                receiveState = msg.receiveState;
                goodsName = msg.allGoods[0].goodsName;
                price = msg.allGoods[0].price / 100;
                msg.allGoods[0].price = msg.allGoods[0].price / 100;
                msg.allGoods[0].image = msg.allGoods[0].image.split(",");
                for (var i = 0; i < msg.allGoods[0].image.length; i++) {
                    msg.allGoods[0].image[i] = apiUrlPic + msg.allGoods[0].image[i];
                }
                var html = template('order-box-tpl', msg);
                document.getElementById('order-box').innerHTML = html;
                components.getMsg(apiUrl + "/front/logistics/logistic/getListLogistics").done(function(msg) {
                    msg = msg.list;
                    var optionHtml = "";
                    var fistfreightMoney = msg[0].price / 100;
                    var totalPrice = add(price, fistfreightMoney);
                    $("#freight-money").text(fistfreightMoney);
                    $("#total-money").text(totalPrice);
                    for (var i = 0; i < msg.length; i++) {
                        msg[i].price = msg[i].price / 100;
                        optionHtml += '<option price=' + msg[i].price + ' value="' + msg[i].logisticsId + '">' + msg[i].name + "</option>";
                    }
                    $("#logistics-list").html(optionHtml);
                    chageDistri();
                    submitOrder();
                });
            } else if (res == 416) {
                sessionStorage.lastLink = "/page/submit_order.html?id=" + goodsId;
                $.toast("请绑定手机号", "text", function() {
                    location.href = "/page/login.html";
                });
            } else {
                console.log("获取数据失败");
            }

        });
    }

    function submitOrder() {
        var $addressMore = $("#address-more");
        var rid = "";
        $("#submit-btn").click(function() {
            if (receiveState == 602) {
                $.toast("请填写收货地址", "text");
                return;
            } else {
                rid = $addressMore.attr("rid");
            }
            var url = apiUrl + "/front/order/order/addOrder";
            var logisticsId = $("#logistics-list").val();
            var logisticsPrice = $("#freight-money").text();
            var data = {
                "receiveId": rid,
                "logisticsId": logisticsId,
                "orderDetailsList[0].goodsId": goodsId,
                "orderDetailsList[0].goodsName": goodsName,
                "orderDetailsList[0].price": price * 100,
                "orderDetailsList[0].num": "1",
                "logisticsPrice": logisticsPrice * 100
            };
            components.getMsg(url, data, "post").done(function(msg) {
                var res = msg.res;
                if (res == 1) {
                    window.location.href = '/page/pay_check.html?orderNumber=' + msg.result + '&price=' + $("#total-money").text();
                }
            });
        });
    }

    function chageDistri() {
        $("#logistics-list").change(function() {
            var $this = $(this);
            var val = $this.val();
            var fprice = "";
            $this.children().each(function() {
                if ($(this).attr("value") == val) {
                    fprice = $(this).attr("price");
                }
            });
            $("#freight-money").text(fprice);
            var tPrice = add(fprice, price);
            $("#total-money").text(tPrice);
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
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }

    function div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }

});
