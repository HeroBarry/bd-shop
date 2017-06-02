package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.Message;

import java.util.List;

public interface IMessageMapper extends IBaseDao<Message> {
    int deleteByPrimaryKey(Integer messageId);

    int insert(Message record);

    int insertSelective(Message record);

    Message selectByPrimaryKey(Integer messageId);

    int updateByPrimaryKeySelective(Message record);

    int updateByPrimaryKeyWithBLOBs(Message record);

    int updateByPrimaryKey(Message record);

    public List<Message> getMessageLevel(Integer userId);
}