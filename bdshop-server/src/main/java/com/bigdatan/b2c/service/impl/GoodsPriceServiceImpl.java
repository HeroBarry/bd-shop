package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.GoodsPrice;
import com.bigdatan.b2c.mapper.GoodsPriceMapper;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.service.IGoodsPriceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

;

/**
 *
 *
 * 商品规格服务实现类
 */
@Service
@Transactional
public class GoodsPriceServiceImpl extends BaseServiceImpl<GoodsPrice>
        implements IGoodsPriceService {
    @Resource
    private GoodsPriceMapper goodsPriceMapper;

    @Override
    public GoodsPrice findGoodsPriceByPriceIdAndState(int priceId, Byte state) {
        return goodsPriceMapper.findGoodsPriceByPriceIdAndState(priceId, state);
    }

    @Override
    public List<GoodsPrice> findAllByGoodsIdAndNotState(int goodsId,
                                                        Byte notState) {
        return goodsPriceMapper.findAllByGoodsIdAndNotState(goodsId, notState);
    }

    @Override
    public List<GoodsPrice> findAllNormalGoodsPriceByGoodsId(int goodsId) {
        return goodsPriceMapper.findAllByGoodsIdAndNotState(goodsId, (byte) 2);
    }

    @Override
    public GoodsPrice findNormalGoodsPriceByPriceId(int priceId) {
        return goodsPriceMapper.findGoodsPriceByPriceIdAndState(priceId,
                (byte) 1);
    }

    @Override
    protected IBaseDao<GoodsPrice> getMapper() {
        return goodsPriceMapper;
    }

}
