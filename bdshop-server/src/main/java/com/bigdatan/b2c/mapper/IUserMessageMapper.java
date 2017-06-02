package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.UserMessage;

import java.util.List;
import java.util.Map;

public interface IUserMessageMapper extends IBaseDao<UserMessage> {
    int deleteByPrimaryKey(Integer userMessageId);

    int insert(UserMessage record);

    int insertSelective(UserMessage record);

    UserMessage selectByPrimaryKey(Integer userMessageId);

    int updateByPrimaryKeySelective(UserMessage record);

    int updateByPrimaryKey(UserMessage record);

    public int addMessageRecord(List<UserMessage> list);

    public int getNoReadCount(int userId);

    /**
     * @param userId
     * @return 获取消息已读数和未读数
     */
    public List<Integer> getMessageCount(int userId);

    public List<Map<String, Object>> getUserListByMessageId(Integer messageId);

    UserMessage getOneById(Integer userMessageId);
}