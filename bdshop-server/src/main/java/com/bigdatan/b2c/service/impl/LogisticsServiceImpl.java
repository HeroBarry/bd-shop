package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Logistics;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.LogisticsMapper;
import com.bigdatan.b2c.service.ILogisticsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

;

@Service
@Transactional
public class LogisticsServiceImpl extends BaseServiceImpl<Logistics> implements ILogisticsService {

    @Resource
    LogisticsMapper logisticsMapper;

    @Override
    protected IBaseDao<Logistics> getMapper() {
        return logisticsMapper;
    }

    @Override
    public List<Logistics> getListLogistics() {
        return logisticsMapper.getListLogistics();
    }

}
