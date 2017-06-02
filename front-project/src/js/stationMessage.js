define(['jquery', "components", "common", "template"], function (jquery, components, common, template) {
        addActiveClass();

        var noReadMsgCount;
        var readedMsgCount;
        var state = 2;
        getReadedMsgCount();
        function getReadedMsgCount() {
            components.getMsg(apiUrl + "/front/message/message/getMessageCount").done(function (msg) {
                var res = msg.res;
                if (res == 1) {
                    //msg = msg.obj;
                    var temp = msg.list;
                    readedMsgCount = msg.list[0] > 0 ? msg.list[0] : 0;
                    noReadMsgCount = msg.list[1] > 0 ? msg.list[1] : 0;
                }
                $("#noReadNarBtn").text("未读消息（" + noReadMsgCount + "）");
                $("#readNarBtn").text("已读消息（" + readedMsgCount + "）");
            });
        }

        var $msgList = $("#msg-list");
        var $noRec = $('#noRec');
        var $cloading = $('#cloading');
        var msgList = {
            page: 0, //触发获取数据的数次(+1等于页码)
            size: 15, //每次触发取的记录条数
            isLoading: false, //列表是否加载中，避免重复触底加载
            url: apiUrl + "/front/message/message/getMessageByPage", //数据api
            getMore: function (first) {
                if (msgList.isLoading) //取数过程中，先停止重复取数
                    return;
                if (first) {
                    msgList.page = 1;
                    $('#noRec').hide();
                    $msgList.html('');
                } else {
                    msgList.page += 1;
                }
                $cloading.show(); //显示加载框
                msgList.isLoading = true;
                setTimeout(msgList.d(msgList.page, msgList.size), 1000); //模拟延迟取数据
            },

            //异步获取文章列表
            d: function (page, size) {
                $.ajax({
                    url: msgList.url,
                    data: "pageNo=" + page + "&pageSize=" + size + "&state=" + state,
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    dataType: "json",
                }).done(function (msg) {
                    var res = msg.res;
                    if (res !== 0) {
                        var newsJson = msg.obj.dataList;
                        msg = msg.obj;
                        newsJson = msg.dataList;
                        var html = template('msg-list-tpl', msg);
                        if (newsJson && newsJson.length > 0) {
                            msgList.isLoading = false;
                            $noRec.hide();
                        } else {
                            msgList.isLoading = true;
                            $noRec.show();
                        }
                        if (msgList.page > 1) {
                            $msgList.append(html);
                        } else {
                            $msgList.html(html);
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

        $(window).scroll(function () {
            var num1 = $(document).scrollTop() + $(window).height() + (50 + 50);
            var num2 = $(document).height();
            //滚动高度 + 窗口高度 + (底部导航高度 + 版权块高度) >= 文档高度，注意：文档高度不包括fixed定位的元素（分类导航、底部导航）
            if (num1 >= num2) {
                msgList.getMore(false); //获取数据
            }
        });

// $cloading.click(function(){
//     msgList.getMore(false);
// });

        var flag = false;
        if (!flag) {
            msgList.getMore(false);
            flag = true;
        }

        $("#noReadNar").click(function () {
            $(".weui-navbar a").siblings('.weui-tab__bd-item--active').removeClass('weui-tab__bd-item--active');
            $(this).addClass('weui-tab__bd-item--active');
            state = 2;
            msgList.isLoading = false;
            msgList.getMore(true);
        });
        //
        $("#readedNar").click(function () {
            $(".weui-navbar a").siblings('.weui-tab__bd-item--active').removeClass('weui-tab__bd-item--active');
            $(this).addClass('weui-tab__bd-item--active');
            //$(this).siblings('.weui-bar__item--on').removeClass('weui-bar__item--on');
            state = 1;
            msgList.isLoading = false;
            msgList.getMore(true);
        });

        function addActiveClass() {
            $(".weui-tabbar a").removeClass("weui-bar__item_on");
            $(".weui-tabbar a:eq(2)").addClass("weui-bar__item_on");
        }

        $("#msg-list").on("click", ".send-modal", function () {
            var _url = $(this).attr("url");
            var _userMsgId = $(this).attr("userMsgId");
            var _id = $(this).attr("id");
            if (_url.length > 0) {
                url = _url;
            } else {
                url = "/page/stationMessageInfo.html?id=" + _id + "&userMessageId=" + _userMsgId;
            }
            window.location.href = url;
        });
    }
)
;
