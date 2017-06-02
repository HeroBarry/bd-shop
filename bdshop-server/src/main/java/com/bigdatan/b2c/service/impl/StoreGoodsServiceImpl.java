package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.StoreGoods;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.StoreGoodsMapper;
import com.bigdatan.b2c.service.IStoreGoodsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

;
;
@Transactional
@Service
public class StoreGoodsServiceImpl extends BaseServiceImpl<StoreGoods>
        implements IStoreGoodsService {

    @Resource
    private StoreGoodsMapper storeGoodsMapper;

    @Override
    protected IBaseDao<StoreGoods> getMapper() {
        return storeGoodsMapper;
    }

    @Override
    public List<StoreGoods> queryAllStoreGoodsByUserId(StoreGoods storeGoods) {
        return storeGoodsMapper.queryAllStoreGoodsByUserId(storeGoods);
    }

    @Override
    public StoreGoods queryStoreGoodsByUserIdAndGoodsId(StoreGoods storeGoods) {
        return storeGoodsMapper.queryStoreGoodsByUserIdAndGoodsId(storeGoods);
    }

}
