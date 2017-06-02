package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.Payment;
import com.bigdatan.b2c.entity.User;

import java.util.List;

/**
 *
 *
 * 付款方式接口定义
 */
public interface IPaymentService extends IBaseService<Payment> {

    /**
     * 查询用户所拥有的付款方式，包括通用的和拥有的高级付款方式
     *
     * @param user 用户对象
     * @return
     */
    List<Payment> queryUserPayment(User user);

}
