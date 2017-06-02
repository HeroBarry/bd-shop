define(['jquery', "template", "components",  "jqueryValidate", "manageCommon"], function(jquery, template, components, validator, manageCommon) {
    var ltid= components.GetQueryString("id");
    var submitUrl = "";

    if (ltid) {
        submitUrl = apiUrl + "/admin/logistics/logisticsAdmin/editLogistics?logisticsId="+ltid;
        getData(ltid);
        $("#addState").text("编辑配送方式");
    } else {
        submitUrl = apiUrl + "/admin/logistics/logisticsAdmin/addLogistics";
        $("#addState").text("添加配送方式");
    }

    function getData(id) {
        var url = apiUrl + "/admin/logistics/logisticsAdmin/getLogisticsById?logisticsId=" + id;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
          }
        });
    }

    Validate();
   jQuery.validator.addMethod("num", function(value, element) {
        var num = /^\d+(\.\d{1,2})?$/g;
        return this.optional(element) || (num.test(value));
    }, "请填写非负数且最多保留小数点后两位");

    function Validate() {
        $("#form-box").validate({
            rules: {
                name: {
                    required: true
                },
                prices: {
                    required: true,
                    num: true
                },
                state: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "配送方式名称必填"
                },
                prices: {
                    required: "配送费用必填"
                },
                state: {
                    required: "状态请选择一个"
                }
            },
            submitHandler: function(form) {  
            var price = $("#price").val()*100;        
            var data = $("#form-box").serialize()+"&price="+price;
             
            components.getMsg(submitUrl, data, "post").done(function(msg){
                if (msg.res == 1) {
                    components.Alert("success", "修改成功");
                    setTimeout(function() {
                        window.history.go(-1);
                    }, 2000);
                }
            });
            }
        });
    }

});
