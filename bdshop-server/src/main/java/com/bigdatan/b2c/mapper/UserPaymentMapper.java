package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.UserPayment;

import java.util.List;

/**
 * 用户优惠
 */
public interface UserPaymentMapper extends IBaseDao<UserPayment> {
    List<UserPayment> selectByUserId(int userId);
}
