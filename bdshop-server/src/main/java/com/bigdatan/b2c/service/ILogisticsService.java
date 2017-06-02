package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.Logistics;

import java.util.List;

public interface ILogisticsService extends IBaseService<Logistics> {
    public List<Logistics> getListLogistics();
}
