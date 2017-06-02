define(['jquery',"components", "timepicker","bootstrap","common", "weui", "", "template"], function(jquery, components,timepicker,bootstrap, common, weui,template) {
    var orderId = components.GetQueryString("id");
    var initDate=GetDateStr(1);
    $("#datetimepicker").datetimepicker({
        format: 'yyyy-mm-dd',      /*此属性是显示顺序，还有显示顺序是mm-dd-yyyy*/
        autoclose:true,//自动关闭
        minView:2,//最精准的时间选择为日期0-分 1-时 2-日 3-月
        weekStart:0,
        startDate: initDate
    }).on('changeDate',gotoDate);
    function  gotoDate(date){
        var  sendTime= date.date.getFullYear().toString() + "-"+ (date.date.getMonth()+1).toString()+ "-"+ date.date.getDate().toString()
        saveSendTime(orderId,sendTime);
    }
    function saveSendTime(id,date) {
        //               data ="&orderId=" + id +"&sendTime"+date;
        //               url = apiUrl + "";
        //               components.getMsg(url, data, "post").done(function(msg) {
        //                   var res = msg.res;
        //                   if (res == 1) {
        //                       $.toast(text, "text", function() {
        history.go(-1);
        //                      });
        //                   }
        //               });
    }

    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }

});
