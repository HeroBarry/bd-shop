package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.Receive;

import java.util.List;

public interface ReceiveMapper extends IBaseDao<Receive> {
    public Receive selectUserReceive(String openid);

    public Receive selectDefaultReceive(int userId);

    public List<Receive> selectReceive(int userId);
}