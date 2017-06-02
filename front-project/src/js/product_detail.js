define(['jquery', "components", "common", "template", "weui", "swiper"], function(jquery, components, common, template, weui, swiper) {
    var goodsId = components.GetQueryString("id");
    template.config("escape", false);
    getDate();
    $("#buy-now-btn").attr("href","/page/submit_order.html?id=" + goodsId);

    function getDate() {
        var url = apiUrl + "/front/goods/goods/getGoodsById?goodsId=" + goodsId;
        components.getMsg(url).done(function(msg) {
            msg = msg.obj;
            if (msg.image !== "") {
                msg.image = msg.image.split(",");
                for (var i = 0; i < msg.image.length; i++) {
                    msg.image[i] = apiUrlPic + msg.image[i];
                }
            }
			//msg.image.shift();
            msg.price=msg.price/100;
            var html = template('pro-box-tpl', msg);
            document.getElementById('pro-box').innerHTML = html;
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: 3000, //可选选项，自动滑动
            });
            addMinus();
        });
    }

    function addMinus() {
        $(".minus").click(function() {
            var $input = $(this).siblings("input");
            var num = parseInt($input.val());
            if (num !== 1) {
                num -= 1;
                $input.val(num);
            }
        });
        $(".plus").click(function() {
            var $input = $(this).siblings("input");
            var num = parseInt($input.val());
            num += 1;
            $input.val(num);
        });
    }

    function buyNowBtn() {
        var url = apiUrl + "/front/order/order/doOrder";
        $("#buy-now-btn").click(function() {
            components.getMsg(url, "goodsIds=" + goodsId, "post").done(function(msg) {

            });
        });
    }

});
