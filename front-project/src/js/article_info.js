
define(['jquery', "components", "common", "template"], function(jquery, components, common, template) {
    getData(components.GetQueryString("id"));
    function getData(id) {
        var url = apiUrl + "/front/article/article/getArticleById?articleId=" + id;
        components.getMsg(url).done(function (msg) {
            var res = msg.res;
            if (res == 1) {
                var html = template('article-tpl', msg);
                document.getElementById('article-info').innerHTML = html;
            }
        });
    }
});
