package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.AdPosition;
import com.bigdatan.b2c.mapper.AdPositionMapper;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.service.IAdPositionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

;

/**
 * 广告位置服务接口实现
 */
@Service
@Transactional
public class AdPositionServiceImpl extends BaseServiceImpl<AdPosition> implements IAdPositionService {
    @Resource
    private AdPositionMapper adPositionMapper;

    @Override
    protected IBaseDao<AdPosition> getMapper() {
        return this.adPositionMapper;
    }

}
