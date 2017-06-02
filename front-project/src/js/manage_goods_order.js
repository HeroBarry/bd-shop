define(['jquery', "template","components", "bootstrap", "jqueryValidate","paginator","manageCommon"], function(jquery, template,components, bootstrap, jqueryValidate,paginator,manageCommon) {
    var searchData="";//全局变量，保存搜索条件，点击搜索时赋值
    var selectIdListData=new Object();//保存选中了哪些条目
        getModules();
        function getModules() {
            var flag1 = false;
            var flag2 = false;
            var flag3 = false;
            var flag4 = false;
            var flag5 = false;
            var flag6 = false;
            //$.ajax({
            //    url: apiUrl + "/admin/module/module/queryModules",
            //    type: 'GET',
            //    xhrFields: {
            //        withCredentials: true
            //    },
            //    crossDomain: true,
            //}).done(function (msg) {
            components.getMsg(apiUrl + "/admin/module/module/queryModules").done(function (msg) {
                if (msg.res == 1) {
                    var objList = msg.obj;
                    for (var i = 0; i < objList.length; i++) {
                        var module = objList[i];
                        var id = module.moduleId;
                        var pid = module.parentId;
                        if (id == 7) {
                            $("#goodsList").css("display", "block");
                            flag1 = true;
                        }
                        if (id == 8) {
                            $("#goodsOrder").css("display", "block");
                            flag1 = true;
                        }
                        if (id == 9) {
                            $("#goodsCatory").css("display", "block");
                            flag1 = true;
                        }
                        if (id == 10) {
                            $("#memberManage").css("display", "block");
                            flag2 = true;
                        }
                        if (id == 11) {
                            $("#messageManage").css("display", "block");
                            flag2 = true;
                        }
                        if (id == 12) {
                            $("#articleManage").css("display", "block");
                            flag3 = true;
                        }
                        if (id == 13) {
                            $("#adManage").css("display", "block");
                            flag4 = true;
                        }
                        if (id == 14) {
                            $("#goodsReport").css("display", "block");
                            flag5 = true;
                        }
                        if (id == 15) {
                            $("#orderReport").css("display", "block");
                            flag5 = true;
                        }
                        if (id == 16) {
                            $("#adminManage").css("display", "block");
                            flag6 = true;
                        }
                        if (id == 17) {
                            $("#roleManage").css("display", "block");
                            flag6 = true;
                        }
                        if (flag1) {
                            $("#div1").css("display", "block");
                        }
                        if (flag2) {
                            $("#div2").css("display", "block");
                        }
                        if (flag3) {
                            $("#div3").css("display", "block");
                        }
                        if (flag4) {
                            $("#div4").css("display", "block");
                        }
                        if (flag5) {
                            $("#div5").css("display", "block");
                        }
                        if (flag6) {
                            $("#div6").css("display", "block");
                        }
                        if (flag1 || flag2 || flag3 && flag4 || flag5 || flag6) {
                            $('.container-wrap').css('display', 'block')
                        }
                    }
                }
                //location.href = "/page/manage_login.html";
            });
        }
        /* listUrl = apiUrl + "/admin/order/orderAdmin/getOrderByPage";
         require(['./table']);*/
        listUrl = apiUrl + "/admin/order/orderAdmin/getOrderPageByOrderAdminSearchVO";
        getData(1);
        $('#submit-btn-query').on('click', function(){
            getData(1);
        });
        require(['./table']);
        var _orderId;
        var _orderNumber;
        var _logisticsState;
        var submitUrl = "";
        var atr="";
    $("#exportdata").click(function () {
        var exportSearchData=searchData;
        if($("#checkAll").is(':checked')==true){
            //选中全选
             exportSearchData=searchData+"&checkAll="+1;
        }else{
            //没有全选
            //exportSearchData=searchData+"&checkAll="+1;
           // alert(eal)
		   if(selectIdListData==undefined || JSON.stringify(selectIdListData)=='{}'){
			   alert("请选择导出范围！");
			   return;
		   }
            exportSearchData=searchData+"&selectIdListData="+ JSON.stringify(selectIdListData)+"";//将对象序列化成JSON字符串  ;
        }
        window.location=apiUrl + "/admin/order/orderAdmin/exportPageByOrderAdminSearchVO?"+exportSearchData;

    });

    $("#table-list-content").on("click", ".orderIdCheck", function () {
        var value =$(this).attr("value");
        if($("#check_"+value).is(':checked')==true){
            //选中
            selectIdListData[value]=value;
        }else{
            delete selectIdListData[value];
        }
    });

        $("#table-list-content").on("click", ".send-modal", function () {
            _orderId =$(this).attr("oid");
            _orderNumber =$(this).attr("oNum");
            _logisticsState =$(this).attr("logisticsState");
            $("#orderId").val(_orderId);

            $('#send-modal').modal({
                show: true
            });
            if(_logisticsState == 1){
                submitUrl = apiUrl + "/admin/order/orderAdmin/toSend";
                $("#title_name").text("配送信息");
                $("#sub").text("马上配送");
            } else if(_logisticsState == 2){
                submitUrl = apiUrl + "/admin/order/orderAdmin/receiveGoods";
                $("#title_name").text("确认已收货");
                $("#sub").val("确认收货");
            } else if(_logisticsState == 3){
                submitUrl = apiUrl + "/admin/order/orderAdmin/receiveMoney";
                //$("#title_name").text("确认已收货");
                $("#sub").val("确认");
            }
            getOrderInfo(_orderNumber);
        });

        function getOrderInfo(id) {
            var url = apiUrl + "/admin/order/orderAdmin/getOrderByOrderNumber?orderNumber=" + id;
            components.getMsg(url, "post").done(function (msg) {
                var res = msg.res;
                if (res == 1) {
                    if(_logisticsState != 3){
                        $("#orderinfo").css("display","none");
                        var html = template("logisticsInfo-tpl", msg);
                        document.querySelector("#logisticsInfo").innerHTML = html;
                        var div = template("table-list-tpl2", msg);
                        document.querySelector("#table-list-content2").innerHTML = div;
                    } else {
                        $("#info").css("display","none");
                        var html = template("orderinfo-tpl", msg);
                        document.querySelector("#orderinfo").innerHTML = html;
                    }
                } else {
                    components.Alert("", "出错了！");
                }
            });
        }

        $("#table-list-content").on("click", ".surplus-modal", function () {
            _orderId =$(this).attr("oid");
            _orderNumber =$(this).attr("oNum");
            _logisticsState =$(this).attr("logisticsState");
            submitUrl  = apiUrl + "/admin/order/orderAdmin/receiveMoney";
            $('#surplus-modal').modal({
                show: true
            });
            getsur(_orderNumber);
        });
        function getsur(id) {
            var url = apiUrl + "/admin/order/orderAdmin/getOrderByOrderNumber?orderNumber=" + id;
            components.getMsg(url, "post").done(function (msg) {
                var res = msg.res;
                if (res == 1) {
                    var html = template("orderinfo-tpl", msg);
                    document.querySelector("#orderinfo").innerHTML = html;
                } else {
                    components.Alert("", "出错了！");
                }
            });
        }

        //上传LOGO
        function upPic() {
            $("#orderinfo").on("change", "#pic-upload", function() {
                var formData = new FormData(); //构造空对象，下面用append 方法赋值。
                formData.append("param", "");
                formData.append("file", $("#pic-upload")[0].files[0]);
                var url = apiUrl + "/upload/uploadimg/dydz/user";
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: "json",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(msg) {
                        var picListHtml = '<li picUrl="' + msg.result + '"class="apply-book"> <img  src=" ' + apiUrlPic + msg.result + '"> <a docUrl="' + msg.result + '" href="javascript:void(0)" class="text-basic del-doc iconfont icon-close"></a></li>';
                        $("#pic-document-list").append(picListHtml);
                    }
                });
            });
        }

        upPic();
        delpic();
        function delpic() {
            $("#orderinfo").on("click", ".del-doc", function() {
                var $this = $(this);
                var url = apiUrl + "/upload/removeFile";
                var docUrl = $this.attr("picUrl");
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: "json",
                    data: "preImg=" + docUrl,
                    success: function(msg) {
                        if (msg.res == 1) {
                            $this.parents("li").remove();
                        }
                    }
                });
            });
        }

        //if(_logisticsState == 3){
        //    validate2();
        //} else {
        validate();
        //}

        $("#btn_cancel").click(function () {
            $("#send-modal").modal("hide");
        });

        function validate() {
            $("#rePw").validate({
                rules: {
                    //logisticsNumber: {
                    //    required: true
                    //}
                },
                messages: {
                    //logisticsNumber: {
                    //    required: "请输入物流单号"
                    //}
                },
                submitHandler: function (form) {
                    //var _logisticsNumber = $("#logNumber").val();
                    $("#pic-document-list > li").each(function() {
                        atr += $(this).attr("picUrl") + ",";
                    });
                    var reg=/,$/gi;
                    atr=atr.replace(reg,"");
                    //var data = {
                    //    //logisticsNumber: _logisticsNumber,
                    //    "orderId": _orderId,
                    //    "imageUrl":atr
                    //};
                    //data = data + "&image="+atr;
                    var data = $("#rePw").serialize();
                    if(_logisticsState == 3){
                        data += "&imageUrl="+atr;
                    }

                    components.getMsg(submitUrl, data, "post").done(function (msg) {
                        if (msg.res == 1) {
                            components.Alert("success", "发货成功");
                            $("#send-modal").modal("hide");
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        } else {
                            $("#send-modal").modal("hide");
                            components.Alert("", "发货失败");
                        }
                    });
                }
            });
        }

        function validate2() {
            $("#rePw2").validate({
                rules: {
                    //logisticsNumber: {
                    //    required: true
                    //}
                },
                messages: {
                    //logisticsNumber: {
                    //    required: "请输入物流单号"
                    //}
                },
                submitHandler: function (form) {
                    //var _logisticsNumber = $("#loguNmber").val();
                    $("#pic-document-list > li").each(function() {
                        atr += $(this).attr("picUrl") + ",";
                    });
                    var reg=/,$/gi;
                    atr=atr.replace(reg,"");
                    var data = {
                        //logisticsNumber: _logisticsNumber,
                        orderId: _orderId
                    };
                    data = data + "&image="+atr;
                    components.getMsg(submitUrl, data, "post").done(function (msg) {
                        if (msg.res == 1) {
                            components.Alert("success", "发货成功");
                            $("#send-modal").modal("hide");
                            setTimeout(function () {
                                location.reload();
                            }, 2000);
                        } else {
                            $("#send-modal").modal("hide");
                            components.Alert("", "发货失败");
                        }
                    });
                }
            });
        }


        //使用新的拉取数据方法，因为有搜索条件
        function getData(pageNo) {
            $("#cloading").removeClass("hidden");
            var pageSize=10;
            var data = $("#form-box").serialize();
            data=data+"&pageSize="+pageSize;
            // var isMarketable= $("#invoiceTag").val();
            data=data+"&invoiceTag="+$("#invoiceTag").val();
            data=data+"&paymentId="+$("#paymentId").val();
            data=data+"&payState="+$("#payState").val();
            data=data+"&logisticsState="+$("#logisticsState").val();
            searchData=data;
            selectIdListData=new Object();//保存选中了哪些条目
            data=data+"&pageNo="+pageNo;
            var url = listUrl;
            components.getMsg(url, data, "post").done(function(msg) {
                var res = msg.res;
                if (res == 1) {
                    msg = msg.obj;
                    /*  for (var i = 0; i < msg.dataList.length; i++) {
                     msg.dataList[i].matchTime = components.formatDate(msg.dataList[i].matchTime);
                     }
                     for (var j = 0; j < msg.dataList.length; j++) {
                     msg.dataList[j].createTime = components.formatDate(msg.dataList[j].createTime);
                     } */
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
                            var data = searchData;
                            data=data+"&pageNo="+page;
                            selectIdListData=new Object();//保存选中了哪些条目
                            components.getMsg(url, data, "post").done(function(msg) {
                                render(msg.obj);
                            });
                        }
                    };
                    options.totalPages = msg.pages;
                    $(".page-sum").html('当前页面总数：<span class="text-333">' + msg.pages + '</span> 当前总个数：<span class="text-333">' + msg.total + '</span>');
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
                    $("#pagination").hide();
                    document.getElementById('table-list-content').innerHTML = "没有数据";
                }
            });
        }

        function render(msg) {
            var html = template('table-list-tpl', msg);
            document.getElementById('table-list-content').innerHTML = html;
        }
        getData(1);
    });