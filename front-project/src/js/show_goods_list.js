define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
     //获取产品规格
	 function showOrhideGoodspriceList(goodsId){
		var showId="show_goods_price_list_"+goodsId;		 
		var display =$("#showId").css("display");
		if(display == 'none'){
			//展开
			var suburl = apiUrl + "/front/goodsPrice/goodsPrice/getGoodsPriceListByGoodsId?goodsId=" + goodsId;
			components.getMsg(suburl).done(function(msg) {
				var res = msg.res;
				if (res == 1) {                
					//获取到产品规格
					var goodspriceDataList=msg.obj;
					var html = template('show_goods_price_list-tpl', goodspriceDataList);
					$("#showId").html(html);		
					var ggs_id="gg_"+goodsId;
					document.getElementById(ggs_id).innerHTML = "收起";					
				}else{
					alert("获取产品规格失败！");
				}
			});
		}else{
			//收起
			$("#showId").css("display","none");
			var gg_id="gg_"+goodsId;
			document.getElementById(gg_id).innerHTML = "选择规格";
		}		
	 }	
 });
