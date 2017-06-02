define(['jquery', "components", "common", "template", "weui"], function(jquery, components, common, template, weui) {
    var orderNumber = components.GetQueryString("id");
    var totalAmount = "";
    template.helper('formatPrice', function(price, type) {
        if (price||price==0) {
            price = price / 100;
            if (type == 'true') {
				if(price==0){
					price="包邮"
				}else{
					price= "¥" + price
				}
                return price;
            }
        }
    });
    getData();

    function getData() {
        components.getMsg(apiUrl + "/front/order/order/getOrderByOrderNumber?orderNumber=" + orderNumber).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                //msg = msg.obj;
                //msg.orderDetailsList[0].image = msg.orderDetailsList[0].image.split(",");
                //msg.orderDetailsList[0].image = apiUrlPic + msg.orderDetailsList[0].image[0];
                var html = template('order-base-tpl', msg);
                document.querySelector("#order-base").innerHTML = html;
                html = template('order-address-tpl', msg);
                document.querySelector("#order-address").innerHTML = html;
                html = template('order-payment-tpl', msg);
                document.querySelector("#order-payment").innerHTML = html;
                html = template('order-goods-tpl', msg);
                document.querySelector("#order-goods").innerHTML = html;
                html = template('order-amount-tpl', msg);
                document.querySelector("#order-amount").innerHTML = html;
                html = template('order-amount2-tpl', msg);
                document.querySelector("#order-amount2").innerHTML = html;
                html = template('order-commont-tpl', msg);
                document.querySelector("#order-commont").innerHTML = html;
                html = template('order-invoiceTag-tpl', msg);
                document.querySelector("#order-invoiceTag").innerHTML = html;
                totalAmount = msg.totalAmount;
                $("#to-pay").click(function() {
                    window.location.href = '/page/pay_check.html?orderNumber=' + orderNumber + '&price=' + totalAmount/100;
                });
            }
        });
    }
});
