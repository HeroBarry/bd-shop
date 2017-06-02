package com.bigdatan.b2c.mapper;

import java.util.List;

import com.bigdatan.b2c.entity.Goods;
import com.bigdatan.b2c.vo.QueryGoodsAdminVO;
import com.bigdatan.b2c.entity.OrderDetails;
import com.bigdatan.b2c.vo.OrderDetailsAdminSearchVO;

public interface OrderDetailsMapper extends IBaseDao<OrderDetails> {
	public Integer insertBatch(List<OrderDetails> list);
	
	/**
	 * 依据商品订单查询类，查询商品订单详细列表
	 * @param entity
	 * @return
	 */
	public List<OrderDetails> getPageByOrderDetailsAdminSearchVO(OrderDetailsAdminSearchVO entity);
	
	
	/**
	 * 依据商品订单查询类，查询商品订单详细报表
	 * @param entity
	 * @return
	 */
	public List<OrderDetails> getDetailReportByOrderDetailsAdminSearchVO(OrderDetailsAdminSearchVO entity);
	
	/**
	 * 依据商品订单查询类，获取商品销售总额
	 * @param entity
	 * @return
	 */
	public long getTotalDetailsAmountByOrderDetailsAdminSearchVO(OrderDetailsAdminSearchVO entity);
	
	/**
	 * 依据商品订单查询类，获取商品销售总数
	 * @param entity
	 * @return
	 */
	public long getTotalNumAmountByOrderDetailsAdminSearchVO(OrderDetailsAdminSearchVO entity);

}