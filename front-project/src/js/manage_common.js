define(['jquery', "bootstrap", "components", "jqueryCookie", "template", "manageCommon"], function (jquery, bootstrap, components, jqueryCookie, template, manageCommon) {
    //$('.container-wrap').css('display','none')
    var cookieName = $.cookie("userName");
    var sid = components.GetQueryString("lid");
    $("#user-name").text($.cookie("userName"));
    $("#logout").click(function () {
        components.getMsg(apiUrl + "/adminLogin/loginOut").done(function (msg) {
            if (msg.res == 1) {
                location.href = "/page/manage_login.html";
            }
        });
    });

    $("body").append("<div class='alert' id='alert'></div>"); //插入alert结构

    $("#left-side-bar .item").click(function () {
        $(this).siblings("ul").slideToggle();
        $(this).find("i").toggleClass("icon-moreunfold").toggleClass("icon-more");
        event.stopPropagation();
    });
    sideNavActive();

    function sideNavActive() {
        var $leftSideItem = $("#left-side-bar .ite");
        $leftSideItem.eq(sid).addClass("active");
    }


    if (cookieName !== "null" && cookieName !== undefined && cookieName !== null) {

        $("#user-name").text($.cookie("userName"));
        //getModules();
    }

    //var leftSideList = $("#left-side-bar");
    //var html = "";
    //var ul = "";
    //var li;

    function getModules() {
        var flag1 = false;
        var flag2 = false;
        var flag3 = false;
        var flag4 = false;
        var flag5 = false;
        var flag6 = false;
        components.getMsg(apiUrl + "/admin/module/module/queryModules" ).done(function (msg) {
            if (msg.res == 1) {
                var objList = msg.obj;
                for (var i = 0; i < objList.length; i++) {
                    var module = objList[i];
                    var id = module.moduleId;
                    var pid = module.parentId;
                    if(id == 7){
                        $("#goodsList").css("display","block");
                        flag1 = true;
                    }
                    if(id == 8){
                        $("#goodsOrder").css("display","block");
                        flag1 = true;
                    }
                    if(id == 9){
                        $("#goodsCatory").css("display","block");
                        flag1 = true;
                    }
                    if(id == 10){
                        $("#memberManage").css("display","block");
                        flag2 = true;
                    }
                    if(id == 11){
                        $("#messageManage").css("display","block");
                        flag2 = true;
                    }
                    if(id == 12){
                        $("#articleManage").css("display","block");
                        flag3 = true;
                    }
                    if(id == 13){
                        $("#adManage").css("display","block");
                        flag4 = true;
                    }
                    if(id == 14){
                        $("#goodsReport").css("display","block");
                        flag5 = true;
                    }
                    if(id == 15){
                        $("#orderReport").css("display","block");
                        flag5 = true;
                    }
                    if(id == 16){
                        $("#adminManage").css("display","block");
                        flag6 = true;
                    }
                    if(id == 17){
                        $("#roleManage").css("display","block");
                        flag6 = true;
                    }
                    if(flag1){
                        $("#div1").css("display","block");
                    }
                    if(flag2){
                        $("#div2").css("display","block");
                    }
                    if(flag3){
                        $("#div3").css("display","block");
                    }
                    if(flag4){
                        $("#div4").css("display","block");
                    }
                    if(flag5){
                        $("#div5").css("display","block");
                    }
                    if(flag6){
                        $("#div6").css("display","block");
                    }
                    if(flag1 || flag2 || flag3 && flag4 || flag5 || flag6){
                        $('.container-wrap').css('display','block')
                    }
                }
            }
            //location.href = "/page/manage_login.html";
        });
    }

})
;
