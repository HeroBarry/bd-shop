package com.bigdatan.b2c.controller.admin;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bigdatan.b2c.export.DataExporterImpl;
import com.bigdatan.b2c.export.ExportEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.entity.GoodsPrice;
import com.bigdatan.b2c.entity.Order;
import com.bigdatan.b2c.vo.OrderAdminSearchVO;
import com.bigdatan.b2c.entity.OrderCertify;
import com.bigdatan.b2c.entity.OrderDetails;
import com.bigdatan.b2c.vo.OrderDetailsAdminSearchVO;
import com.bigdatan.b2c.service.IOrderDetailsService;
import com.bigdatan.b2c.service.IOrderService;


import constant.SystemCode;

/**
 *
 * 商品订单模块 后台
 */
@Controller
@RequestMapping("/admin/order/orderAdmin")
public class OrderAdminController extends AbstractController {

	@Resource
	private IOrderService orderService;

	@Resource
	private IOrderDetailsService orderDetailsService;

	/**
	 * 商品订单列表
	 */
	@ResponseBody
	@RequestMapping("/getOrderByPage")
	public JsonResponse<PageResult<Order>> getOrderByPage(
			PageResult<Order> page, Order order, HttpServletRequest request) {
		JsonResponse<PageResult<Order>> result = new JsonResponse<PageResult<Order>>();
		orderService.queryByPage(page, order);
		if (page.getTotal() != 0) {
			result.setRes(SystemCode.SUCCESS);
			result.setObj(page);
		} else {
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 商品订单详情
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
		}
		return result;
	}

