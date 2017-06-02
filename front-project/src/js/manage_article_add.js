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

    //设置全局变量
    window.ZeroClipboard = ZeroClipboard;
    var num=0;
    //初始化富文本框
    var ue = UE.getEditor('container', {
        initialFrameWidth: 800,
        initialFrameHeight: 250
        // initialContent: "请填写详细描述",
    });
    var article= components.GetQueryString("id");
    console.log(article);
    var submitUrl = "";
    var atr="";

    if (article) {
        submitUrl = apiUrl + "/admin/article/articleAdmin/editArticle?articleId="+article;
        getData(article);
        $("#addState").text("编辑文章");
    } else {
        submitUrl = apiUrl + "/admin/article/articleAdmin/addArticle";
        $("#addState").text("添加文章");
    }
    //上传LOGO
    function upPic() {
        $("#div-box").on("change", "#pic-upload", function() {
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
                    num+=1;
                    if(num==1){
                        $(".a-upload").css("display","none");
                    }
                }

            });
        });
    }

    upPic();
    delpic();
    function delpic() {
        $("#div-box").on("click", ".del-doc", function() {
            var $this = $(this).parents("li");
            var url = apiUrl + "/upload/removeFile";
            var docUrl = $this.attr("picUrl");
            $.ajax({
                url: url,
                type: 'get',
                dataType: "json",
                data: {
                    "preImg":docUrl
                },
                success: function(msg) {
                    if (msg.res == 1) {
                        $this.remove();
                        num-=1;
                        if(num<1){
                            $(".a-upload").css("display","block");
                        }
                    }
                }

            });
        });
    }

    function getData(id) {
        var url = apiUrl + "/admin/article/articleAdmin/getArticleById?articleId=" + id;
        components.getMsg(url).done(function(msg) {
            var res = msg.res;
            console.log(msg.obj)
            if (res == 1) {
                var html = template('div-box-tpl', msg);
                document.getElementById('div-box').innerHTML = html;
                if(msg.obj.image!=""){
                    var arr = msg.obj.imageUrl;
                    $(".a-upload").css("display","none");
                    var imgUrl = apiUrlPic+arr;
                    console.log(arr);
                    $('#pic-document-list').append($('<li picUrl="' + arr + '"class="apply-book"> <img  src=" ' + imgUrl + '"> <a docUrl="' + arr + '" href="javascript:void(0)" class="text-basic del-doc iconfont icon-close"></a></li>'));
                }
                ue.ready(function() {
                    //设置编辑器的内容
                    ue.setContent(msg.obj.content);
                });
            }
        });

        //初始化规格数据
        // var url = apiUrl + "/admin/goodsPrice/goodsPriceAdmin/getGoodsPriceListByGoodsId?goodsId=" + id;
        // components.getMsg(url).done(function(msg) {
        //     var res = msg.res;
        //     if (res == 1) {
        //         if(msg.obj ==undefined){
        //             //没有规格数据
        //         }else{
        //             var objList=msg.obj;
        //             for(var ij=0;ij<objList.length;ij++){
        //                 var goodsprice=objList[ij];
        //
        //                 var arr = new Array();
        //                 arr[0] = goodsprice.priceId;;//新增规格默认id
        //                 arr[1] = goodsprice.unitName;
        //                 arr[2] = goodsprice.retailPrice/100;
        //                 arr[3] = goodsprice.buyPrice/100;
        //                 arr[4] = goodsprice.wholesalePrice/100;
        //                 arr[5] ="<a style='text-align:center;color:blue;cursor:pointer;' onclick='delRow(this);'>删除</a>";
        //                 var x = document.getElementById('table').insertRow(1); //获取第一行对象
        //                 for(var i=0;i<arr.length;i++){
        //                     x.insertCell(i).innerHTML = arr[i] ;  //用循环把每个数据插入第一行的每一列
        //                 }
        //                 x.cells[0].style.display = "none";//隐藏第一列，保存的是规格id
        //             }
        //         }
        //     }
        // });
    }

    Validate();


    // jQuery.validator.addMethod("num", function(value, element) {
    //     var num = /^(([1-9]+\d*)|(\d+(\.\d[1-9]))|(\d+(\.[1-9])))$/g;
    //     return this.optional(element) || (num.test(value));
    // }, "请填写非负正数且最多保留小数点后两位 ");


    function Validate() {
        $("#form-box").validate({
            rules: {
                title: {
                    required: true,
                    maxlength: 50
                },
                recommend: {
                    required: true
                }
            },
            messages: {
                title: {
                    required: "文章名称必填",
                    maxlength:"最多填写50个字符"
                },
                recommend: {
                    required: "请选择一个"
                }
            },
            submitHandler: function(form) {

                var price = $("#price").val()*100;
                $("#pic-document-list > li").each(function() {
                    atr += $(this).attr("picUrl") + ",";
                });
                var reg=/,$/gi;
                atr=atr.replace(reg,"");
                var data = $("#form-box").serialize()+"&imageUrl="+atr;

                components.getMsg(submitUrl, data, "post").done(function(msg){
                    console.log(msg);
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
