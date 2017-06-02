package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Article;
import com.bigdatan.b2c.mapper.ArticleMapper;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.service.IArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

;

@Service
@Transactional
public class ArticleServiceImpl extends BaseServiceImpl<Article> implements IArticleService {

    @Resource
    private ArticleMapper articleMapper;

    @Override
    protected IBaseDao<Article> getMapper() {
        return articleMapper;
    }

    @Override
    public int writeArticle(Article article) throws Exception {
        return articleMapper.insertSelective(article);
    }

    @Override
    public int editArticle(Article article) throws Exception {
        articleMapper.updateByPrimaryKey(article);
        return 0;
    }

}
