package com.bigdatan.b2c.vo;

import java.io.Serializable;

public class TotalPriveAndCategory implements Serializable {
    /**
     * 用户购物车中总金额
     */
    private int totalPrice;
    /**
     * 用户购物车中总的商品类
     */
    private int totalCategory;

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getTotalCategory() {
        return totalCategory;
    }

    public void setTotalCategory(int totalCategory) {
        this.totalCategory = totalCategory;
    }

}
