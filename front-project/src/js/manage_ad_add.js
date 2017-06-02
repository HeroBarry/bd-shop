define(['jquery', "template", "components", "ZeroClipboard", "jqueryValidate", "ueditorConfig", "ueditorAll", "manageCommon"], function (jquery, template, components, ZeroClipboard, validator, ueditorConfig, UE, manageCommon) {
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

    var adid = components.GetQueryString("id");
    var adPositionId = components.GetQueryString("adid");
    var submitUrl = "";
    var adminName = "";
    var atr = "";
    if (adid) {
        submitUrl = apiUrl + "/admin/ad/ad/editAd?adId=" + adid;
        $("#addState").text("编辑广告");
        getData(adid);
    } else {
        submitUrl = apiUrl + "/admin/ad/ad/addAd?adPositionId=" + adPositionId;
        $("#addState").text("添加广告");
    }

    function getData(id) {
        var url = apiUrl + "/admin/ad/ad/queryAdByAdId?adId=" + id;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;

                if (msg.obj.image != "") {
                    var arr = msg.obj.image;
                    $(".a-upload").css("display", "none");
                    var imgUrl = apiUrlPic + arr;                        
                    $('#pic-document-list').append($('<li picUrl="' + arr + '"class="apply-book"> <img  src=" ' + imgUrl + '">  <a docUrl="' + msg.result + '" href="javascript:void(0)" class="text-basic del-doc"><i class="iconfont icon-delete"></i></a></li>'));
                }
            }
        });
    }

    //上传LOGO
    function upPic() {
        $("#div-box").on("change", "#pic-upload", function () {
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
                success: function (msg) {
                    var picListHtml = '<li picUrl="' + msg.result + '"class="apply-book"> <img  src=" ' + apiUrlPic + msg.result + '">  <a docUrl="' + msg.result + '" href="javascript:void(0)" class="text-basic del-doc"><i class="iconfont icon-delete"></i></a></li>';
                    $("#pic-document-list").append(picListHtml);
                    $(".a-upload").css("display", "none");
                }
            });
        });
    }

    upPic();
    delpic();
    function delpic() {
        $("#div-box").on("click", ".del-doc", function () {
            var $this = $(this);
            var url = apiUrl + "/upload/removeFile";
            var docUrl = $this.attr("picUrl");
            $.ajax({
                url: url,
                type: 'get',
                dataType: "json",
                data: "preImg=" + docUrl,
                success: function (msg) {
                    if (msg.res == 1) {
                        $this.parents("li").remove();
                    }
                }
            });
        });
    }

    Validate();
    function Validate() {
        $("#form-box").validate({
            rules: {
                state: {
                    required: true
                },
                description: {
                    required: true
                }
            },
            messages: {
                state: {
                    required: "请选择一个"
                },
                description: {
                    required: "简要描述请填写"
                }
            },
            submitHandler: function (form) {

                $("#pic-document-list > li").each(function () {
                    atr += $(this).attr("picUrl") + ",";
                });
                var reg = /,$/gi;
                atr = atr.replace(reg, "");
                //var atr=$('#pic-document-list > li').attr('picurl');
                var data = $("#form-box").serialize() + "&image=" + atr;

                components.getMsg(submitUrl, data, "post").done(function (msg) {
                    if (msg.res == 1) {
                        components.Alert("success", "添加成功");
                        setTimeout(function () {
                            window.history.go(-1);
                        }, 2000);
                    } else {
                        components.Alert("success", "失败");
                    }
                });
            }
        });
    }
});
