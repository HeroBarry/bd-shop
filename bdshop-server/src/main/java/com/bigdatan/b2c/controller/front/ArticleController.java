package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Article;
import com.bigdatan.b2c.service.IArticleService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

;

@RestController
@RequestMapping("/front/article/article")
public class ArticleController extends AbstractController {
    @Resource
    private IArticleService articleService;
    /**
     * 文章列表
     */
    /**
     * @param page
     * @param article
     * @param request
     * @return
     */

    //@GetMapping("/getArticleByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getArticleByPage")
    public JsonResponse<PageResult<Article>> getGoodsByPage(
            PageResult<Article> page, Article article, HttpServletRequest request) {
        JsonResponse<PageResult<Article>> result = new JsonResponse<PageResult<Article>>();
        articleService.queryByPageFront(page, article);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }
    /**
     * 文章详情
     */
    /**
     * @param articleId
     * @param request
     * @return
     */

    //@GetMapping("/getArticleById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getArticleById")
    public JsonResponse<Article> getGoodsById(Integer articleId,
                                              HttpServletRequest request) {
        JsonResponse<Article> result = new JsonResponse<Article>();
        Article article = articleService.selectByPrimaryKey(articleId);
        if (article != null) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(article);
        }
        return result;
    }
}
