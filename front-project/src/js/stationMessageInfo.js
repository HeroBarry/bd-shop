define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
    addActiveClass();
    var messageId = components.GetQueryString("id");
    var userMessageId = components.GetQueryString("userMessageId");
    getData(components.GetQueryString("id"));
    function getData(id) {
        var url = apiUrl + "/front/message/message/getMessageAndRead?messageId=" + messageId + "&userMessageId=" + userMessageId;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('msg-info-tpl', msg);
                $('#msg-info').html(html);
            }
        });
    }
    function addActiveClass(){
        $(".weui-tabbar a").removeClass("weui-bar__item_on");
        $(".weui-tabbar a:eq(2)").addClass("weui-bar__item_on");
    }
});
