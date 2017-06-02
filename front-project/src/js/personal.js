define(['jquery', "components", "common", "template", "weui"], function (jquery, components, common, template, weui) {
    components.addActiveClass(3);
    getUserInfo();
    $("#index-menu li").eq(2).addClass("active");
    var $orderList = $("#order-box");

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

    // $("#logout").click(function () {
    //     var url = apiUrl + "/front/user/user/logout";
    //     components.getMsg(url, null, "post").done(function (msg) {
    //         var res = msg.res;
    //         if (res == 1) {
    //             window.location.href = '/index.html';
    //         }
    //     });
    // });


});
