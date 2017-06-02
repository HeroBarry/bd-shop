define(['zepto', "components", "common", "weui", "touch", "template"], function(zepto, components, common, weui, touch, template) {
    getData();
    function getData() {
        components.getMsg(apiUrl + "/front/receive/receive/getReceiveByPage").done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('address-list-tpl', msg);
                document.getElementById('address-list').innerHTML = html;
                setDefultAddress();
            }else{
              document.getElementById('address-list').innerHTML = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips">暂无数据</span></div>';
            }
        });
    }

    function setDefultAddress() {
        $("#address-list li").click(function(e) {
            var rid = $(this).attr("rid");
            components.getMsg(apiUrl + "/front/receive/receive/setDefaultReceive", "receiveId=" + rid, "post").done(function(msg) {
                var res = msg.res;
                if (res == 1) {
                    window.location.href="/page/order_submit.html";
                    //location.reload();
                    //location.href=document.referrer;
                } else {
                    console.log("false");
                }
            }); 
        });
    }


});
