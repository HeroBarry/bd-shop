package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.StoreGoods;

import java.util.List;

public interface IStoreGoodsService extends IBaseService<StoreGoods> {
    /**
     * 依据用户id，查询用户所有收藏的条目
     *
     * @param storeGoods
     * @return
     */
    public List<StoreGoods> queryAllStoreGoodsByUserId(StoreGoods storeGoods);

    /**
     * 依据用户id和商品id，查询收藏条目
     *
     * @param storeGoods
     * @return
     */
    public StoreGoods queryStoreGoodsByUserIdAndGoodsId(StoreGoods storeGoods);

}
