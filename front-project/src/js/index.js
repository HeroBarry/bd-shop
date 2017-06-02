define(["components", "common", "template"], function (components, common, template) {
    components.addActiveClass(0);
    var apiUrl = "http://123.56.254.10:8080/";
    var apiUrlPic = "http://123.56.254.10:8080/";
    var $goodsList = $("#product-list");
    var $cloading = $('#cloading');
    var addordeleteLock = false;//同一规格加减改操作锁，true表示锁住了
  //  getTest();

    function getTest() {
        $.ajax({
            url: apiUrl + "/front/user/user/test",
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        }).done(function (msg) {
            var res = msg.res;
            if (res === 301) {
               // window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="

            }
        });
    }
    //删除购物车中的一个规格数量
    function subOneToShoppingCart(priceId) {
        operateShoppingCartInterface(2, priceId, 1);
    }

    //商品只有一个规格时增删改数量	 operateType 1增 2删 3改
    function operateShoppingCart(operateType, priceId) {
        operateShoppingCartInterface(operateType, priceId, 0);
    }

    //增加一个规格
    function addOneToShoppingCart(priceId) {
        operateShoppingCartInterface(1, priceId, 1);
    }
    //刷新当前用户的购物车总金额及种类数
    function flushCurrentUserTotalPriceAndCategory() {
        var flushurl = apiUrl + "/front/shoppingcart/shoppingcart/queryCurrentUserTotalPriceAndCategory";
        components.getMsg(flushurl).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                //查询总价和种类成功
                var totalpriceandcategory = msg.obj;
            //    document.getElementById("totalNumber").innerHTML = totalpriceandcategory.totalPrice / 100 * 1.00;
               // document.getElementById("totalCategory").innerHTML = totalpriceandcategory.totalCategory;
               // settleAccounts();
            }
            else {
                alert("获取总价失败！");
            }
        });
    }
    function operateShoppingCartInterface(operateType, priceId, source) {
        if (addordeleteLock == true) {
            return;//当前其他操作未完成，锁住了
        }
        addordeleteLock = true;
        var edit_goodspriceId = "one_edit_" + priceId;
        var sub_goodspriceId = "one_sub_" + priceId;
        if (source == 1) {
            edit_goodspriceId = "edit_" + priceId;
            sub_goodspriceId = "sub_" + priceId;
        }
        var number = $("#" + edit_goodspriceId).val();
        number = parseInt(number);
        if (isNaN(number) || number < 0) {
            number = 0;
        }
        if (operateType == 1) {
            //加一操作
            number = parseInt(number) + parseInt(1);
        } else if (operateType == 2) {
            //减一操作
            number = parseInt(number) - parseInt(1);
        }
        if (number > 10000) {
            number = 10000;
        }
        var changeurl = apiUrl + "/front/shoppingcart/shoppingcart/editNumeberToShoppingCart?priceId=" + priceId + "&quantity=" + number;
        components.getMsg(changeurl).done(function (msg) {
            addordeleteLock = false;
            flushCurrentUserTotalPriceAndCategory();//因为商品购物车数量是所有拟购买的规格的总数;
            var res = msg.res;
            if (res == 1) {
                if (number == 0) {
                    //规格数减到0，隐藏
                    document.getElementById(sub_goodspriceId).style.display = "none";
                    document.getElementById(edit_goodspriceId).style.display = "none";
                } else {
                    document.getElementById(sub_goodspriceId).style.display = "block";
                    document.getElementById(edit_goodspriceId).style.display = "block";
                }
                $("#" + edit_goodspriceId).val(number);
            } else {
                alert("直接修改数量操作失败！");
            }
        });
    }
    function showOrhideGoodspriceList(goodsId) {
        var showId = "show_goods_price_list_" + goodsId;
        var display = document.getElementById(showId).style.display;
        if (display == 'none') {
            //展开
            var suburl = apiUrl + "/front/goodsPrice/goodsPrice/getGoodsPriceListByGoodsId?goodsId=" + goodsId;
            components.getMsg(suburl).done(function (msg) {
                var res = msg.res;
                var goodspriceDataList = msg.obj;
                if (res === 1 && !!goodspriceDataList) {
                    //获取到产品规格

                    //处理显示的价格
                    for (var pi = 0; pi < goodspriceDataList.length; pi++) {
                        goodspriceDataList[pi].retailPrice = goodspriceDataList[pi].retailPrice / 100;
                    }

                    msg.goodspriceDataList = goodspriceDataList;
                    var html = template('show_goods_price_list-tpl', msg);
                    $("#" + showId).html(html);
                    var ggs_id = "goodsId_" + goodsId;
                    document.getElementById(ggs_id).innerHTML = "收起";
                    document.getElementById(showId).style.display = "";
                    //绑定增删改规格数量事件及初始化规格数量，规格数量取采购价
                    for (var m in goodspriceDataList) {
                        var goodsPrice_id = new Object();
                        goodsPrice_id = goodspriceDataList[m].priceId;
                        $("#edit_" + goodsPrice_id).val(goodspriceDataList[m].buyPrice);
                        $("#sub_" + goodsPrice_id).click(function () {
                            subOneToShoppingCart(this.id.substring(4));
                        });
                        $("#add_" + goodsPrice_id).click(function () {
                            addOneToShoppingCart(this.id.substring(4));
                        });
                        $("#edit_" + goodsPrice_id).change(function () {
                            editNumeberToShoppingCart(this.id.substring(5));
                        });
                        if (goodspriceDataList[m].buyPrice == 0) {
                            //规格数为0，则隐藏减号和数字
                            document.getElementById("sub_" + goodsPrice_id).style.display = "none";
                            document.getElementById("edit_" + goodsPrice_id).style.display = "none";
                        }
                    }
                    ;
                } else {
                    alert("获取产品规格失败！");
                }
            });
        } else {
            //收起
            document.getElementById(showId).style.display = "none";
            var ggs_id = "goodsId_" + goodsId;
            document.getElementById(ggs_id).innerHTML = "选择规格";
        }
    }

    var goodsList = {
        page: 0, //触发获取数据的数次(+1等于页码)
        size: 3, //每次触发取的记录条数
        isLoading: false, //列表是否加载中，避免重复触底加载
        url: apiUrl + "/front/goods/goods/getPageFrontVOByGoodsCategory", //数据api
        getMore: function (first) {
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
        d: function (page, size) {
            $.ajax({
                url: goodsList.url,
                data: "pageNo=" + page + "&pageSize=" + size + "&categoryId=0",
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                dataType: "json"
            }).done(function (msg) {
                var res = msg.res;
                if (res !== 0) {
                    msg = msg.obj;
                    for (var i = 0; i < msg.dataList.length; i++) {
                        if (msg.dataList[i].image !== "") {
                            msg.dataList[i].image = msg.dataList[i].image.split(",");
                            for (var j = 0; j < msg.dataList[i].image.length; j++) {
                                msg.dataList[i].image[j] = apiUrl + msg.dataList[i].image[j];
                            }
                        }
                        msg.dataList[i].vo_retailPrice = msg.dataList[i].vo_retailPrice / 100;
                    }
                    var newsJson = msg.dataList;
                    var html = template('product-list-tpl', msg);
                    var goodsDataList = msg.dataList;


                    if (newsJson && newsJson.length > 0 && page < 2) {
                        goodsList.isLoading = false;
                    } else {
                        goodsList.isLoading = true;
                        if (!!$('#noRec')[0]) {
                            $('#noRec').remove();
                        }
                    }
                    if (goodsList.page > 1) {
                        $goodsList.append(html);
                    } else {
                        $goodsList.html(html);
                    }
                    $cloading.hide(); //隐藏加载框
                    for (var z in goodsDataList) {
                        var goods_id = new Object();
                        goods_id = "goodsId_" + goodsDataList[z].goodsId;
                        $("#" + goods_id).click(function () {
                            showOrhideGoodspriceList(this.id.substring(8));
                        });

                        //隐藏的默认有的一个规格时的增删改增加绑定事件
                        $("#one_edit_" + goodsDataList[z].vo_priceId).val(goodsDataList[z].vo_shoppingCartNum);
                        $("#one_sub_" + goodsDataList[z].vo_priceId).click(function () {
                            operateShoppingCart(2, this.id.substring(8));
                        });
                        $("#one_add_" + goodsDataList[z].vo_priceId).click(function () {
                            operateShoppingCart(1, this.id.substring(8));
                        });
                        $("#one_edit_" + goodsDataList[z].vo_priceId).change(function () {
                            operateShoppingCart(3, this.id.substring(9));
                        });
                        //商品只有一个规格时，直接显示加减号
                        if (goodsDataList[z].vo_countGoodsPrice == 1) {
                            document.getElementById("goodsId_" + goodsDataList[z].goodsId).style.display = "none";
                            if (goodsDataList[z].vo_shoppingCartNum == 0) {
                                //购物车中数量为0，只显示加号
                                document.getElementById("one_add_" + goodsDataList[z].vo_priceId).style.display = "block";
                            } else {
                                document.getElementById("one_sub_" + goodsDataList[z].vo_priceId).style.display = "block";
                                document.getElementById("one_edit_" + goodsDataList[z].vo_priceId).style.display = "block";
                                document.getElementById("one_add_" + goodsDataList[z].vo_priceId).style.display = "block";
                            }
                        }
                    }

                } else {
                    var nothing = '<div class="weui-loadmore weui-loadmore_line hide" id="noRec"> <span class="weui-loadmore__tips">暂无数据</span> </div>';
                    $goodsList.html(nothing);
                    $cloading.hide();
                }
            });
        }
    };
    getArticle();
    $(window).scroll(function () {
        //滚动高度 + 窗口高度 + (底部导航高度 + 版权块高度) >= 文档高度，注意：文档高度不包括fixed定位的元素（分类导航、底部导航）
        if ($(document).scrollTop() + $(window).height() + (50 + 50) >= $(document).height()) {
            goodsList.getMore(false); //获取数据
        }
    });
    goodsList.getMore(true);
    function getArticle() {
        var url = apiUrl + "/front/article/article/getArticleByPage";
        $.ajax({
            url: url,
            data: "pageNo=1 &pageSize=2",
            type: 'GET',
            crossDomain: true,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function (msg) {
            res = msg.res;
            if (res === 1) {
                msg = msg.obj;
                if (msg.dataList.length !== 0) {
                    var k = msg.dataList.shift();
                    var html = template('article_list_tp', msg);
                    $("#article_list").html(html);
                }

            }
        });
    }

    getAd();
    function getAd() {
        var url = apiUrl + "/front/ad/ad/getAdByPage";
        $.ajax({
            url: url,
            data: "pageNo=1 &pageSize=5",
            type: 'GET',
            crossDomain: true,
            dataType: "json"
        }).done(function (msg) {
            res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                var listDom = '';
                for (var i = 0; i < msg.dataList.length; i++) {
                    if (msg.dataList[i].image.length > 0) {
                        // msg.dataList[i].image = apiUrlPic + msg.dataList[i].image;
                        listDom += '<li><a class="pic" href="' + msg.dataList[i].url + '"><img src="' + apiUrlPic + msg.dataList[i].image + '"></a></li>'
                    }
                }
                //var html = template('ad_list_tpl', msg);

                $("#ad_list").html(listDom);
                TouchSlide({
                    slideCell: "#slideBox",
                    titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                    mainCell: ".bd ul",
                    effect: "leftLoop",
                    autoPage: true,//自动分页
                    autoPlay: true,//自动播放
                    interTime: 5000
                });
                var hdWidth = $("#slideBox .hd").width();
                $("#slideBox .hd").css("margin-left",-0.5*hdWidth);
            }
        });
    }

    getMessage();
    function getMessage() {
        var url = apiUrl + "/front/message/message/getMessageLevel";
        $.ajax({
            url: url,
            data: "",
            type: 'GET',
            crossDomain: true,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                //  msg = msg.obj;
                var html = template('msg_list_tpl', msg);
                $("#msg_list").html(html);
                var num = $('#msg_list').find('li').length;
                if (num > 1) {
                    var time = setInterval(function () {
                        timer(".notice_active")
                    }, 3500);
                    $('.notice_active').mousemove(function () {
                        clearInterval(time);
                    }).mouseout(function () {
                        time = setInterval('timer(".notice_active")', 3500);
                    });
                }
                function timer(opj) {
                    $(opj).find('ul').animate({
                        marginTop: "-1.5rem"
                    }, 500, function () {
                        $(this).css({marginTop: "0rem"}).find("li:first").appendTo(this);
                    })
                }
                $("#msg_list").on("click", ".send-modal", function () {
                    var _url = $(this).attr("url");
                    var _userMsgId = $(this).attr("userMsgId");
                    var _id=$(this).attr("id");
                    if(_url.length > 0){
                        url = _url;
                    } else {
                        url = "/page/stationMessageInfo.html?id="+ _id + "&userMessageId=" + _userMsgId;
                    }
                    window.location.href = url;
                });

            }
        });
    }

