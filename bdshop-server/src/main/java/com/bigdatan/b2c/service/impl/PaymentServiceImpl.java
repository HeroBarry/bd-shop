package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Payment;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.PaymentMapper;
import com.bigdatan.b2c.service.IPaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

;

/**
 * 付款方式接口实现类
 */
@Transactional
@Service
public class PaymentServiceImpl extends BaseServiceImpl<Payment> implements IPaymentService {
    @Resource
    private PaymentMapper paymentMapper;

    @Override
    protected IBaseDao<Payment> getMapper() {
        return this.paymentMapper;
    }

    @Override
    public List<Payment> queryUserPayment(User user) {
        return paymentMapper.queryUserPayment(user.getUserId());
    }
}
