define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
    $("#index-menu li").eq(1).addClass("active");
    var apiUrl = "http://localhost:8090/hongbao";
    var $goodsList = $("#product-list");
    var $noRec = $('#noRec');
    var $cloading = $('#cloading');
    var goodsList = {
        page: 0, //触发获取数据的数次(+1等于页码)
        size: 10, //每次触发取的记录条数
        isLoading: false, //列表是否加载中，避免重复触底加载
        url: apiUrl + "/front/goods/goods/getGoodsByPage", //数据api
        getMore: function(first) {
            if (goodsList.isLoading) //取数过程中，先停止重复取数
                return;

            if (first) {
                goodsList.page = 1;
                $('#noRec').hide();
                $goodsList.html('');
            } else {
                goodsList.page += 1;
            }
            $('#cloading').show(); //显示加载框
            goodsList.isLoading = true;
            setTimeout(goodsList.d(goodsList.page, goodsList.size), 1000); //模拟延迟取数据
        },

        //异步获取商品列表
        d: function(page, size) {
            $.ajax({
                url: goodsList.url,
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
                    var newsJson = msg.obj.dataList;
                    msg = msg.obj;
                    for (var i = 0; i < msg.dataList.length; i++) {
                        if (msg.dataList[i].image !== "") {
                            msg.dataList[i].image = msg.dataList[i].image.split(",");
                            for (var j = 0; j < msg.dataList[i].image.length; j++) {
                                msg.dataList[i].image[j] = apiUrl + msg.dataList[i].image[j];
                            }
                        }
                        msg.dataList[i].price = msg.dataList[i].price / 100;
                    }
                    newsJson = msg.dataList;
                    var html = template('product-list-tpl', msg);
                    if (newsJson && newsJson.length > 0) {
                        goodsList.isLoading = false;
                        $noRec.hide();
                    } else {
                        goodsList.isLoading = true;
                        $noRec.show();
                    }
                    if (goodsList.page > 1) {
                        $goodsList.append(html);
                    } else {
                        $goodsList.html(html);
                    }
                    $cloading.hide(); //隐藏加载框
                } else {
                    $noRec.show();
                    $cloading.hide();
                }
            });
        }
    };
    $(window).scroll(function() {
        //滚动高度 + 窗口高度 + (底部导航高度 + 版权块高度) >= 文档高度，注意：文档高度不包括fixed定位的元素（分类导航、底部导航）
        if ($(document).scrollTop() + $(window).height() + (50 + 50) >= $(document).height()) {
            goodsList.getMore(false); //获取数据
        }
    });

    goodsList.getMore(true);



});
