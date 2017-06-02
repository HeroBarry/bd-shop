package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Message;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.IMessageMapper;
import com.bigdatan.b2c.service.IMessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

;

@Service
@Transactional
public class MessageServiceImpl extends BaseServiceImpl<Message> implements IMessageService {
    @Resource
    private IMessageMapper messageMapper;

    @Override
    protected IBaseDao<Message> getMapper() {
        return messageMapper;
    }

    @Override
    public List<Message> getMessageLevel(Integer userId) {
        return messageMapper.getMessageLevel(userId);
    }

}
