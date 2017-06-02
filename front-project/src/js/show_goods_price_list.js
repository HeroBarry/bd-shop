define(['jquery', "components", "common", "weui"], function(jquery, components, common, weui) {
     //减少一个规格
	 function subOnegoodsprice(priceId){
		var suburl = apiUrl + "/front/goodsPrice/goodsPrice/subOnegoodsprice?priceId=" + priceId;
        components.getMsg(suburl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {                
                //减少规格成功，继续后面逻辑
				var input_goodspriceId="input_"+priceId;
				$("#input_goodspriceId").val(($("#input_goodspriceId")-1));
				
			}else{
				alert("减一操作失败！");
			}
        });
	 }
	 
	 
	 //增加一个规格
	 function addOnegoodsprice(priceId){
		var addurl = apiUrl + "/front/goodsPrice/goodsPrice/addOnegoodsprice?priceId=" + priceId;
        components.getMsg(addurl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {                
                //减少规格成功，继续后面逻辑
				var input_goodspriceId="input_"+priceId;
				$("#input_goodspriceId").val(($("#input_goodspriceId")+1));
				
			}else{
				alert("加一操作失败！");
			}
        });
	 }
	 
	 //直接填写一个规格数量
	 function changeGoodsPriceNum(priceId){
		 var input_goodspriceId="input_"+priceId;
		var changeurl = apiUrl + "/front/goodsPrice/goodsPrice/changeGoodsPriceNum?buyPrice=" + $("#input_goodspriceId").val();
        components.getMsg(changeurl).done(function(msg) {
            var res = msg.res;
            if (res == 1) {                
                
			}else{
				alert("直接修改数量操作失败！");
			}
        });
	 }
	 
	 
 });
