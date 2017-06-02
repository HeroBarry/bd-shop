define(['jquery', "components", "common", "weui", "hammer", "template","updown"], function(juqery, components, common, weui, hammer, template,updown) {
    var imgUrl =apiUrl;
    var addordeleteLock=false;//同一规格加减改操作锁，true表示锁住了
    var isAllCheck=true;
    $('#dialogDetail').css('height',document.documentElement.clientHeight-90);
    var page = 0;
    // 每页展示5个
    var size = 100;
    var dialogDetail = $('#dialogDetail').dropload({
        size: 5,
        categoryId: '0',
        autoLoad: false,//自动加载
        domDown:{
            domNoData: '<div class="dropload-noData">没有了~</div>'
        },
        loadDownFn: function (me) {//加载更多
            page++;
            var result = '';
            $.ajax({
                type: 'GET',
                url: apiUrl + "/front/shoppingcart/shoppingcart/queryShoppingCartDetailVO",
                data: "pageNo=" + page + "&pageSize=" + size,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (msg) {
                    var res = msg.res;
                    var shoppingCartVODataList=msg.obj.dataList;
                    msg=msg.obj;
                    msg.shoppingCartVODataList=shoppingCartVODataList;
                    if(res ==1 && shoppingCartVODataList.length > 0){

                        //处理图片路径的问题
                        for (var pid = 0; pid < msg.shoppingCartVODataList.length; pid++) {
                            if (msg.shoppingCartVODataList[pid].image !== "") {
                                msg.shoppingCartVODataList[pid].image = msg.shoppingCartVODataList[pid].image.split(",");
                                for (var j = 0; j < msg.shoppingCartVODataList[pid].image.length; j++) {
                                    msg.shoppingCartVODataList[pid].image[j] = imgUrl + msg.shoppingCartVODataList[pid].image[j];
                                }
                            }
                            //处理起步价
                            msg.shoppingCartVODataList[pid].retailPrice=msg.shoppingCartVODataList[pid].retailPrice/100;
                        }
                        result = template('show_shoppingCartVO-tpl', msg);

                    }
                    else {
                        if(page>1){
                            me.lock();
                        }
                        else{
                            $('.cart_body,.cart_footer').hide();
                            $('#noshoppingCartInfo').show();
                            return
                        }
                    }
                    $('#show_shoppingCartVO').append(result);
                    me.resetload();
                    // 每次数据加载完，必须重置

                    //绑定选择规格事件及是否购买的事件
                    for (var z in shoppingCartVODataList)
                    {
                        //隐藏的默认有的一个规格时的增删改增加绑定事件
                        $("#shopping_sub_"+shoppingCartVODataList[z].priceId).click(function() {
                            var priceId = this.id.substring(13);
                            var edit_goodspriceId="shopping_edit_"+	priceId;
                            var number=$("#"+edit_goodspriceId).val();
                            number= parseInt(number);
                            if(isNaN(number) ||number<0){
                                number=0;
                            }
                            if(number<=1){
                                //数据要减为0了，确认是否要删除
                                $.confirm({
                                    text: '确定要删除此规格吗？',
                                    onOK: function() {
                                        $("#shopping_edit_"+priceId).val(1);
                                        showoperateShoppingCart(2,priceId);
                                    },
                                    onCancel: function() {
                                        //不删除该规格，则改为1
                                        $("#shopping_edit_"+priceId).val(1);
                                        showoperateShoppingCart(3,priceId);
                                    }
                                });
                            }else{
                                showoperateShoppingCart(2,priceId);
                            }
                        });
                        $("#shopping_add_"+shoppingCartVODataList[z].priceId).click(function() {
                            showoperateShoppingCart(1,this.id.substring(13));
                        });
                        $("#shopping_edit_"+shoppingCartVODataList[z].priceId).change(function() {
                            var priceId=this.id.substring(14);
                            var edit_goodspriceId="shopping_edit_"+	priceId;
                            var number=$("#"+edit_goodspriceId).val();
                            number= parseInt(number);
                            if(isNaN(number) ||number<0){
                                number=0;
                            }
                            if(number<=0){
                                //数据要改为0了，确认是否要删除
                                $.confirm({
                                    text: '确定要删除此规格吗？',
                                    onOK: function() {
                                        $("#shopping_edit_"+priceId).val(0);
                                        showoperateShoppingCart(3,priceId);
                                    },
                                    onCancel: function() {
                                        //不删除该规格，则改为1
                                        $("#shopping_edit_"+priceId).val(1);
                                        showoperateShoppingCart(3,priceId);
                                    }
                                });
                            }else{
                                showoperateShoppingCart(3,priceId);
                            }
                            //showoperateShoppingCart(3,this.id.substring(14));
                        });
                        if(shoppingCartVODataList[z].isBuy==1){
                            //购买
                            document.getElementById('shopping_isbuy_'+shoppingCartVODataList[z].priceId).src="/src/image/choose.png";
                        }else{
                            //不购买
                            isAllCheck=false;
                            document.getElementById('shopping_isbuy_'+shoppingCartVODataList[z].priceId).src="/src/image/un-choose.png";
                        }
                        $("#shopping_isbuy_"+shoppingCartVODataList[z].priceId).click(function() {
                            invertIsBuy(this.id.substring(15));
                        });

                        addEffect($('#div_'+shoppingCartVODataList[z].priceId+' li'));

                    }
                    if(isAllCheck){
                        $('.text').addClass('selected')
                    }

                    deleteOneShoppingcart();

                    //清空购物车事件绑定
                    $("#clearmyshoppingcart").click(function() {
                        clearMyShoppingCart();
                    });


                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });


        }
    });

    //增加左滑动事件
    function addEffect(item) {
        var img, margin;
        new Hammer(item[ 0 ], {
            domEvents: true
        } );
        item.on( "panstart", function( e ) {
            img = item.children('div.touchModel');
            margin = parseInt( img.css('transform').replace(/[^0-9\-,]/g, '').split(',')[4], 10 );
        } );
        item.on( "pan", function( e ) {
            var delta = margin + e.originalEvent.gesture.deltaX;
            if ( delta >= -110 && delta <= 0 ) {
                img.css ('transform', 'translateX(' + delta + 'px)')
            }
        } );
    }

    $('.title_btn').click(function (e) {
        if(e.target.innerHTML=='编辑'){
            $('#checkAllBtn').show();
            $('#shoppingCartDetail,#settle_accounts').hide();
            $('.text').addClass('selected');
            ProDefaultType();
            e.target.innerHTML='完成';
        }
        else if (e.target.innerHTML=='完成'){
            $('#checkAllBtn').hide();
            $('#shoppingCartDetail,#settle_accounts').show();
            e.target.innerHTML='编辑';
        }
        else if(e.target.innerHTML=='清空购物车'){

            clearMyShoppingCart();
        }


    });

    function ProDefaultType(){
        var isSel=$('#shopping_isbuy_allOrNotall').parent('.text');
        $('.shopping_isbuy_img').attr("src","/src/image/un-choose.png");
        isSel.removeClass('selected');

    }
    $('#shopping_isbuy_allOrNotall').click(function () {
        //购买标志： 1购买 2不购买
        var isSel=$(this).parent('.text');
        if(isSel.hasClass('selected')){
            invertAllIsBuyState(2);
            isSel.removeClass('selected')

        }
        else{
            invertAllIsBuyState(1);
            isSel.addClass('selected')
        }





    });

    //商品规格增删改同一接口
    //商品只有一个规格时增删改数量	 operateType 1增 2删 3改; priceId 规格id;
    //source 表示操作来源 0表示只有一个规格时的增删改，1表示多个规格时的增删改
    function operateShoppingCartInterface(operateType,priceId,source){
        if(addordeleteLock==true){
            return;//当前其他操作未完成，锁住了
        }
        addordeleteLock=true;
        var edit_goodspriceId="shopping_edit_"+priceId;
        var sub_goodspriceId="shopping_sub_"+priceId;
        if(source==1){
            edit_goodspriceId="edit_"+priceId;
            sub_goodspriceId="sub_"+priceId;
        }
        var number=$("#"+edit_goodspriceId).val();
        number= parseInt(number);
        if(isNaN(number) ||number<0){
            number=0;
        }
        if(operateType==1){
            //加一操作
            number=parseInt(number)+parseInt(1);
        }else if(operateType==2){
            //减一操作
            number=parseInt(number)-parseInt(1);
        }
        if(number>10000){
            number=10000;
        }
        var changeurl = apiUrl + "/front/shoppingcart/shoppingcart/editNumeberToShoppingCart?priceId=" + priceId+"&quantity=" + number;
        components.getMsg(changeurl).done(function(msg) {
            addordeleteLock=false;
            flushCurrentUserTotalPriceAndCategory();//因为商品购物车数量是所有拟购买的规格的总数;
            var res = msg.res;
            if (res == 1) {
                if(number ==0 ){
                    //规格数减到0，隐藏
                    document.getElementById(sub_goodspriceId).style.display="none";
                    document.getElementById(edit_goodspriceId).style.display="none";
                    document.getElementById('shopping_isbuy_'+priceId).src="/src/image/un-choose.png";
                    document.getElementById("div_"+priceId).style.display="none";
                    $.toast("删除成功", "text");
                }else{
                    document.getElementById(sub_goodspriceId).style.display="block";
                    document.getElementById(edit_goodspriceId).style.display="block";
                    document.getElementById('shopping_isbuy_'+priceId).src="/src/image/choose.png";
                }
                $("#"+edit_goodspriceId).val(number);
            }else{
                alert("直接修改数量操作失败！");
            }
        });
    }


    //商品只有一个规格时增删改数量	 operateType 1增 2删 3改
    function showoperateShoppingCart(operateType,priceId){
        operateShoppingCartInterface(operateType,priceId,0);
    }


    //刷新当前用户的购物车总金额及种类数
    function flushCurrentUserTotalPriceAndCategory(){
        var flushurl = apiUrl + "/front/shoppingcart/shoppingcart/queryCurrentUserTotalPriceAndCategory";
        components.getMsg(flushurl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                //查询总价和种类成功
                var totalpriceandcategory=msg.obj;
                document.getElementById("totalNumber").innerHTML =totalpriceandcategory.totalPrice/100*1.00;
                document.getElementById("totalCategory").innerHTML =totalpriceandcategory.totalCategory;
                settleAccounts();
            }
            else{
                alert("获取总价失败！");
            }
        });
    }

    //计算起步价
    function settleAccounts() {
        var totalNumber = document.getElementById("totalNumber").innerHTML;
        var differencePrice = (totalNumber * 100 - settleAccountsPrice * 100) / 100;
        differencePrice = parseFloat(differencePrice.toFixed(2));
        if (parseInt(-differencePrice) === parseInt(settleAccountsPrice)) {
            document.getElementById("settle_accounts").innerHTML = "¥" + settleAccountsPrice + "起送";
            document.getElementById("settle_accounts").removeAttribute('href');
            // document.getElementById("settle_accounts").style.color = "#A9A9AA";
            document.getElementById("settle_accounts").style.backgroundColor = "#CCC";
            // document.getElementById("settle_accounts").style.fontSize ="16px";
        }
        else if (differencePrice >= 0) {
            document.getElementById("settle_accounts").innerHTML = "结算";
            document.getElementById("settle_accounts").style.backgroundColor = "#2CC17B";
            // document.getElementById("settle_accounts").style.color = "#fff";
            document.getElementById("settle_accounts").setAttribute('href', '/page/order_submit.html');
            // document.getElementById("settle_accounts").style.fontSize ="16px";

        } else {
            document.getElementById("settle_accounts").innerHTML = "还差¥" + (differencePrice * (-1)) + "起送";
            document.getElementById("settle_accounts").removeAttribute('href');
            // document.getElementById("settle_accounts").style.color = "#A9A9AA";
            document.getElementById("settle_accounts").style.backgroundColor = "#CCC";
            // document.getElementById("settle_accounts").style.fontSize ="16px";
        }
    }



    //翻转所有购买标志
    function invertAllIsBuyState(isBuy){
        //购买标志： 1购买 2不购买
        var suburl = apiUrl + "/front/shoppingcart/shoppingcart/reSetIsBuyState?isBuy="+isBuy;
        components.getMsg(suburl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                //所有购买标志翻转成功
                var src=document.getElementById('shopping_isbuy_allOrNotall').src;
                if(isBuy == 1){
                    //由不购买变为购买
                    document.getElementById('shopping_isbuy_allOrNotall').src="/src/image/choose.png";
                    $('.shopping_isbuy_img').attr("src","/src/image/choose.png");
                }else{
                    //由购买变为不购买
                    document.getElementById('shopping_isbuy_allOrNotall').src="/src/image/un-choose.png";
                    $('.shopping_isbuy_img').attr("src","/src/image/un-choose.png");
                }
                flushCurrentUserTotalPriceAndCategory();
            }
        });
    }


    //翻转是否购买 cartId实际上已改为
    function invertIsBuy(priceId){
        var suburl = apiUrl + "/front/shoppingcart/shoppingcart/invertIsBuy?priceId="+priceId;
        components.getMsg(suburl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {
                //购买标志翻转成功
                var src=document.getElementById('shopping_isbuy_'+priceId).src;
                if(src.indexOf("un-choose") != -1){
                    //由不购买变为购买
                    document.getElementById('shopping_isbuy_'+priceId).src="/src/image/choose.png";
                }else{
                    //由购买变为不购买
                    document.getElementById('shopping_isbuy_'+priceId).src="/src/image/un-choose.png";
                }
                flushCurrentUserTotalPriceAndCategory();

            }
        });
    }





    //清空购物车
    function clearMyShoppingCart(){


        $.confirm({
            title: '提示',
            text: '是否清空购物车?',
            onOK: function () {
                var suburl = apiUrl + "/front/shoppingcart/shoppingcart/delCurrentUserAllShoppingCart";
                components.getMsg(suburl).done(function(msg) {
                    var res = msg.res;
                    if (res == 1) {
                        flushCurrentUserTotalPriceAndCategory();
                        page = 0;
                        dialogDetail.unlock();
                        dialogDetail.noData(false);
                        dialogDetail.$domDown.html(dialogDetail.opts.domDown.domLoad);
                        dialogDetail.loading = true;
                        dialogDetail.opts.loadDownFn(dialogDetail);
                    }else{

                    }
                });
            },
            onCancel: function () {
            }
        });


    }


    //删除一个规格
    function deleteOneShoppingcart() {
        $("#show_shoppingCartVO li").click(function(e) {
            var rid = $(this).attr("rid");
            if(($(e.target).hasClass("delete") || $(e.target).hasClass("icon-delete"))){
                $.confirm({
                    text: '确定要删除此规格吗？',
                    onOK: function() {
                        $("#shopping_edit_"+rid).val(0);
                        operateShoppingCartInterface(3,rid,0);
                        document.getElementById("div_"+rid).style.display="none";
                        $.toast("删除成功", "text");
                    }
                });
            }
        });
    }


    flushCurrentUserTotalPriceAndCategory();
    page = 0;
    dialogDetail.unlock();
    dialogDetail.noData(false);
    dialogDetail.$domDown.html(dialogDetail.opts.domDown.domLoad);
    dialogDetail.loading = true;
    dialogDetail.opts.loadDownFn(dialogDetail);
});
