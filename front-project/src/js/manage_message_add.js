define(['jquery', "template", "components", "ZeroClipboard", "jqueryValidate", "ueditorConfig", "ueditorAll", "manageCommon"], function(jquery, template, components, ZeroClipboard, validator, ueditorConfig, UE, manageCommon) {
    getModules();
	    var list = new Array();
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
    
    var adid= components.GetQueryString("id");
    var submitUrl = "";
    var adminName = "";
    if (adid) {
        submitUrl = apiUrl + "/admin/message/messageAdmin/editMessage?messageId="+adid;
        $("#addState").text("编辑消息");
        getData(adid);
        /*$("#submit-btn").click(editMessage);*/
        getUserList();
    } else {
        submitUrl = apiUrl + "/admin/message/messageAdmin/addMessage";
        $("#addState").text("添加消息");
        getUserList();
    }
  

    // jQuery.validator.addMethod("num", function(value, element) {
    //     var num = /^(([1-9]+\d*)|(\d+(\.\d[1-9]))|(\d+(\.[1-9])))$/g;
    //     return this.optional(element) || (num.test(value));
    // }, "请填写非负正数且最多保留小数点后两位 ");

    $(".form-control").focus(function () {
        $(this).parent("td").parent("tr").find("a").html($(this).val().length);
    });
    $(".form-control").blur(function () {
        $(this).parent("td").parent("tr").find("a").html($(this).val().length);
    });
    ////选择推送人员
    //$(function(){
    //    $("#table-list-content").on("click", "li", function(){
    //        var  id=$(this).attr("userId");
    //        var  ids=new Array();
    //        var  phone=$(this).text();
    //        var user_show = $(".user_show");
    //        var lis = $(".user_show li");
    //        var exist = false;
    //        for(var i = 0; i < lis.length; i++){
    //            var a = lis[i];
    //            var cName = $(a).attr("userId");
    //            if(cName == id){
    //                exist = true;
    //            }
    //           ids[i] = cName;
    //        }
    //        if(exist){
    //            alert("您已添加过了");
    //        }else{
    //            var str = " <li style='display:block;' userId="+id+" class='inline-block text-ellipsis text-basic' >"+phone+"</li>";
    //            $(".user_show").append(str);
    //        }
    //    });
    //    $(".user_show").on("click", "li", function(){
    //        $(this).remove();
    //    })
    //    $("#submit-btn").click(function(){
    //            var ids = new Array();
    //            var lis = $(".user_show li");
    //            for(var i = 0; i < lis.length; i++){
    //                var a= lis[i];
    //                var cName = $(a).attr("userId");
    //                ids[i] = cName;
    //            }
    //        var userIds=new String();
    //            for (var i = 0; i < ids.length; i++) {
    //                userIds = userIds + ids[i] + ",";
    //            }
    //        if(adid) {
    //            submitUrl = submitUrl + "&userIds=" + userIds;
    //        }else{
    //            submitUrl = submitUrl+"?userIds="+ userIds;
    //        }
    //    });
    //});


    $("#s1").blur(getUserList);
    $("#s2").blur(getUserList);
    $("#s3").blur(getUserList);
    $("#s4").blur(getUserList);
    Validate();
    function Validate() {
        $("#form-box").validate({
            rules: {
                messageName: {
                    required: true,
                    maxlength: 20
                },
                description: {
                    required: true,
                    maxlength: 200
                },
                url: {
                    maxlength: 500
                }
            },
            messages: {
                messageName: {
                    required: "名称必填",
                    maxlength:"最多填写20个字符"
            },
                description: {
                    required: "内容必填",
                    maxlength:"最多填写200个字符"
                },
                url: {
                    maxlength:"最多填写500个字符"
                }
            },
            submitHandler: function(form) {
                var data = $("#form-box").serialize();
                components.getMsg(submitUrl, data, "post").done(function(msg){
                    console.log(msg);
                    if (msg.res == 1) {
                        components.Alert("success", "成功");
                        setTimeout(function() {
                            window.history.go(-1);
                        }, 2000);
                    }
                });
            }
        });
    }
    function getData(id) {
        var url = apiUrl + "/admin/message/messageAdmin/getMessageById?messageId=" + id;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                //var userIds=msg.obj.userIds;
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
                //getPushUserList(userIds)
            }
        });
    }
    function getPushUserList(userIds){
        var url = apiUrl + "/admin/message/messageAdmin/getMessageByUserIdsTest?userIds="+userIds;
        /*var url = apiUrl +"/admin/user/userAdmin/getUserByPage";*/
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('show_us_li', msg);
                document.getElementById('show_user_ul').innerHTML = html;
            }
        });
    }
   /* function editMessage(messageid){
        var url = apiUrl + "/admin/message/message/editMessage?messageId=" + messageid;
        var data = $("#form-box").serialize();
        components.getMsg(url,data,"post").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                components.Alert("success", "保存成功");
                setTimeout(function() {
                    window.history.go(-1);
                }, 2000);
            }
        });
    }*/

	    function getUserList(){

        var url = apiUrl + "/admin/user/userAdmin/getUserByPage";
        var data = $("#form-box").serialize();
        components.getMsg(url,data,"post").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html= template('list-tpl', msg.obj);
                document.getElementById('list').innerHTML = html;
            }
        });
       /* require(['./table']);*/
    }


    //选择用户
    $("#list").on("click", "tr", function() {
        var uid = $(this).attr('data');
        if (list.indexOf(uid) > -1) {
            alert("请勿重复添加");
        } else {
            list.push(uid);
            var li = $(this).clone();
            var box = li.append('<td class="del" style="color: red">删除</td>');
            $("#chosen-box").append(box);
			$("#userIds").val(list);
        }
    });
    /**
     * 删除选择用户
     */
    $("#chosen-box").on("click", ".del", function() {
        var index = $(this).parent("li").index();
        $(this).parent().remove();
        list.splice(index, 1);
		$("#userIds").val(list);
    });
});

