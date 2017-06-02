define(['jquery', "components", "common", "template", "weui"], function (jquery, components, common, template, weui) {
    var $orderList = $("#order-box");
    var $loadmore = $("#weui-loadmore");
    var $noRec = $('#noRec');
    var _payState = null;
    var _paymentId = null;
    var _logisticsState = null;
    var money = 0;
    var num = 0;
    var len;
    var startTime="";
    var endTime="";
    var orderList = {
        page: 0, 
        size: 15, 
        isLoading: false,
        url:apiUrl + "/front/order/order/getLJOrderByPage?pageSize=4",
        getMore: function (first) {
            if (orderList.isLoading) 
                return;

            if (first) {
                orderList.page = 1;
                $('#noRec').hide();
                $orderList.html('');
            } else {
                orderList.page += 1;
            }
            $loadmore.show(); 
            orderList.isLoading = true;
            setTimeout(orderList.d(orderList.page, orderList.size), 1000);   
        },


        d: function (page, size) {
            $.ajax({
                url: orderList.url,
                data: "pageNo=" + page + "&pageSize=" + size,
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                dataType: "json",
            }).done(function(msg) {
                var res = msg.res;
                if (res !== 0) {
                    msg = msg.obj;
                    for (var i = 0; i < msg.dataList.length; i++) {
                        msg.dataList[i].goodsName = msg.dataList[i].orderDetailsList[0].goodsName;
                        //msg.dataList[i].orderDetailsList[0].image = msg.dataList[i].orderDetailsList[0].image.split(",");
                        //msg.dataList[i].image = apiUrlPic + msg.dataList[i].orderDetailsList[0].image[0];
                        msg.dataList[i].totalAmount = msg.dataList[i].totalAmount / 100;
                        for (var j = 0; j < msg.dataList[i].orderDetailsList.length; j++) {
                            console.log(msg.dataList[i].orderDetailsList[j].image);
                            var img = msg.dataList[i].orderDetailsList[j].image;
                            var imgs;
                            if (img.length > 0) {
                                imgs = img.split(",");
                                if (imgs.length > 0) {
                                    msg.dataList[i].orderDetailsList[j].image = apiUrlPic + imgs[0];
                                }
                            }
                        }
                    }
                    var newsJson = msg.dataList;
                    var html = template('order-box-tpl', msg);
                   // $("#order-box").html(html);
                    if (newsJson && newsJson.length > 0) {
                        orderList.isLoading = false;
                        $noRec.hide();
                    } else {
                        orderList.isLoading = true;
                        $noRec.show();
                    }
                    if (orderList.page > 1) {
                        $orderList.append(html);
                        len =$("#order-box .order-list");
                    } else {
                        $orderList.html(html);
                        len =$("#order-box .order-list");
                    }
                    $loadmore.hide();

                } else {
                    $noRec.show();
                    $loadmore.hide();
                }

            });
        }
    };
    $(window).scroll(function () {
        var num1 = $(document).scrollTop() + $(window).height() + (50 + 50);
        var num2 = $(document).height();
       
        if (num1 >= num2) {
            orderList.getMore(false); 
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

    $("#order_submit").click(function () {
        if (money != null && money >= 10000) {
            //$.toast("金额超过10000", "text");
            return;
        }
        if(money<=0){
            $.toast("请选择一个去付款", "text");
            return;
        }
        var url = apiUrl + "/front/order/order/joinOrder";
        var moduleCheckBox = document.getElementsByName("checkbox");
        var orderNumber = "";
  
        for (var i = 0; i < moduleCheckBox.length; i++) {
           
            if (moduleCheckBox[i].checked) {
                if (orderNumber.length != 0) {
                    orderNumber = orderNumber + ",";
                }
                orderNumber = orderNumber + (moduleCheckBox[i].value);
                var time =$("#time_"+i).val();
                checkTime(time);   
            }
        }
      
        var data = {
            "orderNumbers": orderNumber,
        }
        components.getMsg(url, data, "post").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                // msg = msg.obj;
                window.location.href = '/page/pay_check_settle.html?orderNumber=' + msg.result + '&price=' + money+'&startTime='+startTime+'&endTime='+endTime;
            }else{
                $.toast("购买失败", "text");
            }
        });
    });
    function getTotalAmount($this) {
        var totalAmount = $this.attr("Money");
        //alert(totalAmount);
        //var moduleCheckBox = document.getElementsByName("checkbox");
        money = $("#total-money").text();
        if ($this.is(":checked")) {
            money = parseInt(money * 100) + parseInt(totalAmount * 100);
            num++;
        } else {
            money = parseInt(money * 100) - parseInt(totalAmount * 100);
            num--;
        }
        money = money / 100;
        if (money != null && money >= 10000) {
           $("#order_submit").text("超出支付金额");
           $("#order_submit").css("background-color", "#C6C6C6");
        } else {
            $("#order_submit").text("结算");
            $("#order_submit").css("background-color", "#2BC17A");
        }
        $("#total-money").text(money);
        $("#num").text(num);
    }
     $("#order-box").on("click", ".chosen", function () {
        var _this = $(this);
        getTotalAmount(_this);
    });

    $("#total-money").text(money);
    $("#num").text(num);
function  checkTime (time){
    var date = new Date(time.replace(/\-/g, "\/")); 
    if(startTime=="" && endTime=="" ){
        startTime=time;
        endTime=time;
    }else{
          var startDate =new Date(startTime.replace(/\-/g, "\/"));
          var endDate =new Date(endTime.replace(/\-/g, "\/"));
          if(startDate>date){
                startTime=time;
             }else if(endDate<date){
                endTime=time;
         }
    } 
}


});

