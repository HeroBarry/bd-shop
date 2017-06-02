package com.bigdatan.b2c.controller.front;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import com.bigdatan.b2c.mapper.LogisticsMapper;
import com.bigdatan.b2c.mapper.ReceiveMapper;
import com.bigdatan.b2c.mapper.UserMapper;
import com.bigdatan.b2c.service.IOrderDetailsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Goods;
import com.bigdatan.b2c.entity.Logistics;
import com.bigdatan.b2c.entity.JoinOrder;
import com.bigdatan.b2c.entity.Order;
import com.bigdatan.b2c.entity.OrderDetails;
import com.bigdatan.b2c.vo.OrderVo;
import com.bigdatan.b2c.entity.Payment;
import com.bigdatan.b2c.entity.Receive;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.IGoodsService;
import com.bigdatan.b2c.service.IOrderService;
import com.bigdatan.b2c.service.IShoppingCartService;

import constant.SystemCode;

@Controller
@RequestMapping("/front/order/order")
public class OrderController extends AbstractController {
	@Resource
	private IOrderService orderService;
	@Resource
	private IOrderDetailsService orderDetailsService;

	@Resource
	private ReceiveMapper receiveMapper;

	@Resource
	private UserMapper userMapper;

	@Resource
	private IGoodsService goodsService;

	@Resource
	private LogisticsMapper logisticsMapper;

	/**
	 *
	 * @param request
	 * @param order
	 * @return 提交订单
	 * @throws IllegalAccessException
	 */
	@ResponseBody
	@RequestMapping("/addOrder")
	public JsonResponse<String> addOrder(HttpServletRequest request, Order order) {
		JsonResponse<String> result = new JsonResponse<String>(
				SystemCode.FAILURE);
		User user = SessionUtil.getUser(request);
		if (null == user) {
			result.setRes(SystemCode.NO_LOGIN);
			return result;
		}
		order.setUser(user);
		try {
			String orderNum = orderService.addBatch(order);
			result.setRes(SystemCode.SUCCESS);
			result.setResult(orderNum);// 订单号
		} catch (Exception e) {
			logError("下订单异常", e);
		}
		return result;
	}

