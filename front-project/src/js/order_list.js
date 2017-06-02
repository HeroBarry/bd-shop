define(['jquery', "components", "common", "template", "weui"], function (jquery, components, common, template, weui) {
    //getUserInfo();
    // getOrderList();
    //$("#index-menu li").eq(2).addClass("active");
    var $orderList = $("#order-box");

    var $loadmore = $("#weui-loadmore"),
        $weuiNone = $("#weui-none");

    var _payState = '';
    var _paymentId = null;
    var _logisticsState = null;
    // $("#all").bind("click", function () {
    //     $(".weui-navbar a").siblings('.weui-tab__bd-item--active').removeClass('weui-tab__bd-item--active');
    //     $(this).addClass('weui-tab__bd-item--active');
    //     setTimeout(orderList.d(orderList.page, orderList.size), 2000); //模拟延迟取数据
    // });
    // $("#noPay").bind("click", function () {
    //     $(".weui-navbar a").siblings('.weui-tab__bd-item--active').removeClass('weui-tab__bd-item--active');
    //     $(this).addClass('weui-tab__bd-item--active');;
    //     _payState = 1;
    //     setTimeout(orderList.d(orderList.page, orderList.size), 2000); //模拟延迟取数据
    // });
    // $("#pay").bind("click", function () {
    //     $(".weui-navbar a").siblings('.weui-tab__bd-item--active').removeClass('weui-tab__bd-item--active');
    //     $(this).addClass('weui-tab__bd-item--active');
    //     _payState = 2;
    //     setTimeout(orderList.d(orderList.page, orderList.size), 2000); //模拟延迟取数据
    // });

    $('#order-list').on('click','a',function(){
        _payState = $(this).attr('state');
        orderList.page=1;
        $(this).find('div').addClass('active_div').parent().siblings().find('div').removeClass('active_div');
        setTimeout(orderList.d(orderList.page, orderList.size), 2000);
    })

    $("#logisticsState").change(function(){
        _logisticsState = $("#logisticsState").val();
        orderList.page=1;
        setTimeout(orderList.d(orderList.page, orderList.size), 2000); //模拟延迟取数据
    });

    $("#paymentId").change(function(){
        _paymentId = $("#paymentId").val();
        orderList.page=1;
        setTimeout(orderList.d(orderList.page, orderList.size), 2000); //模拟延迟取数据
    });
    var orderList = {
        page: 0, //触发获取数据的数次(+1等于页码)
        size: 10, //每次触发取的记录条数
        cid: '', //当前选中的推销类型
        isLoading: false, //列表是否加载中，避免重复触底加载
        //获取数据
        getMore: function (first) {
            if (orderList.isLoading) //取数过程中，先停止重复取数
                return;

            if (first) {
                orderList.page = 1;
                $weuiNone.hide();
                $("#newListBox").html('');
            } else {
                orderList.page += 1;
            }
            $loadmore.show(); //显示加载框
            orderList.isLoading = true;
            setTimeout(orderList.d(orderList.page, orderList.size), 2000); //模拟延迟取数据
        },

        //异步获取商品列表
        d: function (page, size) {
            var dataJson = {
                "payState":_payState,
                "paymentId":_paymentId,
                "logisticsState":_logisticsState,
                "pageNo": page,
                "pageSize": size
            };
            components.getMsg(apiUrl + "/front/order/order/getOrderByPage?pageSize=4", dataJson).done(function (msg) {
                var res = msg.res;
                if (res !== 0) {
                    msg = msg.obj;
                    for (var i = 0; i < msg.dataList.length; i++) {
                        msg.dataList[i].goodsName = msg.dataList[i].orderDetailsList[0].goodsName;
                        //msg.dataList[i].orderDetailsList[0].image = msg.dataList[i].orderDetailsList[0].image.split(",");
                        //msg.dataList[i].image = apiUrlPic + msg.dataList[i].orderDetailsList[0].image[0];
                        msg.dataList[i].totalAmount = msg.dataList[i].totalAmount / 100;
                        for(var j=0; j<msg.dataList[i].orderDetailsList.length; j++){
                            console.log(msg.dataList[i].orderDetailsList[j].image);
                            var img = msg.dataList[i].orderDetailsList[j].image;
                            var imgs;
                            if(img.length > 0){
                                imgs = img.split(",");
                                if(imgs.length > 0){
                                    msg.dataList[i].orderDetailsList[j].image = apiUrlPic + imgs[0];
                                }
                            }
                        }
                    }
                    var newsJson = msg.dataList;
                    var html = template('order-box-tpl', msg);
                    if (newsJson && newsJson.length > 0) {
                        orderList.isLoading = false;
                        $weuiNone.hide();
                    } else {
                        orderList.isLoading = true;
                        $weuiNone.show();
                    }
                    if (orderList.page > 1) {
                        $orderList.append(html);
                    } else {
                        $orderList.html(html);
                    }
                    $loadmore.hide(); //隐藏加载框
                } else {
                    $orderList.html('');
                    $weuiNone.show();
                    $loadmore.hide();
                }

            });
        }
    };
    $(window).scroll(function () {
        //滚动高度 + 窗口高度 + (底部导航高度 + 版权块高度) >= 文档高度，注意：文档高度不包括fixed定位的元素（分类导航、底部导航）
        if ($(document).scrollTop() + $(window).height() + (50 + 50) >= $(document).height()) {
            orderList.getMore(false); //获取数据
        }
    });
    orderList.getMore(true);

    function getUserInfo() {
        components.getMsg(apiUrl + "/front/user/user/getUserById").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                var html = template('user-info-tpl', msg);
                $("#user-info").html(html);
            }
        });
    }

    $("#order-box").on("click", ".send-modal", function () {
        var _orderNumber = $(this).attr("oNum");
        url = apiUrl + "/front/order/order/buyGoodsAgain?orderNumber=" + _orderNumber;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                window.location.href = '/page/order_submit.html';
            } else {
                $.toast("购买失败", "text");
            }
        });
    });

});
