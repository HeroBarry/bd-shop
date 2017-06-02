define(['zepto', "components", "common", "weui", "touch", "template"], function(zepto, components, common, weui, touch, template) {
    getData();
    function getData() {
        components.getMsg(apiUrl + "/front/receive/receive/getReceiveByPage").done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('address-list-tpl', msg);
                document.getElementById('address-list').innerHTML = html;
                addEffect();
            }else{
              document.getElementById('address-list').innerHTML = '<div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips">暂无数据</span></div>';
            }
        });
    }

    function delAddress() {
        $("#address-list").on("click",".delete",function(e) {
            var rid = $(this).attr("rid");
                $.confirm({
                    text: '确定要删除此地址吗？',
                    onOK: function() {
                        components.getMsg(apiUrl + "/front/receive/receive/delReceiveById?receiveId=" + rid).done(function(msg) {
                            var res = msg.res;
                            if (res == 1) {
                                $.toast("删除成功", "text");
                                getData();
                            }
                        });
                    },
                });
        });
    }
    function addEffect(){
        $('#address-list').on("swipeLeft","li", function() {
            var $this = $(this);
            $this.find(".edit").addClass("hide");
            $this.find(".delete").removeClass("hide");
            event.preventDefault();
        });
        $('#address-list').on("swipeRight","li", function() {
            var $this = $(this);
            $this.find(".edit").removeClass("hide");
            $this.find(".delete").addClass("hide");
            event.preventDefault();
        });
        delAddress();
    }

    $('#edit').click(function(){
       $('.addres').css('display','none');
       $('.delete').css('display','none');
       $('#address-list').on('click','li',function(){
           var lid = $(this).attr('rid');
           window.location.href="/page/add_address.html?id="+lid;
       })
   })

});
