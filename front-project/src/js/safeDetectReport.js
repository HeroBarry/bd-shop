
define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
    addActiveClass();
    getData(components.GetQueryString("id"));
    function getData(id) {
        var url = apiUrl + "/front/article/article/getArticleById?articleId=" + id;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('article-tpl', msg);
                $('#article-info').html(html);
                $("#article-content").html(msg.obj.content);
            }
        });
    }
    function addActiveClass(){
        $(".weui-tabbar a").removeClass("weui-bar__item_on");
        $(".weui-tabbar a:eq(2)").addClass("weui-bar__item_on");
    }
	 addActiveClass(2);
	 
	//底部导航选中方法，index表示选中第几个，从0开始
    function addActiveClass(index){		
		 var childrens=$("#footer_tabbar").children();
		 childrens.each(function(index1,element1){
			 $(element1).removeClass("weui-bar__item_on");			
			 var imgAndp=$(element1).children();
			 var src=imgAndp[0].src;
			 if(src.indexOf("-") > 0 )   
			{   
				src=src.substring(0,src.indexOf("-"))+".png";
			}  
			//imgAndp[0].src=src;
			$(imgAndp[0]).attr("src",src);
			if(index==index1){
				 //字体变色
				$(element1).addClass("weui-bar__item_on"); 
				//imgAndp[0].src=src.replace(".","-green.");
				var	srcsub=src.substr(0,src.lastIndexOf("."))+"-green.png";
				$(imgAndp[0]).attr("src",srcsub);
			}			
		 });
    }
    $("#article-info").height($(window).height()-80);
	
});
