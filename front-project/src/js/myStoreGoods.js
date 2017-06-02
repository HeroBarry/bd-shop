define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
	var imgUrl =apiUrl;
	var addordeleteLock=false;//同一规格加减改操作锁，true表示锁住了 	 
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
		 var differencePrice=(settleAccountsPrice*100-totalNumber*100)/100;
		 if(differencePrice<=0){
			 document.getElementById("settle_accounts").innerHTML="结算";
			 document.getElementById("settle_accounts").style.backgroundColor = "#2CC17B";
			 document.getElementById("settle_accounts").setAttribute('href','/page/order_submit.html'); 
			 document.getElementById("settle_accounts").style.fontSize ="18px";
			 
		 }else{
			 document.getElementById("settle_accounts").innerHTML="还差"+differencePrice;
			 document.getElementById("settle_accounts").removeAttribute('href');
			 document.getElementById("settle_accounts").style.backgroundColor = "#EEEAFA";
			 document.getElementById("settle_accounts").style.fontSize ="12px";
		 }
	 } 

			
	var $goodsList = $("#show_goods_list_search");
    var $noRec = $('#noRec');
    var $cloading = $('#cloading');	
	var oldgoodsname="";//用来保存搜索的关键字，因为搜索结果出来后关键字会被清除
	 //获取商品列表，并展示,新方法 暂时不用，有问题
	var goodsList = {
        page: 0, //触发获取数据的数次(+1等于页码)
        size: 10, //每次触发取的记录条数
        isLoading: false, //列表是否加载中，避免重复触底加载
        url: apiUrl + "/front/goods/goods/getPageFrontByMyStoreGoods", //数据api
        getMore: function(first,goodsName) {
            if (goodsList.isLoading) //取数过程中，先停止重复取数
                return;

            if (first) {
                goodsList.page = 1;
                $('#noRec').hide();
				$goodsList.html('');
            } else {
                goodsList.page += 1;
            }
            $('#cloading').show(); //显示加载框
            goodsList.isLoading = true;
            setTimeout(goodsList.d(goodsList.page, goodsList.size,goodsName), 1000); //模拟延迟取数据
        },

        //异步获取商品列表
        d: function(page, size,goodsName) {
            $.ajax({
                url: goodsList.url,
                data: "pageNo=" + page + "&pageSize=" + size ,
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                dataType: "json",
            }).done(function(msg) {
                var res = msg.res;
                if (res !== 0) {					
					//获取到商品
					var goodsDataList=msg.obj.dataList;
					msg = msg.obj;
					msg.goodsDataList=goodsDataList;
					//处理图片路径的问题
					for (var pid = 0; pid < msg.goodsDataList.length; pid++) {
                        if (msg.goodsDataList[pid].image !== "") {
                            msg.goodsDataList[pid].image = msg.goodsDataList[pid].image.split(",");
                            for (var j = 0; j < msg.goodsDataList[pid].image.length; j++) {
                                msg.goodsDataList[pid].image[j] = imgUrl + msg.goodsDataList[pid].image[j];
                            }
							//处理起步价
							msg.goodsDataList[pid].vo_retailPrice=msg.goodsDataList[pid].vo_retailPrice/100;
                        }
                    }
					var html = template('show_goods_list_search-tp', msg);
					//$("#show_goods_list_search").html(html);	
                    if (goodsDataList && goodsDataList.length > 0) {
                        goodsList.isLoading = false;
                        $noRec.hide();
                    } else {
                        goodsList.isLoading = true;                       
						$noRec.hide();
                    }
                    if (goodsList.page > 1) {
                        $goodsList.append(html);
                    } else {
                        $goodsList.html(html);
                    }
                    $cloading.hide(); //隐藏加载框
					
					//绑定选择规格事件						
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
					};	
					if(msg.goodsDataList != undefined && msg.goodsDataList.length>0){
						$('#firstLoadNodata').hide();			
					}else if(msg.goodsDataList == undefined &&goodsList.page == 1){
						//加载第一页就没有数据，则显示没有收藏商品
						$('#firstLoadNodata').show();	
					}
                } else {
                    $noRec.hide();
                    $cloading.hide();
                }
				//goodsList.isLoading = false; 
            });
        }
    };
	 
				
	
	//滚动
	 $(window).scroll(function() {
        //滚动高度 + 窗口高度 + (底部导航高度 + 版权块高度) >= 文档高度，注意：文档高度不包括fixed定位的元素（分类导航、底部导航）
        if ($(document).scrollTop() + $(window).height() + (50 + 50) >= $(document).height()) {					
            goodsList.getMore(false,oldgoodsname); //获取数据
			$noRec.hide();
        }
    });
	
		
	//初始化方法	
	flushCurrentUserTotalPriceAndCategory();
	goodsList.getMore(true,oldgoodsname);
	
	
 });
