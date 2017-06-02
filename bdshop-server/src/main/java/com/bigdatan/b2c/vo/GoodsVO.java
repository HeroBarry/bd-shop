package com.bigdatan.b2c.vo;

import com.bigdatan.b2c.entity.Goods;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.io.Serializable;
import java.util.Date;

public class GoodsVO implements Serializable {

    private int vo_countGoodsPrice;// 商品的规格总数

    private int vo_shoppingCartNum;// 商品只有一个规格时，保存购物车中该规格的数量
    private int vo_retailPrice;// 保存多少价格起，只有一个规格时也是该规格价格
    private int vo_priceId;// 只有一个规格时保存规格id
    private String vo_unitName;// 只有一个规格时计量单位名称
    /**
     * 主键
     */
    private int goodsId;
    /**
     * 对应商品种类表的id
     */
    private int categoryId;
    /**
     * 商品名称
     */
    private String goodsName;

    /**
     * 别名
     */
    private String nickName;
    /**
     * 商品主图
     */
    private String image;
    /**
     * 状态 ：1.未删除 2.已删除
     */
    private Byte delState;

    /**
     * 简要描述
     */
    private String simpleDescribe;

    /**
     * 详细描述
     */
    private String detailDescribe;

    /**
     * 上架标志 1 已上架 0 未上架
     */
    private int isMarketable;
    /**
     * 推荐 1是 2否 (保留，暂未使用)
     */
    private Byte recommend;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")

    private Date createTime;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    /**
     * 创建者id
     */
    private int adminId;

    public int getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(int goodsId) {
        this.goodsId = goodsId;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Byte getDelState() {
        return delState;
    }

    public void setDelState(Byte delState) {
        this.delState = delState;
    }

    public String getSimpleDescribe() {
        return simpleDescribe;
    }

    public void setSimpleDescribe(String simpleDescribe) {
        this.simpleDescribe = simpleDescribe;
    }

    public String getDetailDescribe() {
        return detailDescribe;
    }

    public void setDetailDescribe(String detailDescribe) {
        this.detailDescribe = detailDescribe;
    }

    public int getIsMarketable() {
        return isMarketable;
    }

    public void setIsMarketable(int isMarketable) {
        this.isMarketable = isMarketable;
    }

    public Byte getRecommend() {
        return recommend;
    }

    public void setRecommend(Byte recommend) {
        this.recommend = recommend;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
    }

    public int getVo_countGoodsPrice() {
        return vo_countGoodsPrice;
    }

    public void setVo_countGoodsPrice(int vo_countGoodsPrice) {
        this.vo_countGoodsPrice = vo_countGoodsPrice;
    }

    public int getVo_shoppingCartNum() {
        return vo_shoppingCartNum;
    }

    public void setVo_shoppingCartNum(int vo_shoppingCartNum) {
        this.vo_shoppingCartNum = vo_shoppingCartNum;
    }

    public int getVo_retailPrice() {
        return vo_retailPrice;
    }

    public void setVo_retailPrice(int vo_retailPrice) {
        this.vo_retailPrice = vo_retailPrice;
    }

    public int getVo_priceId() {
        return vo_priceId;
    }

    public void setVo_priceId(int vo_priceId) {
        this.vo_priceId = vo_priceId;
    }

    public String getVo_unitName() {
        return vo_unitName;
    }

    public void setVo_unitName(String vo_unitName) {
        this.vo_unitName = vo_unitName;
    }

    public GoodsVO(Goods goods) {
        this.adminId = goods.getAdminId();
        this.categoryId = goods.getCategoryId();
        this.createTime = goods.getCreateTime();
        this.delState = goods.getDelState();
        this.detailDescribe = goods.getDetailDescribe();
        this.goodsId = goods.getGoodsId();
        this.goodsName = goods.getGoodsName();
        this.image = goods.getImage();
        this.isMarketable = goods.getIsMarketable();
        this.nickName = goods.getNickName();
        this.recommend = goods.getRecommend();
        this.simpleDescribe = goods.getSimpleDescribe();
        this.updateTime = goods.getUpdateTime();
    }
}