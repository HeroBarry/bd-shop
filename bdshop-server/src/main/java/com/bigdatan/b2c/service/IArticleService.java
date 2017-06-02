package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.Article;

public interface IArticleService extends IBaseService<Article> {
    int writeArticle(Article article) throws Exception;

    int editArticle(Article article) throws Exception;
}
