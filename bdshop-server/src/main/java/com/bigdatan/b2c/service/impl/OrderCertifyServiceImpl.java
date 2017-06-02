package com.bigdatan.b2c.service.impl;

import java.util.List;

import javax.annotation.Resource;

import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.OrderCertifyMapper;
import util.PageResult;


import com.bigdatan.b2c.entity.OrderCertify;
import com.bigdatan.b2c.entity.OrderDetails;
import com.bigdatan.b2c.service.impl.BaseServiceImpl;
import com.bigdatan.b2c.service.IOrderCertifyService;

/**
 * 订单收款凭证服务实现类
 */
public class OrderCertifyServiceImpl extends BaseServiceImpl<OrderCertify> implements IOrderCertifyService {

	@Resource
	private OrderCertifyMapper orderCertifyMapper;

	@Override
	protected IBaseDao<OrderCertify> getMapper() {
		return orderCertifyMapper;
	}

}
