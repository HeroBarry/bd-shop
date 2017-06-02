define(['jquery', "components","bootstrap", "common", "template","updown"], function(jquery, components,bootstrap, common, template,updown) {
	var imgUrl =apiUrl;
	var addordeleteLock=false;//同一规格加减改操作锁，true表示锁住了
    $('.search_Top').css('height',document.documentElement.clientHeight-44-50);
    $('.page__bd').css('height',document.documentElement.clientHeight-44);
    var last,$searchBar = $('#searchBar'),
        $searchResult = $('#searchResult'),
        $searchText = $('#searchText'),
        $searchInput = $('#searchInput'),
        $searchClear = $('#searchClear'),
        $searchCancel = $('#searchCancel'),
    	$searchList = $('.search_Top');

    function hideSearchResult(){
        $('#search_goods_list').empty();
        $searchResult.show();
        $searchList.hide();
        $searchInput.val('');
    }
    function cancelSearch(){
      hideSearchResult();
        $searchBar.removeClass('weui-search-bar_focusing');
        $searchText.show();
    }
    $searchText.on('click', function(){
        $searchBar.addClass('weui-search-bar_focusing');
        $searchInput.focus();
    });
    $searchClear.on('click', function(){
        hideSearchResult();
        $searchInput.focus();
    });
    $searchCancel.on('click', function(){
        cancelSearch();
        $searchInput.blur();
    });
    $('.title_btn').click(function(){
	});
	 $searchInput
        .on('blur', function () {
            if(!this.value.length) cancelSearch();
        })
        .on('input', function(event){
            $('#search_goods_list').empty();
            if(this.value.length) {
                $searchResult.hide();
                $searchList.show();
                $this=$(this);

                last=event.timeStamp;
                //利用event的timeStamp来标记时间，这样每次的input事件都会修改last的值，注意last必需为全局变量
                setTimeout(function(){
                    if(last-event.timeStamp===0){
                        //如果时间差为0（也就是你停止输入1s之内都没有其它的keyup事件发生）则做你想要做的事
                        var isbn = $this.val();
                        page = 0;
                        searchPro.categoryId = isbn;
                        searchPro.unlock();
                        searchPro.noData(false);
                        searchPro.$domDown.html(searchPro.opts.domDown.domLoad);
                        searchPro.loading = true;
                        searchPro.opts.loadDownFn(searchPro);
                    }
                },1500);

            } else {
                $searchResult.show();
                $searchList.hide();
            }
        });

    querySecondCategoryListByFirstCategoryId('5');
    //获取二次分类列表
    function querySecondCategoryListByFirstCategoryId( categoryId) {

        var secondCategoryDataList={'secondCategoryDataList':[
            {
                "categoryId":"水蜜桃",

                "categoryName":"水蜜桃"
            },
            {
                "categoryId":"小青芒",

                "categoryName":"小青芒"
            }, {
                "categoryId":"黄金鲽鱼",

                "categoryName":"黄金鲽鱼"
            },
            {
                "categoryId":"火龙果",

                "categoryName":"火龙果"
            }
        ]};
        var html = template('productSearch-tpl', secondCategoryDataList);
        $("#show_second_category").html(html);
        $("#show_second_category li[data-type]").click(function () {
            $('#search_goods_list').empty();


            $searchResult.hide();
            $searchList.show();
            page = 0;
            searchPro.categoryId = $(this).attr('data-type');
            searchPro.unlock();
            searchPro.noData(false);
            searchPro.$domDown.html(searchPro.opts.domDown.domLoad);
            searchPro.loading = true;
            searchPro.opts.loadDownFn(searchPro);
            /*$searchInput.val($(this).attr('data-type'));
            $searchInput.focus();
            $searchBar.addClass('weui-search-bar_focusing');*/

        });
    }

    var page = 0;
    // 每页展示5个
    var size = 5;
    var searchPro = $('.search_Top').dropload({
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
                url: apiUrl + "/front/goods/goods/getPageFrontVOByGoodsName",
                data: "pageNo=" + page + "&pageSize=" + size+ "&goodsName=" + encodeURIComponent(me.categoryId) ,
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (msg) {
                    var res = msg.res;
                    var goodsDataList = msg.obj.dataList;
                    msg.goodsDataList=goodsDataList;
                    if(res ===1 && goodsDataList.length > 0){

                        //处理图片路径的问题
                        for (var pid = 0; pid < msg.goodsDataList.length; pid++) {
                            if (msg.goodsDataList[pid].image !== "") {
                                msg.goodsDataList[pid].image = msg.goodsDataList[pid].image.split(",");
                                for (var j = 0; j < msg.goodsDataList[pid].image.length; j++) {
                                    msg.goodsDataList[pid].image[j] = imgUrl + msg.goodsDataList[pid].image[j];
                                }
                            }
                            //处理起步价
                            msg.goodsDataList[pid].vo_retailPrice=msg.goodsDataList[pid].vo_retailPrice/100;
                        }
                        result = template('search_goods_list_tp1', msg);

					}
                    else {
                        // 锁定
                        me.lock();
                    //    me.noData();
                        // 无数据
                    }
                    $('#search_goods_list').append(result);
                    me.resetload();
                    // 每次数据加载完，必须重置

                    for (var z in goodsDataList)
                    {
                        var goods_id=new Object();
                        goods_id="goodsId_"+goodsDataList[z].goodsId;
                        $("#"+goods_id).click(function() {
                            showOrhideGoodspriceList(this.id.substring(8));
                        });

                        //隐藏的默认有的一个规格时的增删改增加绑定事件
                        $("#one_edit_"+goodsDataList[z].vo_priceId).val(goodsDataList[z].vo_shoppingCartNum);
                        $("#one_sub_"+goodsDataList[z].vo_priceId).click(function() {
                            operateShoppingCart(2,this.id.substring(8));
                        });
                        $("#one_add_"+goodsDataList[z].vo_priceId).click(function() {
                            operateShoppingCart(1,this.id.substring(8));
                        });
                        $("#one_edit_"+goodsDataList[z].vo_priceId).change(function() {
                            operateShoppingCart(3,this.id.substring(9));
                        });
                        //商品只有一个规格时，直接显示加减号
                        if(goodsDataList[z].vo_countGoodsPrice==1){
                            document.getElementById("goodsId_"+goodsDataList[z].goodsId).style.display="none";
                            if(goodsDataList[z].vo_shoppingCartNum==0){
                                //购物车中数量为0，只显示加号
                                document.getElementById("one_add_"+goodsDataList[z].vo_priceId).style.display="block";
                            }else{
                                document.getElementById("one_sub_"+goodsDataList[z].vo_priceId).style.display="block";
                                document.getElementById("one_edit_"+goodsDataList[z].vo_priceId).style.display="block";
                                document.getElementById("one_add_"+goodsDataList[z].vo_priceId).style.display="block";
                            }
                        }
                    }


                },
                error: function (xhr, type) {
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });


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
		var edit_goodspriceId="one_edit_"+priceId;
		var sub_goodspriceId="one_sub_"+priceId;
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
				}else{
					document.getElementById(sub_goodspriceId).style.display="block";
					document.getElementById(edit_goodspriceId).style.display="block";							
				}	
				$("#"+edit_goodspriceId).val(number);
			}else{
				alert("直接修改数量操作失败！");
			}
		});		  
	 }
	 
	 
	  //商品只有一个规格时增删改数量	 operateType 1增 2删 3改  
	 function operateShoppingCart(operateType,priceId){
		 operateShoppingCartInterface(operateType,priceId,0);		
	 }
	 
	 //删除购物车中的一个规格数量
	 function subOneToShoppingCart(priceId){
		operateShoppingCartInterface(2,priceId,1);		
	 }
	 
	 
	 //增加一个规格
	 function addOneToShoppingCart(priceId){
		operateShoppingCartInterface(1,priceId,1);		
	 }
	 
	 //直接填写一个规格数量
	 function editNumeberToShoppingCart(priceId){
		 operateShoppingCartInterface(3,priceId,1);			
	 }
	 

	 //获取产品规格
	 function showOrhideGoodspriceList(goodsId){
		var showId="show_goods_price_list_"+goodsId;
		var display =document.getElementById(showId).style.display;
		if(display == 'none'){
			//展开
			var suburl = apiUrl + "/front/goodsPrice/goodsPrice/getGoodsPriceListByGoodsId?goodsId=" + goodsId;
			components.getMsg(suburl).done(function(msg) {
				var res = msg.res;
				if (res == 1) {
					//获取到产品规格
					var goodspriceDataList=msg.obj;
					//处理显示的价格
					for (var pi = 0; pi < goodspriceDataList.length; pi++) {
                        goodspriceDataList[pi].retailPrice = goodspriceDataList[pi].retailPrice / 100;
                    }

					msg.goodspriceDataList=goodspriceDataList;
					var html = template('show_goods_price_list-tpl', msg);
					$("#"+showId).html(html);
					var ggs_id="goodsId_"+goodsId;
					document.getElementById(ggs_id).innerHTML = "收起";
					document.getElementById(showId).style.display="";
					//绑定增删改规格数量事件及初始化规格数量，规格数量取采购价
					for (var m in goodspriceDataList)
					{
						var goodsPrice_id=new Object();
						goodsPrice_id=goodspriceDataList[m].priceId;
						$("#edit_"+goodsPrice_id).val(goodspriceDataList[m].buyPrice);
						$("#sub_"+goodsPrice_id).click(function() {
							subOneToShoppingCart(this.id.substring(4));
						});
						$("#add_"+goodsPrice_id).click(function() {
							addOneToShoppingCart(this.id.substring(4));
						});
						$("#edit_"+goodsPrice_id).change(function() {
							editNumeberToShoppingCart(this.id.substring(5));
						});
						if(goodspriceDataList[m].buyPrice==0){
							//规格数为0，则隐藏减号和数字
							document.getElementById("sub_"+goodsPrice_id).style.display="none";
							document.getElementById("edit_"+goodsPrice_id).style.display="none";
						}
					};
				}else{
					alert("获取产品规格失败！");
				}
			});
		}else{
			//收起
			document.getElementById(showId).style.display="none";
			var ggs_id="goodsId_"+goodsId;
			document.getElementById(ggs_id).innerHTML = "选择规格";
		}
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
     function settleAccounts(){
		 var totalNumber=document.getElementById("totalNumber").innerHTML;
		 var differencePrice=(totalNumber*100-settleAccountsPrice*100)/100;
		 differencePrice=parseFloat(differencePrice.toFixed(2)); 
		 if(parseInt(-differencePrice)==parseInt(settleAccountsPrice)){
			 document.getElementById("settle_accounts").innerHTML=settleAccountsPrice+"起送";
			 document.getElementById("settle_accounts").removeAttribute('href');
			 document.getElementById("settle_accounts").style.backgroundColor = "#CCC";
			 // document.getElementById("settle_accounts").style.fontSize ="18px";
		 }
		 else if(differencePrice>=0){
			 document.getElementById("settle_accounts").innerHTML="结算";
			 document.getElementById("settle_accounts").style.backgroundColor = "#2CC27B";
			 document.getElementById("settle_accounts").setAttribute('href','/page/order_submit.html'); 
			 // document.getElementById("settle_accounts").style.fontSize ="18px";
			 
		 }else{
			 document.getElementById("settle_accounts").innerHTML="还差"+(differencePrice*(-1))+"配送";
			 document.getElementById("settle_accounts").removeAttribute('href');
			 document.getElementById("settle_accounts").style.backgroundColor = "#CCC";
			 // document.getElementById("settle_accounts").style.fontSize ="14px";
		 }
	 } 


	  //购物车详情事件绑定
	$("#shoppingCartDetail").on('click', function(e){
	    e.stopPropagation();
		window.location.href="/page/myShoppingCart.html"; 
	});
		

		
		
	//初始化方法	
	flushCurrentUserTotalPriceAndCategory();
	
 });
