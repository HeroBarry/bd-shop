define(['jquery', "template", "components", "ZeroClipboard", "jqueryValidate", "ueditorConfig", "ueditorAll", "manageCommon"], function(jquery, template, components, ZeroClipboard, validator, ueditorConfig, UE, manageCommon) {
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

    var pushState=components.GetQueryString("pushNowState");
    var adid= components.GetQueryString("id");
    var submitUrl = "";
    if (pushState==1) {
        submitUrl = apiUrl + "/admin/message/message/editMessage?messageId="+adid;
        $("#addState").text("查看消息");
        $("#submit-btn").css("display", "none");
        getData(adid);
    } else {
        pushState=2;
        submitUrl = apiUrl + "/admin/message/message/pushMessage?messageId="+adid+"&pushState="+pushState;
        $("#addState").text("立即推送");
        getData(adid);
    }

    $("#submit-btn").click(function(){
        var url = apiUrl + "/admin/message/message/pushMessage?messageId="+adid+"&pushState="+pushState;
        components.getMsg(url).done(function (msg){
            var res = msg.res;
            if(res==1){
                components.Alert("success", "推送成功");
                setTimeout(function() {
                    window.location.href="/page/manage_message_list.html";
                    /*window.history.go(-1);*/

                }, 2000);
            }
        });
    });

    var pushTime;
    var pushState2;
    function getData(id) {
        var url = apiUrl + "/admin/message/messageAdmin/getMessageById?messageId="+id;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            /*console.log(msg.obj.messageName);*/
            if (res == 1) {
                var userIds=msg.obj.userIds;
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
                //$(".messageSongOne").parent("td").parent("tr").find("a").html(msg.obj.messageName.length);
                //$(".messageSongTwo").parent("td").parent("tr").find("a").html(msg.obj.description.length);
                pushTime = msg.obj.pushTime;
                pushState2 = msg.obj.push;
                getPushUserList(userIds);
            }
        });
    }
    function getPushUserList(userIds){
        var page=0; //触发获取数据的数次(+1等于页码)
        var size=10; //每次触发取的记录条数

        var data = {
            "userIds": userIds,
            "pageNo": page,
            "pageSize": size
        }

       var url = apiUrl + "/admin/user/userAdmin/getUsersByUserIds";
        /*var url = apiUrl +"/admin/user/userAdmin/getUserByPage";*/
            components.getMsg(url, data, "post").done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                msg = msg.obj;
                for(var i=0; i<msg.dataList.length; i++){
                    msg.dataList[i].pushTime = pushTime;
                    msg.dataList[i].push = pushState2;
                }
                var html = template('table-list-tpl', msg);
                document.getElementById('table-list-content').innerHTML = html;
            }
        });
    }
});