	/**
	 * 订单列表
	 */
	@ResponseBody
	@RequestMapping("/getOrderByPage")
	public JsonResponse<PageResult<Order>> getOrderByPage(
			PageResult<Order> page, Order order, HttpServletRequest request) {
		JsonResponse<PageResult<Order>> result = new JsonResponse<PageResult<Order>>();
		User user = SessionUtil.getUser(request);
		if (null == user) {
			result.setRes(SystemCode.NO_LOGIN);
			return result;
		}
		order.setUser(user);
		String payStateStr = request.getParameter("payState");
		String paymentIdStr = request.getParameter("paymentId");
		String logisticsStateStr = request.getParameter("logisticsState");
		if (!StringUtils.isBlank(payStateStr)) {
			Byte payState = Byte.parseByte(payStateStr);
			if (payState != 0) {
				order.setPayState((Byte) payState);
			}
		}
		if (!StringUtils.isBlank(paymentIdStr)) {
			Integer paymentId = Integer.parseInt(paymentIdStr);
			if (paymentId != 0) {
				Payment payment = new Payment();
				payment.setPaymentId(paymentId);
				order.setPayment(payment);
			}
		}
		if (!StringUtils.isBlank(logisticsStateStr)) {
			Byte logisticsState = Byte.parseByte(logisticsStateStr);
			if (logisticsState != 0) {
				order.setLogisticsState((Byte) logisticsState);
			}
		}
		orderService.queryByPageFront(page, order);

		List<Order> orderList = new ArrayList<Order>();
		if(null != page && null != page.getDataList()){
			for(Order temp : page.getDataList()){
				String orderNumber = temp.getOrderNumber();
				OrderDetails orderDetails = new OrderDetails();
				orderDetails.setOrderNumber(orderNumber);

				List<OrderDetails> details = orderDetailsService.getAllBySelect(orderDetails);
				temp.setOrderDetailsList(details);
				orderList.add(temp);
			}
			if(orderList.size() > 0){
				page.setDataList(orderList);
			}
		}
		if (page.getTotal() != 0) {
			result.setRes(SystemCode.SUCCESS);
			result.setObj(page);
		} else {
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 获取累计未结算的订单
	 */
	@ResponseBody
	@RequestMapping("/getLJOrderByPage")
	public JsonResponse<PageResult<Order>> getLJOrderByPage(
			PageResult<Order> page, Order order, HttpServletRequest request) {
		JsonResponse<PageResult<Order>> result = new JsonResponse<PageResult<Order>>();
		User user = SessionUtil.getUser(request);
		if (null == user) {
			result.setRes(SystemCode.NO_LOGIN);
			return result;
		}
		order.setUser(user);
		order.setPayState((byte) 1);
		Payment payment = new Payment();
		payment.setPaymentId(3);
		order.setPayment(payment);
		orderService.queryByPageFront(page, order);

		List<Order> orderList = new ArrayList<Order>();
		if(null != page && null != page.getDataList()){
			for(Order temp : page.getDataList()){
				String orderNumber = temp.getOrderNumber();
				OrderDetails orderDetails = new OrderDetails();
				orderDetails.setOrderNumber(orderNumber);

				List<OrderDetails> details = orderDetailsService.getAllBySelect(orderDetails);
				temp.setOrderDetailsList(details);
				orderList.add(temp);
			}
			if(orderList.size() > 0){
				page.setDataList(orderList);
			}
		}

		if (page.getTotal() != 0) {
			result.setRes(SystemCode.SUCCESS);
			result.setObj(page);
		} else {
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 订单详情
	 */
	@ResponseBody
	@RequestMapping("/getOrderByOrderNumber")
	public JsonResponse<Order> getOrderByOrderNumber(String orderNumber,
													 HttpServletRequest request) {
		JsonResponse<Order> result = new JsonResponse<Order>();
		Order order = orderService.getOne(orderNumber);
		if (order != null) {
			result.setRes(SystemCode.SUCCESS);
			result.setObj(order);
		} else {
			result.setRes(SystemCode.NO_LOGIN);
		}
		return result;
	}

	/**
	 * 下订单 查询出当前用户的收货信息，商品信息，配送信息
	 */
	@ResponseBody
	@RequestMapping("/doOrder")
	public JsonResponse<OrderVo> doOrder(String goodsIds,
										 HttpServletRequest request) {
		JsonResponse<OrderVo> result = new JsonResponse<OrderVo>(
				SystemCode.FAILURE);
		User user = SessionUtil.getUser(request);
		Receive receive = new Receive();
		List<Goods> allGoods = new ArrayList<Goods>();
		Logistics logistics = new Logistics();
		OrderVo orderVo = new OrderVo();

		try {
			// 首先判断当前有没有用户手机，没有则验证手机
			User usermodel = userMapper.getOneByOpenid(user.getOpenid());
			String phone = usermodel.getPhone();
			if (phone == null || "".equals(phone)) {
				// 手机号不存在，提醒验证
				result.setRes(SystemCode.PHONE_NOT_EXISTS);
				return result;
			}

			// 有手机号码再取值，先取收货信息（联系人，电话，地址），没有则提醒没有默认收货地址

			// 用户没有默认收货地址，默认选择当前用户的收货地址列表的第一条，并设置为默认地址
			receive = receiveMapper.selectUserReceive(user.getOpenid());
			if (receive == null) {
				// 如果没有收货地址列表则提示没有收货地址，可添加收货地址
				orderVo.setReceiveState(SystemCode.RECEIVE_NOT_EXISTS);
			}
			orderVo.setReceive(receive);

			// 取商品信息
			allGoods = goodsService.getAllSelectGoods(goodsIds);
			orderVo.setAllGoods(allGoods);

			// 取配送信息
			logistics = logisticsMapper.getFirstLogistics();
			orderVo.setLogistics(logistics);

			result.setRes(SystemCode.SUCCESS);
			result.setObj(orderVo);

		} catch (Exception e) {
			logError(request, "[user:" + user.getNickname() + ",下订单异常]", e);
		}
		return result;
	}

	/**
	 * 合并订单
	 *
	 * @param request
	 * @param order
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/joinOrder")
	public JsonResponse<String> joinOrder(HttpServletRequest request,
										  String orderNumbers) {
		JsonResponse<String> result = new JsonResponse<String>(
				SystemCode.FAILURE);
		User user = SessionUtil.getUser(request);
		if (null == user) {
			result.setRes(SystemCode.NO_LOGIN);
			return result;
		}
		int totalPrice = 0;
		if (orderNumbers.indexOf(",") > 0) {
			String[] strs = orderNumbers.split(",");
			for (String str : strs) {
				Order order = orderService.getOrderByNumber(str);
				if (null != order && null != order.getUser()
						&& order.getUser().getUserId() == user.getUserId()) {
					totalPrice += order.getPaidAmount();
				} else {
					result.setRes(SystemCode.FAILURE);
					return result;
				}
			}
		} else {
			Order order = orderService.getOrderByNumber(orderNumbers);
			if (null != order && null != order.getUser()
					&& order.getUser().getUserId() == user.getUserId()) {
				totalPrice += order.getPaidAmount();
			} else {
				result.setRes(SystemCode.FAILURE);
				return result;
			}
		}

		JoinOrder joinOrder = new JoinOrder();
		joinOrder.setOrderNumbers(orderNumbers);
		joinOrder.setTotalPrice(totalPrice);
		try {
			String orderNum = orderService.joinOrder(joinOrder);
			result.setRes(SystemCode.SUCCESS);
			result.setResult(orderNum);// 订单号
		} catch (Exception e) {
			logError("下订单异常", e);
		}
		return result;
	}

	/**
	 * 下订单 查询出当前用户的收货信息，商品信息，配送信息
	 */
	@ResponseBody
	@RequestMapping("/buyGoodsAgain")
	public JsonResponse<OrderVo> buyGoodsAgain(String orderNumber,
											   HttpServletRequest request) {
		JsonResponse<OrderVo> result = new JsonResponse<OrderVo>(
				SystemCode.FAILURE);
		User user = SessionUtil.getUser(request);
		if(null == user){
			result.setRes(SystemCode.NO_LOGIN);
			return result;
		}

		try {
			Order order = orderService.getOne(orderNumber);

			orderService.buyGoodsAgain(order, user);
			result.setRes(SystemCode.SUCCESS);
		} catch (Exception e) {
			logError(request, "[user:" + user.getNickname() + ",下订单异常]", e);
		}
		return result;
	}

}
