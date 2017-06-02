package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.entity.UserPayment;
import com.bigdatan.b2c.entity.UserPrivilege;
import util.PageResult;

import java.util.List;

public interface IUserService extends IBaseService<User> {
    public User getOneByOpenid(String openid);

    public User getOneByPhone(String phone);

    public int updatePhone(String tel, String openid);

    public int getCountByPhone(String phone);

    void grantPrivilege(UserPrivilege userPrivilege, List<UserPayment> userPayments) throws Exception;

    String getAllFrontUser();

    PageResult<User> getUsersByUserIds(PageResult<User> page, String userIds);

}
