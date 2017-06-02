define(['jquery', "components", "common", "template",, "swiper"], function(jquery, components, common, template,swiper) {
	var addordeleteLock=false;//同一规格加减改操作锁，true表示锁住了 
	  //获取商品列表，并展示
	 function getPageFrontByGoodsId(goodsId){		
			var suburl = apiUrl + "/front/goods/goods/getPageFrontByGoodsId?goodsId=" + goodsId;
			components.getMsg(suburl).done(function(msg) {
				var res = msg.res;
				if (res == 1) {                
					//获取到商品
					var goodsDataList=msg.obj;
					msg.goodsDataList=goodsDataList;
					//处理图片路径的问题
					for (var pid = 0; pid < msg.goodsDataList.length; pid++) {
                        if (msg.goodsDataList[pid].image !== "") {
                            msg.goodsDataList[pid].image = msg.goodsDataList[pid].image.split(",");
                            for (var j = 0; j < msg.goodsDataList[pid].image.length; j++) {
                                msg.goodsDataList[pid].image[j] = apiUrl + msg.goodsDataList[pid].image[j];
                            }
                        }
						//处理起步价
						msg.goodsDataList[pid].vo_retailPrice=msg.goodsDataList[pid].vo_retailPrice/100;
                    }
					var html = template('show_goods_list-tpl', msg);
					$("#show_goods_list").html(html);	
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
							//subOneToShoppingCart(this.id.substring(8));
						});
						$("#one_add_"+goodsDataList[z].vo_priceId).click(function() {
							operateShoppingCart(1,this.id.substring(8));
							//addOneToShoppingCart(this.id.substring(8));
						});
						$("#one_edit_"+goodsDataList[z].vo_priceId).change(function() {
							operateShoppingCart(3,this.id.substring(9));
							//editNumeberToShoppingCart(this.id.substring(9));
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
						if(goodsDataList[z].delState==1){
							//已收藏
							document.getElementById("img_true_"+goodsDataList[z].goodsId).style.display="block";
							document.getElementById("img_false_"+goodsDataList[z].goodsId).style.display="none";
						}else{
							document.getElementById("img_true_"+goodsDataList[z].goodsId).style.display="none";
							document.getElementById("img_false_"+goodsDataList[z].goodsId).style.display="block";
						}
						//收藏及取消收藏，借用delState状态，1表示收藏，0表示不收藏
						$("#img_true_"+goodsDataList[z].goodsId).click(function() {
							collectGoods(-1,this.id.substring(9));
						});
						$("#img_false_"+goodsDataList[z].goodsId).click(function() {
							collectGoods(1,this.id.substring(10));
						});
					};	
					var mySwiper = new Swiper('.swiper-container', {
							autoplay: 3000, //可选选项，自动滑动
					});
					addMinus();					
				}else{
					alert("获取商品失败！");
				}
			});			
	 }	
	 
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
		 if(differencePrice>=0){
			 document.getElementById("settle_accounts").innerHTML="结算";
			 document.getElementById("settle_accounts").style.backgroundColor = "#2CC17B";
			 document.getElementById("settle_accounts").setAttribute('href','/page/order_submit.html'); 
			 // document.getElementById("settle_accounts").style.fontSize ="16px";
			 
		 }else{
			 document.getElementById("settle_accounts").innerHTML="还差¥"+(differencePrice*(-1))+"起送";
			 document.getElementById("settle_accounts").removeAttribute('href');
            // document.getElementById("settle_accounts").style.color = "#A9A9AA";
			 document.getElementById("settle_accounts").style.backgroundColor = "#C6C6C6";
			 // document.getElementById("settle_accounts").style.fontSize ="16px";
		 }
	 } 

	 
	//收藏或取消收藏商品
	function collectGoods(operateType,goodsId){
			
		var addurl = apiUrl + "/front/storegoods/storegoods/addOrSubStoreGoods?goodsId=" + goodsId+"&state="+operateType;
        components.getMsg(addurl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {                
               //收藏成功
			   if(operateType != undefined && operateType==1){			
					document.getElementById("img_true_"+goodsId).style.display="block";
					document.getElementById("img_false_"+goodsId).style.display="none";
				}else{
					document.getElementById("img_true_"+goodsId).style.display="none";
					document.getElementById("img_false_"+goodsId).style.display="block";
				}	
			}else{
				alert("操作失败！");
			}
        });
	}
	 
	 
	 //购物车详情事件绑定	
	$("#shoppingCartDetail").on('click', function(){	 
		window.location.href="/page/myShoppingCart.html"; 
	});
	 
	 //初始化方法
	  var goodsId= components.GetQueryString("id");
	 if(goodsId != undefined){
		 getPageFrontByGoodsId(goodsId);
	 }
	 flushCurrentUserTotalPriceAndCategory();
	 
	
	
	function addMinus() {
        $(".minus").click(function() {
            var $input = $(this).siblings("input");
            var num = parseInt($input.val());
            if (num !== 1) {
                num -= 1;
                $input.val(num);
            }
        });
        $(".plus").click(function() {
            var $input = $(this).siblings("input");
            var num = parseInt($input.val());
            num += 1;
            $input.val(num);
        });
    }
	 
 });
