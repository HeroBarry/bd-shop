
define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
    //var apiUrl = "http://localhost:8080/";
    var $articleList = $("#article-list");
    var $noRec = $('#noRec');
    var $cloading = $('#cloading');
    var articleList = {
        page: 0, //触发获取数据的数次(+1等于页码)
        size: 15, //每次触发取的记录条数
        isLoading: false, //列表是否加载中，避免重复触底加载
        url: apiUrl + "/front/article/article/getArticleByPage", //数据api
        getMore: function(first) {
            if (articleList.isLoading) //取数过程中，先停止重复取数
                return;

            if (first) {
                articleList.page = 1;
                $('#noRec').hide();
                $articleList.html('');
            } else {
                articleList.page += 1;
            }
            $cloading.show(); //显示加载框
            articleList.isLoading = true;
            setTimeout(articleList.d(articleList.page, articleList.size), 1000); //模拟延迟取数据
        },

        //异步获取商品列表
        d: function(page, size) {
            $.ajax({
                url: articleList.url,
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
                    // for (var i = 0; i < msg.dataList.length; i++) {
                        // if (msg.dataList[i].image !== "") {
                            // msg.dataList[i].image = msg.dataList[i].image.split(",");
                            // for (var j = 0; j < msg.dataList[i].image.length; j++) {
                            //     msg.dataList[i].image[j] = apiUrl + msg.dataList[i].image[j];
                            // }
                        // }
                    //     msg.dataList[i].price = msg.dataList[i].price / 100;
                    // }
                    newsJson = msg.dataList;
                    var html = template('product-list-tpl', msg);
                    if (newsJson && newsJson.length > 0) {
                        articleList.isLoading = false;
                        $noRec.hide();
                    } else {
                        articleList.isLoading = true;
                        $noRec.show();
                    }
                    if (articleList.page > 1) {
                        $articleList.append(html);
                    } else {
                        $articleList.html(html);
                    }
                    // if(newsJson.length < 10){
                    //     $noRec.show();
                    //     $cloading.hide(); //隐藏加载框
                    // }
                    $cloading.hide(); //隐藏加载框
                } else {
                    $noRec.show();
                    $cloading.hide();
                }
            });
        }
    };
    $(window).scroll(function() {
        var num1 = $(document).scrollTop() + $(window).height() + (50 + 50);
        var num2 = $(document).height();
        //滚动高度 + 窗口高度 + (底部导航高度 + 版权块高度) >= 文档高度，注意：文档高度不包括fixed定位的元素（分类导航、底部导航）
        if (num1 >= num2) {
            articleList.getMore(false); //获取数据
        }
    });

    // $cloading.click(function(){
    //     articleList.getMore(false);
    // });
    articleList.getMore(true);



});
