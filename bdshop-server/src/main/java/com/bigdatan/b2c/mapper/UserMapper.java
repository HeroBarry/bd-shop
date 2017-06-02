package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper extends IBaseDao<User> {
    public User getOneByOpenid(String openid);

    public User getOneByPhone(String phone);

    public int updatePhone(@Param("phone") String phone, @Param("openid") String openid);

    public int getCountByPhone(String phone);

    String getAllFrontUser();

    List<User> getUsersByPage(String userIds);
}