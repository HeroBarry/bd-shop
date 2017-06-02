package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.ProductCategory;

import java.util.List;

public interface ProductCategoryMapper extends IBaseDao<ProductCategory> {
    /**
     * 通过商品种类id，查询所有一级子种类
     *
     * @param categoryId 商品种类id
     * @param notState   不包含的状态
     * @return 一级子商品种类列表
     */
    public List<ProductCategory> getChildCategoryByCategoryId(int categoryId, int notState);

    /**
     * 通过商品种类id，商品种类状态 查询所有一级子种类
     *
     * @param categoryId 商品种类id
     * @param state      包含的状态
     * @return
     */
    public List<ProductCategory> getChildCategoryByCategoryIdAndState(int categoryId, int state);

    /**
     * 获取所有有效的一级商品分类
     *
     * @param notState 不包含的状态
     * @return
     */
    public List<ProductCategory> getFirstLevelCategory(int notState);

    /**
     * 获取所有有效的一级商品分类
     *
     * @param State 包含的状态
     * @return
     */
    public List<ProductCategory> getFirstLevelCategoryByState(int State);

    /**
     * 获取首页的一级商品分类，按照更新时间倒序取前9个推荐的一级分类
     *
     * @return
     */
    public List<ProductCategory> getHomePageCategory();
}