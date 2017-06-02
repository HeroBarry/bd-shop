package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.Logistics;

import java.util.List;

public interface LogisticsMapper extends IBaseDao<Logistics> {
    //搜索物流列表
    public List<Logistics> getListLogistics();

    public Logistics getFirstLogistics();
}