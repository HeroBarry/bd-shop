package com.bigdatan.b2c.service;

import java.util.List;

import com.bigdatan.b2c.entity.Receive;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.IBaseService;

public interface IReceiveService extends IBaseService<Receive> {
	/**
	 * 查询用户的默认收货地址
	 * 
	 * @param user
	 * @return
	 */
	Receive queryDefaultReceive(User user);
	/**
	 * @return 
	 * 更改用户默认为收货地址
	 */
	void setDefaultReceive(Receive receive, Integer receiveId) throws Exception;
	/**
	 * 添加地址
	 * @param receive
	 * @param user
	 * @throws Exception
	 */
	void addReceive(Receive receive, User user) throws Exception;
	
	/**
	 * 获取用户的收货地址列表
	 * @param user
	 * @return
	 */
	public List<Receive> queryReceive(User user);
	
}
