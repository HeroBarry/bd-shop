define(["jquery", "components", "bootstrap", "manageCommon", "jqueryValidate","highcharts"], function (jquery, components, bootstrap, manageCommon, jqueryValidate,highcharts) {
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

    listUrl = apiUrl + "/admin/order/orderAdmin/getOrderByPage";
    require(['./table']);
    var _orderId;
    $("#table-list-content").on("click", ".send-modal", function () {
        _orderId =$(this).attr("oid");
        $('#send-modal').modal({
            show: true
        });
    });
    $("#table-list-content").on("click", ".surplus-modal", function () {
        var str = $(this).attr("orid");
        $('#surplus-modal').modal({
            show: true
        });
        getsur(str);
    });
    function getsur(str) {
        var url = apiUrl + "/admin/order/orderAdmin/getUnpaidMoney?orderId=" + str;
        components.getMsg(url).done(function (msg) {
            if (msg.res == 1) {
                sendState = msg.obj.sendState;
                $("#sur").text(msg.obj.unpaidAmount / 100);
                $("#all").text(msg.obj.totalAmount / 100);
                $("#paid").text(msg.obj.paidAmount / 100);
                $("#unpaid").text(msg.obj.unpaidAmount / 100);
            }
        });
    }

    validate();
    function validate() {
        $("#rePw").validate({
            rules: {
                logisticsNumber: {
                    required: true
                }
            },
            messages: {
                logisticsNumber: {
                    required: "请输入物流单号"
                }
            },
            submitHandler: function (form) {
                var _logisticsNumber = $("#logNumber").val();
                var data = {
                    logisticsNumber: _logisticsNumber,
                    orderId: _orderId
                };
                components.getMsg(apiUrl + "/admin/order/orderAdmin/toSend", data, "post").done(function (msg) {
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
    getOrder();
    function  getOrder(){
        var url = apiUrl + "/admin/order/orderAdmin/getOrderByPaystate";
        components.getMsg(url).done(function (msg) {
            if (msg.res == 1) {
                var dataList = msg.obj;
                var title="订单金额比例（元）"
                chart(dataList,title);
            }
        });
    }
    function chart(dataArray,title){
        Highcharts.setOptions({
            colors: [ '#058DC7','red']
        });
        $('#container').highcharts({
            chart: {
                type: 'pie'
            },
            credits : {
                enabled : true,
                href : "",
                text : ''
            },
            title: {
                text: title,
                align: 'left',
                floating: 'true',
                verticalAlign: 'top',
                x:0,
                y:100
            },
            tooltip: {
                //鼠标停留区域特殊显示效果
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>:'+ changeTwoDecimal(this.percentage) +' %   共'+ this.point.y/100 +'元 ';
                }
            },
            plotOptions: {
                pie: {
                    size:150,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: 20,
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            //当数子不是整数，百分比显示位数有十多位，进行保留两位小数处理
                            return  '<b>'+ this.point.name +'</b>:'+ changeTwoDecimal(this.percentage) +' %';
                        }
                    } ,
                    showInLegend: false
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 80,
                borderWidth: 0,
                labelFormatter: function() {
                    return this.name+'&nbsp';
                },
                useHTML:true
            },
            series: [{
                type : 'pie',
                data: dataArray
            }]
        });
    }
    getCount();
    function getCount(){
        var url = apiUrl + "/admin/order/orderAdmin/getCountByPaystate";
        components.getMsg(url).done(function (msg) {
            if (msg.res == 1) {
                var dataList = msg.obj;
                var title="订单数量比例（个）";
                chart2(dataList,title);
            }
        });
    }
    function chart2(dataArray,title){
        Highcharts.setOptions({
            colors: [ '#058DC7','red']
        });
        $('#container2').highcharts({
            chart: {
                type: 'pie'
            },
            credits : {
                enabled : true,
                href : "",
                text : ''
            },
            title: {
                text: title,
                align: 'left',
                floating: 'true',
                verticalAlign: 'top',
                x:0,
                y:100
            },
            tooltip: {
                //鼠标停留区域特殊显示效果
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>:'+ changeTwoDecimal(this.percentage) +' %   共'+ this.point.y +'个 ';
                }
            },
            plotOptions: {
                pie: {
                    size:150,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: 20,
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            //当数子不是整数，百分比显示位数有十多位，进行保留两位小数处理
                            return  '<b>'+ this.point.name +'</b>:'+ changeTwoDecimal(this.percentage) +' %';
                        }
                    } ,
                    showInLegend: false
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: 0,
                y: 80,
                borderWidth: 0,
                labelFormatter: function() {
                    return this.name+'&nbsp';
                },
                useHTML:true
            },
            series: [{
                type : 'pie',
                data: dataArray
            }]
        });
    }
    function changeTwoDecimal(x){
        var f_x = parseFloat(x);
        if (isNaN(f_x)){
            return false;
        }
        var f_x = Math.round(x*100)/100;
        return f_x;
    }
});