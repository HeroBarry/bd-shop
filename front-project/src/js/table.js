define(['jquery', "template", "paginator", "components"], function(jquery, template, paginator, components) {
    function getData(pageNo) {
        $("#cloading").removeClass("hidden");
        var data = {
            pageNo: pageNo,
            pageSize: "10"
        };
        var url = listUrl;
        components.getMsg(url, data, "get").done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                for (var i = 0; i < msg.dataList.length; i++) {
                    msg.dataList[i].matchTime = components.formatDate(msg.dataList[i].matchTime);
                }
                for (var j = 0; j < msg.dataList.length; j++) {
                    msg.dataList[j].createTime = components.formatDate(msg.dataList[j].createTime);
                }
                render(msg);
                var options = {
                    bootstrapMajorVersion: 3, //版本
                    currentPage: 1, //当前页数
                    totalPages: 1, //总页数
                    itemTexts: function(type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "末页";
                            case "page":
                                return page;
                        }
                    }, //点击事件，用于通过Ajax来刷新整个list列表
                    onPageClicked: function(event, originalEvent, type, page) {
                        $("#cloading").removeClass("hidden");
                        data.pageNo = page;
                        components.getMsg(url, data, "get").done(function(msg) {
                            render(msg.obj);
                        });
                    }
                };
                options.totalPages = msg.pages;
                $(".page-sum").html('当前页面总数：<span class="text-333">' + msg.pages + '</span> 当前个数：<span class="text-333">' + msg.total + '</span>');
                $("#cloading").addClass("hidden");
                $('#pagination').bootstrapPaginator(options);
                $("#pagination li").removeClass("active").eq(data.pageNo - 1).addClass("active");
                if (options.totalPages == 1) {
                    $("#pagination").hide();
                } else {
                    $("#pagination").show();
                }
            } else {
                document.getElementById('table-list-tpl').innerHTML = "没有数据";
                $("#cloading").addClass("hidden");
                $(".page-sum").html('');
            }
        });
    }

    function render(msg) {
        var html = template('table-list-tpl', msg);
        document.getElementById('table-list-content').innerHTML = html;
    }

    getData(1);
});
