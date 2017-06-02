package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Ad;
import com.bigdatan.b2c.mapper.AdMapper;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.service.IAdService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

;

/**
 * 广告服务接口实现
 */
@Service
@Transactional
public class AdServiceImpl extends BaseServiceImpl<Ad> implements IAdService {
    @Resource
    private AdMapper adMapper;

    @Override
    protected IBaseDao<Ad> getMapper() {
        return this.adMapper;
    }
}
