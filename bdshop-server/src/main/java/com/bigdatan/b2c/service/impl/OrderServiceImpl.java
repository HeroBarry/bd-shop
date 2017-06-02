package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.*;
import com.bigdatan.b2c.mapper.*;
import com.bigdatan.b2c.service.IOrderService;
import com.bigdatan.b2c.service.IShoppingCartService;
import com.bigdatan.b2c.vo.OrderAdminSearchVO;
import com.github.pagehelper.PageHelper;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import util.PageResult;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl extends BaseServiceImpl<Order> implements IOrderService {
	private Logger lo = Logger.getLogger(OrderServiceImpl.class);
	@Resource
	private OrderMapper orderMapper;
	@Resource
	private OrderDetailsMapper orderDetailsMapper;
	@Resource
	private OrderCertifyMapper orderCertifyMapper;
	@Resource
	private UserPrivilegeMapper userPrivilegeMapper;
	@Resource
	private GoodsMapper goodsMapper;
	@Resource
	private GoodsPriceMapper goodsPriceMapper;
	@Resource
	private ShoppingCartMapper shoppingCartMapper;
	@Resource
	private IShoppingCartService shoppingCartService;
	@Resource
	private SerialNumberService serialNumberService;
	@Resource
	private JoinOrderMapper joinOrderMapper;

	@Override
	protected IBaseDao<Order> getMapper() {
		return orderMapper;
	}

	@Override
	public Order getOne(String orderNumber) {
		return orderMapper.getOne(orderNumber);
	}

	// 下订单 事物操作
	// 1、在订单表增加订单记录 2、在订单详情表批量添加订单详情记录 3、处理购物车的记录
	@Override
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false, noRollbackFor = { Exception.class })
	public String addBatch(Order order) throws Exception {
		String orderNum = serialNumberService.getNum();
		if (order.getPayment().getPaymentId() == 1) {
			orderNum = "H" + orderNum;
		} else if (order.getPayment().getPaymentId() == 2) {
			orderNum = "S" + orderNum;
		} else if (order.getPayment().getPaymentId() == 3) {
			orderNum = "Y" + orderNum;
		}
		order.setOrderNumber(orderNum);
		Date now = new Date();
		order.setCreateTime(now);
		order.setUpdateTime(now);
		order.setPayState((byte) 1);// 设置状态 未支付
		order.setDelState((byte) 2);

		User user = order.getUser();
		if (null == user) {
			// TODO 添加异常信息
			throw new Exception("user is null...");
		}
		// 获取用户的优惠信息
		UserPrivilege userPrivilege = userPrivilegeMapper.selectByUserId(user.getUserId());
		boolean isWholeSalePrice = false;
		boolean isDiscount = false;
		int discount = 100;
		if (null != userPrivilege) {
			Byte isWholeSalePriceByte = userPrivilege.getIsWholeSalePrice();
			if (null != isWholeSalePriceByte && isWholeSalePriceByte == 1) {
				isWholeSalePrice = true;
			}
			Byte isDiscountByte = userPrivilege.getIsDiscount();
			if (null != isDiscountByte && isDiscountByte == 1) {
				isDiscount = true;
			}
			Integer discountInt = userPrivilege.getDiscount();
			if (isDiscount && null != discountInt) {
				if (discountInt > 100) {
					discount = 100;
				} else if (discountInt <= 0) {
					discount = 0;
				} else {
					discount = discountInt;
				}
			}
		}

		int totalAmount = 0;

		int price = 0;
		int detailsAmount = 0;

		int goodsId = 0;
		int priceId = 0;
		int num = 0;

		Goods goods = null;
		GoodsPrice goodsPrice = null;

		List<OrderDetails> orderDetailsList = order.getOrderDetailsList();
		if (null != orderDetailsList) {
			for (OrderDetails orderDetails : order.getOrderDetailsList()) {
				goodsId = orderDetails.getGoodsId();
				priceId = orderDetails.getPriceId();
				num = orderDetails.getNum();

				// 查询商品信息
				goods = goodsMapper.selectByPrimaryKey(goodsId);
				goodsPrice = goodsPriceMapper.selectByPrimaryKey(priceId);

				if (isWholeSalePrice) {
					price = goodsPrice.getWholesalePrice();
				} else {
					price = goodsPrice.getRetailPrice();
				}

				detailsAmount = price * num;
				totalAmount += detailsAmount;

				// 订单项信息
				orderDetails.setOrderNumber(order.getOrderNumber());
				orderDetails.setGoodsName(goods.getGoodsName());
				orderDetails.setUnitName(goodsPrice.getUnitName());
				orderDetails.setUnitPrice(price);
				orderDetails.setImage(goods.getImage());
				orderDetails.setDetailsAmount(detailsAmount);
				orderDetails.setCreateTime(new Date());
			}
		}
		int paidAmount = totalAmount * discount / 100;
		int discountAmount = totalAmount - paidAmount;

		order.setTotalAmount(totalAmount);
		order.setPaidAmount(paidAmount);
		order.setDiscountAmount(discountAmount);

		orderMapper.insertSelective(order);
		if (null != orderDetailsList) {
			for (OrderDetails orderDetails : order.getOrderDetailsList()) {
				orderDetails.setOrderId(order.getOrderId());
			}
		}
		orderDetailsMapper.insertBatch(order.getOrderDetailsList());

		List<ShoppingCart> shoppingCarts = shoppingCartService.queryAllBuyShoppingCartByUserId(user.getUserId());
		// 处理购物车信息，如果购物车存在该id，并且数量不大于购买的数量，则删除该记录；如果购物车存在该id，但数量大于购买的数量，则数量减去购买的数量，更新该记录；否则，不处理
		if (null != orderDetailsList) {
			for (OrderDetails orderDetails : order.getOrderDetailsList()) {
				goodsId = orderDetails.getGoodsId();
				priceId = orderDetails.getPriceId();
				num = orderDetails.getNum();

				if (null != shoppingCarts) {
					for (ShoppingCart shoppingCart : shoppingCarts) {
						if ((shoppingCart.getGoodsId() == goodsId) && (shoppingCart.getPriceId() == priceId)) {
							if (shoppingCart.getQuantity() <= num) {
								// 删除该购物车信息
								shoppingCartService.delete(shoppingCart);
							} else {
								// 更新 购物车的数量
								shoppingCart.setQuantity(shoppingCart.getQuantity() - num);
								shoppingCartService.updateByPrimaryKeySelective(shoppingCart);
							}
						}
					}
				}
			}
		}
		return orderNum;
	}

	@Override
	public Order getOrderByNumber(String orderNumber) {
		return orderMapper.getOrderByNumber(orderNumber);
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = { Exception.class })
	public Integer updateAndAddCertify(Order order, OrderCertify orderCertify) throws Exception {
		orderMapper.updateByPrimaryKeySelective(order);
		orderCertifyMapper.insertSelective(orderCertify);
		return 1;
	}

	@Override
	public Integer getTotalAmountByPaystate(Integer payState) throws Exception {
		Integer paidAmount = orderMapper.getAmountByPaystate(payState);
		return paidAmount;
	}

	@Override
	public Integer getCountByPaystate(Integer payState) throws Exception {
		Integer count = orderMapper.getCountByPaystate(payState);
		return count;
	}

	@Override
	public String joinOrder(JoinOrder joinOrder) throws Exception {
		String orderNum = serialNumberService.getNum();
		orderNum = "Y" + orderNum;
		joinOrder.setJoinOrderNumber(orderNum);
		joinOrderMapper.insertSelective(joinOrder);
		return orderNum;
	}

	@Override
	public JoinOrder getJoinOrderByNumber(String orderNumber) {
		JoinOrder joinOrder = new JoinOrder();
		joinOrder.setJoinOrderNumber(orderNumber);
		return joinOrderMapper.selectByJoinOrderNumber(joinOrder);
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = { Exception.class })
	public void notifyAll(String orderNumbers, String paymentSeq) throws Exception {
		lo.info("notifyAll(): orderNumbers:" + orderNumbers + ", paymentSeq:" + paymentSeq);
		Order order = null;
		if (orderNumbers.indexOf(",") > 0) {
			String[] strs = orderNumbers.split(",");
			for (String str : strs) {
				order = new Order();
				order.setOrderNumber(str);
				order.setPaymentSeq(paymentSeq);
				order.setUpdateTime(new Date());
				// order.setState((byte)2);//更新订单 为支付成功
				order.setPayState((byte) 2);// 更新订单 为支付成功
				try {
					orderMapper.updateByPrimaryKeySelective(order);
				} catch (Exception e) {
					lo.error("更新订单失败 ", e);
					throw new Exception("更新订单失败 ");
				}
			}
		} else {
			order = new Order();
			order.setOrderNumber(orderNumbers);
			order.setPaymentSeq(paymentSeq);
			order.setUpdateTime(new Date());
			// order.setState((byte)2);//更新订单 为支付成功
			order.setPayState((byte) 2);// 更新订单 为支付成功
			try {
				orderMapper.updateByPrimaryKeySelective(order);
			} catch (Exception e) {
				lo.error("更新订单失败 ", e);
				throw new Exception("更新订单失败 ");
			}
		}
		lo.info("notifyAll()结束...");
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = { Exception.class })
	public void buyGoodsAgain(Order order, User user) throws Exception {
		if (user == null) {
			lo.error("用户为空");
			throw new Exception("用户为空");
		}
		int userId = user.getUserId();
		if (null != order) {
			List<OrderDetails> orderDetailsList = order.getOrderDetailsList();
			if (null != orderDetailsList) {
				for (OrderDetails orderDetails : orderDetailsList) {
					OrderDetails details = orderDetailsMapper.selectByPrimaryKey(orderDetails.getOrderDetailsId());
					Goods goods = goodsMapper.selectByPrimaryKey(details.getGoodsId());
					if (null == goods || goods.getDelState() != 1) {
						if (goods.getIsMarketable() != 1) {
							lo.error("商品未上架" + goods.getGoodsId());
							throw new Exception("商品未上架");
						} else {
							lo.error("商品不存在");
							throw new Exception("商品不存在");
						}

					}

					ShoppingCart shoppingCart = new ShoppingCart();
					shoppingCart.setUserId(userId);
					shoppingCart.setPriceId(details.getPriceId());

					shoppingCart = shoppingCartMapper.queryShoppingCartByUserIdAndPriceId(shoppingCart);
					if (null == shoppingCart) {
						// 新增
						ShoppingCart cart = new ShoppingCart();
						cart.setGoodsId(details.getGoodsId());
						cart.setIsBuy((byte) 1);
						cart.setPriceId(details.getPriceId());
						cart.setQuantity(details.getNum());
						cart.setUserId(userId);
						cart.setCreateTime(new Date());
						cart.setUpdateTime(new Date());

						try {
							shoppingCartMapper.insertSelective(cart);
						} catch (Exception e) {
							lo.error("添加到购物车失败", e);
							throw new Exception("添加到购物车失败");
						}
					} else {
						// 更新
						shoppingCart.setQuantity(shoppingCart.getQuantity() + details.getNum());
						shoppingCart.setUpdateTime(new Date());

						shoppingCartMapper.updateByPrimaryKeySelective(shoppingCart);
					}
				}
			}
		}
	}

	@Override
	public PageResult<Order> getPageByOrderAdminSearchVO(PageResult<Order> t,OrderAdminSearchVO entity)
			throws Exception {
		if (entity.getOrderNumber() != null &&entity.getOrderNumber().length()>0) {
			entity.setOrderNumber("%" + entity.getOrderNumber() + "%");
		}
		if (entity.getPhone() != null &&entity.getPhone().length()>0) {
			entity.setPhone("%" + entity.getPhone() + "%");
		}
		
		int pageNo=t.getPageNo();
    	int pageSize=t.getPageSize();
		pageNo = pageNo == 0?1:pageNo;
		pageSize = pageSize == 0?10:pageSize;
		PageHelper.startPage(pageNo,pageSize); 
		
		return PageResult.toPageResult(orderMapper.getPageByOrderAdminSearchVO(entity),t);
	}

	@Override
	public List<Order> getPageExportByOrderAdminSearchVO(
			OrderAdminSearchVO entity) throws Exception {
		if (entity.getOrderNumber() != null &&entity.getOrderNumber().length()>0) {
			entity.setOrderNumber("%" + entity.getOrderNumber() + "%");
		}
		if (entity.getPhone() != null &&entity.getPhone().length()>0) {
			entity.setPhone("%" + entity.getPhone() + "%");
		}
		
		return orderMapper.getPageExportByOrderAdminSearchVO(entity);
	}
}