//商品分类列表

    $('.weui-flex__item[data-type]').on('click', function () {
        var id = $(this).attr('data-type');
        window.location.href = "/page/productList.html?categoryId=" + id;

    });
    /*{
     "categoryId": 14,
     "parentId": 0,
     "categoryName": "厨具",
     "image": "/pic/dydz/user/201704/1492051347878.png",
     "state": 1,
     "simpleDescribe": "",
     "recommend": 1,
     "createTime": "2017-04-08 17:07:32",
     "updateTime": "2017-04-13 12:02:47",
     "adminId": 2
     }
     *
     *
     (function () {
     var url = apiUrl + "/front/productCategory/productCategory/getHomePageCategory"; //数据api
     var dom = $('.weui-flex__item[data-type]');
     $.ajax({
     url: url,
     data: "pageNo=0&pageSize=9&recommend=1",
     type: 'GET',
     xhrFields: {
     withCredentials: true
     },
     crossDomain: true,
     dataType: "json",
     success: function (resp) {
     if (resp.res === 1) {
     var dataList = resp.obj.dataList;
     for (var k = 0, len = dataList.length; k < len; k++) {
     var item = '<div><a href="/page/productList.html?categoryId='+dataList[k].categoryId+'"><span class="dataSpan">' + dataList[k].categoryName + '</span><img alt="' + dataList[k].categoryName + '" src="' + apiUrlPic + dataList[k].image + '"></a></div>';
     $(dom[k]).html(item)
     }
     }
     else {
     var _LoadingHtml = '<div class="page__bd" id="loading"><div class="weui-loadmore"><i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载商品分类..</span></div></div>';
     $('.datalist').html(_LoadingHtml)
     }
     },
     error: function () {

     }
     });

     })();*/


});
