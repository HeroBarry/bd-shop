define(['jquery', "components", "common", "weui", "cityPicker", "template"], function(jquery, components, common, weui, cityPicker, template) {
    var receiveId = components.GetQueryString("id");
    var text = "";
    var isphone = false,
        isuser = false,
        isaddress = false,
        isphoneText = "请输入手机号码",
        isuserText = "请输入收货人姓名",
        isaddressText = "请输入详细地址";
    if (receiveId) {
        getDate();
        text = "编辑成功";
    } else {
        setCity("广东省 佛山市 南海区");
        initCity();
        initInfo();
        saveAddress();
        text = "添加成功";
    }

    function getDate() {
        components.getMsg(apiUrl + "/front/receive/receive/getReceiveById?receiveId=" + receiveId).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                isphone = true;
                isuser = true;
                isaddress = true;
                msg = msg.obj;
                var html = template('add-address-tpl', msg);
                document.getElementById('add-address-box').innerHTML = html;
                initCity();
                initInfo();
                saveAddress(receiveId);
            }
        });
    }

    function saveAddress(id) {
        $("#save-btn").click(function() {
            var address=$("#city-picker").val();
            if(address!=null){
                var splitAddress=address.split(" ");
                $("#receiveProvince").val(splitAddress[0]);
                $("#receiveCity").val(splitAddress[1]);
                $("#receiveCounty").val(splitAddress[2]);
            }
            var data = $("#add-address-box").serialize();
            var url = "";
            if (id) {
                data = data + "&receiveId=" + id;
                url = apiUrl + "/front/receive/receive/editReceive";
            } else {
                url = apiUrl + "/front/receive/receive/addReceive";
            }
            if (!isphone) {
                $.toast(isphoneText, "text");
            } else if (!isuser) {
                $.toast(isuserText, "text");
            } else if (!isaddress) {
                $.toast(isaddressText, "text");
            } else {
                components.getMsg(url, data, "post").done(function(msg) {
                    var res = msg.res;
                    if (res == 1) {
                        $.toast(text, "text", function() {
                            window.history.go(-1);
                            // window.location="/page/address_list.html"
                        });
                    }
                });
            }
        });
    }


    function initInfo() {
        var $phone = $("#phone"),
            $userName = $("#userName"),
            $address = $("#address");

        // 判断收货人
        $userName.blur(function() {
            var str = $(this).val();
            if (getStrLength(str) == 0) {
                $.toast("请输入姓名", "text");
                isuser = false;
                isuserText = "请输入姓名";
            } else {
                isuser = true;
            }
        });
        // 判断手机号码
        $phone.blur(function() {
            var str = $(this).val();
            var re = /^1([3578]\d|4[57])\d{8}$/;
            if (getStrLength(str) == 0) {
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

        // 判断收货地址
        $address.blur(function() {
            var str = $(this).val();
            if (getStrLength(str) == 0) {
                $.toast("请输入详细地址", "text");
                isaddress = false;
                isaddressText = "请输入详细地址";
            } else {
                isaddress = true;
            }
        });
    }

    // 得到字符串长度
    function getStrLength(str) {
        return str.replace(/[^\x00-xff]/g, "xx").length;
    }

    // 初始化地区
    function initCity() {
        $("#city-picker").cityPicker({
            title: "选择地址"
        });
    }

    // 根据数据设置地区
    function setCity(str) {
        $("#city-picker").val(str);
    }
});
