package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.Message;

import java.util.List;


public interface IMessageService extends IBaseService<Message> {

    /**
     * @return 获取最新动态的消息
     */
    public List<Message> getMessageLevel(Integer userId);
}
