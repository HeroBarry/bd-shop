package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.JoinOrder;

public interface JoinOrderMapper extends IBaseDao<JoinOrder> {
	JoinOrder selectByJoinOrderNumber(JoinOrder joinOrder);
}