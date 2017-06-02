define(["jquery", "bootstrap", "jqueryCookie"], function (jquery, bootstrap, jqueryCookie) {
    return {
        getMsg: function (url, param, type) { //ajax请求
            return $.ajax({
                url: url,
                data: param || {},
                type: type || 'post',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                dataType: "json",
            }).then(function (msg) {
                if (msg.res == 301) {
                    var href = location.href;
                    if (url.indexOf("admin") > -1) {
                        $.cookie("preHrefB", href, {
                            path: '/'
                        });
                        location.href = "/page/manage_login.html";
                    } else {
                        $.cookie("preHrefA", href, {
                            path: '/'
                        });
                        $.cookie("username", null, {
                            path: "/"
                        });
                        location.href = "/page/login.html";
                    }
                } else {
                    return msg;
                }
            }, function (err) {
                console.log(err.status);
            });
        },
        logout: function (url) { //安全注销
            $("#logout").bind("click", function () {
                $.ajax({
                    type: 'post',
                    url: url,
                    dataType: "json",
                    success: function (msg, textStatus) {
                        var res = msg.res;
                        if (res == 1) {
                            $.cookie("username", null, {
                                path: "/"
                            });
                            location.href = "/";
                        } else if (res == 301) {
                            location.href = skipLinkObj.loginUrl;
                        }
                    }
                });
            });
        },
        Alert: function (type, msg) { //提示框
            var $alert = $("#alert");
            if (type == "success") {
                $alert.removeClass("alert-warning").addClass("alert-success").text(msg);
            } else {
                $alert.removeClass("alert-success").addClass("alert-warning").text(msg);
            }
            $alert.fadeIn();
            setTimeout(function () {
                $alert.fadeOut();
            }, 1000);
        },
        GetQueryString: function (name) { //获取url参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        centerblock: function () {
            var maxHeight = 0;
            var boxTop = 0;

            function myBrowser() {
                var userAgent = navigator.userAgent;
                var isOpera = userAgent.indexOf("Opera") > -1;
                if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                    return "IE";
                }
            }


            var mb = myBrowser();
            if ("IE" == mb) {
                maxHeight = (document.body.offsetHeight) + "px";
                pwdBoxTop = ((document.body.offsetHeight) - $(".center-box").height() - 88) / 2 + "px";
            } else {
                maxHeight = (window.innerHeight) + "px";
                pwdBoxTop = ((window.innerHeight) - $(".center-box").height() - 88) / 2 + "px";
            }
            $("body").css("max-height", maxHeight);
            $(".center-box").css("margin-top", pwdBoxTop);
            $(".center-box").css("margin-bottom", pwdBoxTop);
        },
        formatDate: function (str) {
            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }

            if (str && str !== "") {
                str = str.replace(/-/g, "/");
                var date = new Date(str);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                year = checkTime(year);
                month = checkTime(month);
                day = checkTime(day);
                str = year + "-" + (month) + "-" + day;
                return str;
            }
        },
        addActiveClass: function (index) {
            var childrens = $("#footer_tabbar").children();
            childrens.each(function (index1, element1) {
                $(element1).removeClass("weui-bar__item_on");
                var imgAndp = $(element1).children();
                var str = imgAndp.attr('class');
                var test = new RegExp("-", "g");
                var result = str.match(test);
                if (result.length > 1) {
                    var k = result.indexOf('-lv');
                    var newCls = result.substring(0, k);
                    imgAndp.attr('class', newCls);
                }
                if (index == index1) {
                    //字体变色
                    $(element1).addClass("weui-bar__item_on");
                    var str = imgAndp.attr('class') + '-lv';
                    imgAndp.css({
                        'font-weight': 'normal',
                        'color': '#2CC27B'
                    });
                    $(imgAndp[0]).attr("class", str);
                }
            });
        }

    };
});
