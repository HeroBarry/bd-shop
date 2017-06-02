//var apiUrl = "http://localhost:8080/", //配置全局api请求域名
var apiUrl = "http://123.56.254.10:8080/", //配置全局api请求域名
    listUrl = "",
    //apiUrlPic = "http://localhost:8080/";
    apiUrlPic = "http://123.56.254.10:8080/";
var settleAccountsPrice=500;//设置商品起送价格
if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0" || navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0") {
    alert("您的浏览器版本过低，请下载IE9以上版本或使用其他浏览器");
    window.close();
}
requirejs.config({
    paths: {
        common: '/src/js/common', //前端官网共用js
        membersCommon: '/src/js/members_common', //会员中心共用js
        manageCommon: '/src/js/manage_common', //管理中心共用js
        components: '/src/js/components', //网站共用组件
        jquery: '/src/libs/jquery-1.11.1.min', //jquery
        jqueryCookie: '/src/libs/jquery.cookie', //jquery.cookie
        bootstrap: '/src/libs/bootstrap-3.3.5-dist/js/bootstrap.min', //bootstrap
        cityselect: '/src/libs/jquery.cityselect', //地区插件
        paginator: '/src/libs/bootstrap-paginator.min', //分页插件
        ZeroClipboard: "/src/libs/utf8-jsp/third-party/zeroclipboard/ZeroClipboard", //百度富文本
        ueditorConfig: "/src/libs/utf8-jsp/ueditor.config", //百度富文本
        ueditorAll: "/src/libs/utf8-jsp/uemy", //百度富文本
        bdlang: "/src/libs/utf8-jsp/lang/zh-cn/zh-cn", //百度富文本
        template: '/src/libs/template',
        jqueryValidate: "/src/libs/jquery.validate.min",
        timepicker: "/src/libs/bootstrap-datetimepicker.min",
        swiper: "/src/libs/swiper.jquery.min",
        easings: "/src/libs/jquery.easings.min",
        scrolloverflow: "/src/libs/scrolloverflow.min",
        fullPage: "/src/libs/jquery.fullPage.min",
        weui:"/src/libs/jquery-weui.min",
        cityPicker:"/src/libs/city-picker.min",
        zepto:"/src/libs/zepto.min",
        event:"/src/libs/event",
        touch:"/src/libs/touch",
        fastclick:"/src/libs/fastclick",
		highcharts:"/src/libs/highcharts",
        hammer:"/src/libs/hammer.min",
        updown:"/src/libs/updown",
        lazyImg:'/src/libs/lazyimg'
    },
    shim: {
        paginator: ["jquery"],
        common: ["jquery"],
        components: ["jquery"],
        bootstrap: ["jquery"],
        swiper: ["jquery"],
        weui: ["jquery"],
        easings:["jquery"],
        fullPage:["jquery"],
        event:["zepto"],
        touch:["zepto"]
    }
});

//按scripts标签id加载相应脚本
define(["jquery"], function(jquery) {
    var module = $("#script").attr("require-module");
    if (module !== undefined && module !== "") {
        require([module]);
    }
});