	/**
	 * 发货 发货时需要传订单id，订单状态，物流单号
	 */
	@ResponseBody
	@RequestMapping("/toSend")
	public JsonResponse<String> toSend(Order order, HttpServletRequest request) {
		JsonResponse<String> result = new JsonResponse<String>();
		// String logisticsNumber = order.getLogisticsNumber();
		order = orderService.selectByPrimaryKey(order.getOrderId());
		try {

			// 筛选出全额付款和预定付款的数据
			if (order.getLogisticsState() == 1) {
				order.setLogisticsState((byte) 2);
				// order.setLogisticsNumber(logisticsNumber);
				order.setUpdateTime(new Date());
				// 设置其他属性为空
				order.setPayState(null);
				order.setDelState(null);
				order.setOrderNumber(null);

				orderService.updateByPrimaryKeySelective(order);
				result.setRes(SystemCode.SUCCESS);
			}
		} catch (Exception e) {
			logError(request, "[发货异常]", e);
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 确认收货
	 *
	 * @param order
	 *            订单对象
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/receiveGoods")
	public JsonResponse<String> receiveGoods(Order order,
											 HttpServletRequest request) {
		JsonResponse<String> result = new JsonResponse<String>();
		order = orderService.selectByPrimaryKey(order.getOrderId());
		try {

			// 筛选出全额付款和预定付款的数据
			if (order.getLogisticsState() == 2) {
				order.setLogisticsState((byte) 3);
				order.setUpdateTime(new Date());
				// 设置其他属性为空
				order.setPayState(null);
				order.setDelState(null);
				order.setOrderNumber(null);

				orderService.updateByPrimaryKeySelective(order);
				result.setRes(SystemCode.SUCCESS);
			}
		} catch (Exception e) {
			logError(request, "[确认收货异常]", e);
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 确认收款
	 *
	 * @param order
	 *            订单对象
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/receiveMoney")
	public JsonResponse<String> receiveMoney(Order order,
											 HttpServletRequest request) {
		JsonResponse<String> result = new JsonResponse<String>();
		String certifyImageUrl = request.getParameter("imageUrl");
		order = orderService.selectByPrimaryKey(order.getOrderId());
		try {

			// 筛选出全额付款和预定付款的数据
			if (order.getLogisticsState() == 3 && order.getPayState() != 2) {
				order.setPayState((byte) 2);
				Date now = new Date();
				order.setUpdateTime(now);
				// 设置其他属性为空
				order.setLogisticsState(null);
				order.setDelState(null);
				order.setOrderNumber(null);
				// orderService.updateByPrimaryKeySelective(order);
				// 添加收款凭证记录
				OrderCertify orderCertify = new OrderCertify();
				orderCertify.setOrderId(order.getOrderId());
				orderCertify.setOrderNumber(order.getOrderNumber());
				orderCertify.setImageUrl(certifyImageUrl);
				orderCertify.setCreateTime(now);
				Admin admin = SessionUtil.getAdminUser(request);
				orderCertify.setAdmin(admin);

				orderService.updateAndAddCertify(order, orderCertify);
				// certifyService.insertSelective(certify);

				result.setRes(SystemCode.SUCCESS);
			}
		} catch (Exception e) {
			logError(request, "[确认收货异常]", e);
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 订单支付情况
	 */
	@ResponseBody
	@RequestMapping("/getOrderByPaystate")
	public JsonResponse<List<Object>> getOrderByPaystate(
			HttpServletRequest request) {
		JsonResponse<List<Object>> result = new JsonResponse<List<Object>>();
		List<Object> dataList = new ArrayList<Object>();
		// List<Object> dataList2 = new ArrayList<Object>();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			// 未付款金额
			Integer paid = orderService.getTotalAmountByPaystate(1);
			map.put("name", "未支付订单");
			map.put("y", paid);
			dataList.add(map);
			// 已付款
			Map<String, Object> map2 = new HashMap<String, Object>();
			Integer unPaid = orderService.getTotalAmountByPaystate(2);
			map2.put("name", "已支付订单");
			map2.put("y", unPaid);
			dataList.add(map2);
			result.setObj(dataList);
			result.setRes(SystemCode.SUCCESS);
		} catch (Exception e) {
			logError(request, "[查询订单数据异常]", e);
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 订单数
	 */
	@ResponseBody
	@RequestMapping("/getCountByPaystate")
	public JsonResponse<List<Object>> getCountByPaystate(
			HttpServletRequest request) {
		JsonResponse<List<Object>> result = new JsonResponse<List<Object>>();
		List<Object> dataList = new ArrayList<Object>();
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			// 未付款金额
			Integer paidNum = orderService.getCountByPaystate(1);
			map.put("name", "未支付订单");
			map.put("y", paidNum);
			dataList.add(map);
			// 已付款
			Map<String, Object> map2 = new HashMap<String, Object>();
			Integer unPaidNum = orderService.getCountByPaystate(2);
			map2.put("name", "已支付订单");
			map2.put("y", unPaidNum);
			dataList.add(map2);
			result.setObj(dataList);
			result.setRes(SystemCode.SUCCESS);
		} catch (Exception e) {
			logError(request, "[查询订单数据异常]", e);
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 依据商品订单查询类，查询商品订单详细列表
	 */
	@ResponseBody
	@RequestMapping("/getPageByOrderDetailsAdminSearchVO")
	public JsonResponse<PageResult<OrderDetails>> getPageByOrderDetailsAdminSearchVO(
			PageResult<OrderDetails> page, OrderDetailsAdminSearchVO order,
			HttpServletRequest request) {
		JsonResponse<PageResult<OrderDetails>> result = new JsonResponse<PageResult<OrderDetails>>();

		// 处理查询参数
		if (order != null) {
			if (order.getGoodsName() != null
					&& order.getGoodsName().length() > 0) {
				order.setGoodsName("%" + order.getGoodsName() + "%");
			}
			if (order.getDetailsAmount_le() != null
					&& order.getDetailsAmount_le().length() > 0) {
				double detailsAmount_le = Double.valueOf(order
						.getDetailsAmount_le()) * 100;
				order.setDetailsAmount_le(Double.toString(detailsAmount_le));
			}
			if (order.getDetailsAmount_ge() != null
					&& order.getDetailsAmount_ge().length() > 0) {
				double detailsAmount_ge = Double.valueOf(order
						.getDetailsAmount_ge()) * 100;
				order.setDetailsAmount_ge(Double.toString(detailsAmount_ge));
			}

		}

		orderDetailsService.getPageByOrderDetailsAdminSearchVO(page, order);
		if (page.getTotal() != 0) {
			result.setRes(SystemCode.SUCCESS);
			result.setObj(page);
		} else {
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 依据商品订单查询类，查询商品订单详细报表,getGoodsName保存的是priceId
	 */
	@ResponseBody
	@RequestMapping("/getDetailReportByOrderDetailsAdminSearchVO")
	public JsonResponse<OrderDetails> getDetailReportByOrderDetailsAdminSearchVO(
			OrderDetailsAdminSearchVO order, HttpServletRequest request) {
		JsonResponse<OrderDetails> result = new JsonResponse<OrderDetails>();

		// 处理查询参数
		if (order != null) {
			if (order.getGoodsName() == null
					|| order.getGoodsName().trim().length() == 0) {
				order.setGoodsName("0");
			}
			if (order.getDetailsAmount_le() != null
					&& order.getDetailsAmount_le().length() > 0) {
				double detailsAmount_le = Double.valueOf(order
						.getDetailsAmount_le()) * 100;
				order.setDetailsAmount_le(Double.toString(detailsAmount_le));
			}
			if (order.getDetailsAmount_ge() != null
					&& order.getDetailsAmount_ge().length() > 0) {
				double detailsAmount_ge = Double.valueOf(order
						.getDetailsAmount_ge()) * 100;
				order.setDetailsAmount_ge(Double.toString(detailsAmount_ge));
			}
			result.setRes(SystemCode.SUCCESS);
			result.setList(orderDetailsService
					.getDetailReportByOrderDetailsAdminSearchVO(order));
		} else {
			result.setRes(SystemCode.FAILURE);
		}
		return result;
	}

	/**
	 * 依据商品订单查询类，获取商品销售总额
	 */
	@ResponseBody
	@RequestMapping("/getTotalDetailsAmountByOrderDetailsAdminSearchVO")
	public JsonResponse<Long> getTotalDetailsAmountByOrderDetailsAdminSearchVO(
			PageResult<OrderDetails> page, OrderDetailsAdminSearchVO order,
			HttpServletRequest request) {
		JsonResponse<Long> result = new JsonResponse<Long>();
		// 处理查询参数
		if (order != null) {
			if (order.getGoodsName() != null
					&& order.getGoodsName().length() > 0) {
				order.setGoodsName("%" + order.getGoodsName() + "%");
			}
			if (order.getDetailsAmount_le() != null
					&& order.getDetailsAmount_le().length() > 0) {
				double detailsAmount_le = Double.valueOf(order
						.getDetailsAmount_le()) * 100;
				order.setDetailsAmount_le(Double.toString(detailsAmount_le));
			}
			if (order.getDetailsAmount_ge() != null
					&& order.getDetailsAmount_ge().length() > 0) {
				double detailsAmount_ge = Double.valueOf(order
						.getDetailsAmount_ge()) * 100;
				order.setDetailsAmount_ge(Double.toString(detailsAmount_ge));
			}

		}
		long total = orderDetailsService
				.getTotalDetailsAmountByOrderDetailsAdminSearchVO(order);

		result.setRes(SystemCode.SUCCESS);
		result.setObj(total);

		return result;
	}

	/**
	 * 依据商品订单查询类，获取商品销售总数
	 */
	@ResponseBody
	@RequestMapping("/getTotalNumAmountByOrderDetailsAdminSearchVO")
	public JsonResponse<Long> getTotalNumAmountByOrderDetailsAdminSearchVO(
			OrderDetailsAdminSearchVO order, HttpServletRequest request) {
		JsonResponse<Long> result = new JsonResponse<Long>();
		// 处理查询参数
		if (order != null) {
			if (order.getGoodsName() != null
					&& order.getGoodsName().length() > 0) {
				order.setGoodsName("%" + order.getGoodsName() + "%");
			}
			if (order.getDetailsAmount_le() != null
					&& order.getDetailsAmount_le().length() > 0) {
				double detailsAmount_le = Double.valueOf(order
						.getDetailsAmount_le()) * 100;
				order.setDetailsAmount_le(Double.toString(detailsAmount_le));
			}
			if (order.getDetailsAmount_ge() != null
					&& order.getDetailsAmount_ge().length() > 0) {
				double detailsAmount_ge = Double.valueOf(order
						.getDetailsAmount_ge()) * 100;
				order.setDetailsAmount_ge(Double.toString(detailsAmount_ge));
			}

		}
		long total = orderDetailsService
				.getTotalNumAmountByOrderDetailsAdminSearchVO(order);

		result.setRes(SystemCode.SUCCESS);
		result.setObj(total);
		return result;
	}

	/**
	 * 商品订单列表
	 */
	@ResponseBody
	@RequestMapping("/getOrderPageByOrderAdminSearchVO")
	public JsonResponse<PageResult<Order>> getOrderPageByOrderAdminSearchVO(
			PageResult<Order> page, OrderAdminSearchVO order,
			HttpServletRequest request) {
		JsonResponse<PageResult<Order>> result = new JsonResponse<PageResult<Order>>();

		// 放到service拼装
		/*
		 * if (order.getOrderNumber() != null
		 * &&order.getOrderNumber().length()>0) { order.setOrderNumber("%" +
		 * order.getOrderNumber() + "%"); } if (order.getPhone() != null
		 * &&order.getPhone().length()>0) { order.setPhone("%" +
		 * order.getPhone() + "%"); }
		 */
		order.setCheckAll("1");
		try {
			orderService.getPageByOrderAdminSearchVO(page, order);
		} catch (Exception e) {
			result.setRes(SystemCode.FAILURE);
			logError(request, "[获取商品订单列表异常]", e);
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
	 * 导出商品订单列表
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping("/exportPageByOrderAdminSearchVO")
	public void exportPageByOrderAdminSearchVO(OrderAdminSearchVO order,
											   HttpServletRequest request, HttpServletResponse response) {
		Admin admin = SessionUtil.getAdminUser(request);
		if (null == admin) {
			return;
		}
		String selectIdListData = request.getParameter("selectIdListData");

		Map<Integer, Integer> map = new HashMap<Integer, Integer>();
		// 最外层解析
		JSONObject object = JSONObject.parseObject(selectIdListData);
		if (object != null && !object.isEmpty()) {
			for (String k : object.keySet()) {
				Integer v = Integer.valueOf((String) object.get(k));
				map.put(Integer.valueOf(k), v);
			}
		}
		order.setSelectIdList(map);
		//仅当全选时未选择时间则按照当天的取
		if (order.getCheckAll() != null && order.getCheckAll().equals("1")) {
			if ((order.getCreateTime_ge() == null || order.getCreateTime_ge()
					.trim().length() == 0)
					&& (order.getCreateTime_ge() == null || order
					.getCreateTime_ge().trim().length() == 0)) {
				// 没有截止日期,默认为当天
				SimpleDateFormat formatter1 = new SimpleDateFormat(
						"yyyy-MM-dd 00:00:00");
				String dateString1 = formatter1.format(new Date());
				order.setCreateTime_ge(dateString1);
				SimpleDateFormat formatter2 = new SimpleDateFormat(
						"yyyy-MM-dd 23:59:59");
				String dateString2 = formatter2.format(new Date());
				order.setCreateTime_le(dateString2);
			}
		}else{
			//不是全选
			if(order.getSelectIdList().isEmpty()){
				//也没有勾选id
				return ;
			}
		}
		// order.setCheckAll("1");// 设置全部导出

		try {
			List<Order> result = orderService
					.getPageExportByOrderAdminSearchVO(order);
			if (result != null) {
				// 处理导出商品名称，存入备注字段 ;处理接收地址，拼接省市区
				for (int k = 0; k < result.size(); k++) {
					result.get(k).setComment("");
					if (result.get(k).getOrderDetailsList() != null
							&& result.get(k).getOrderDetailsList().size() > 0) {
						for (int m = 0; m < result.get(k).getOrderDetailsList()
								.size(); m++) {
							result.get(k).setComment(
									result.get(k).getComment()
											+ ","
											+ result.get(k)
											.getOrderDetailsList()
											.get(m).getGoodsName());
						}
						result.get(k).setComment(
								result.get(k).getComment().substring(1));
					}
					String address=result.get(k).getReceive().getReceiveProvince()+result.get(k).getReceive().getReceiveCity()+result.get(k).getReceive().getReceiveCounty()+result.get(k).getReceive().getReceiveAddress();
					result.get(k).getReceive().setReceiveAddress(address);

				}

				Map<String, Map<String, String>> pamStateDes = new HashMap<String, Map<String, String>>();

				Map<String, String> mapinvoiceTag = new HashMap<String, String>();
				mapinvoiceTag.put(String.valueOf(0), "否");
				mapinvoiceTag.put(String.valueOf(1), "是");
				pamStateDes.put("invoiceTag", mapinvoiceTag);

				Map<String, String> mappayState = new HashMap<String, String>();
				mappayState.put(String.valueOf(1), "未支付");
				mappayState.put(String.valueOf(2), "已支付");
				pamStateDes.put("payState", mappayState);

				Map<String, String> maplogisticsState = new HashMap<String, String>();
				maplogisticsState.put(String.valueOf(0), "未配送");
				maplogisticsState.put(String.valueOf(1), "等待配送");
				maplogisticsState.put(String.valueOf(2), "已配送");
				maplogisticsState.put(String.valueOf(3), "已确认收货");
				pamStateDes.put("logisticsState", maplogisticsState);

				@SuppressWarnings("unchecked")
				Map<String, String> tableColDes = new LinkedHashMap();
				tableColDes.put("orderNumber", "订单号");
				tableColDes.put("createTime", "下单时间");
				tableColDes.put("user.phone", "会员手机");
				tableColDes.put("totalAmount", "订单总金额");
				tableColDes.put("payment.name", "付款方式");
				tableColDes.put("payState", "支付状态");
				tableColDes.put("comment", "所选购商品");
				tableColDes.put("receive.receiveAddress", "送货地址");
				tableColDes.put("receive.contact", "联系人姓名");
				tableColDes.put("receive.tel", "联系人电话");
				tableColDes.put("sendTime", "配送时间");
				tableColDes.put("logisticsState", "配送状态");

				DataExporterImpl exImpl = new DataExporterImpl();
				ExportEntity entity = new ExportEntity();
				entity.setDataList(result);
				SimpleDateFormat formatter1 = new SimpleDateFormat(
						"yyyy-MM-dd_HHmmss");
				entity.setFileName("商品订单导出" + formatter1.format(new Date()));
				entity.setPro_desc_map(tableColDes);
				entity.setSizePerPage(65536);
				entity.setTitle("商品订单");
				entity.setParamsMap(pamStateDes);

				exImpl.export(entity, response);

			}
		} catch (Exception e) {

			logError(request, "[获取商品订单导出列表异常]", e);
			return;
		}

		return;
	}

}
