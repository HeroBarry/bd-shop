package com.bigdatan.b2c.pay;


import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.JoinOrder;
import com.bigdatan.b2c.entity.Order;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.IOrderDetailsService;
import com.bigdatan.b2c.service.IOrderService;
import com.bigdatan.b2c.service.IUserService;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.naming.NoNameCoder;
import com.thoughtworks.xstream.io.xml.StaxDriver;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import util.CommondUtil;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 微信支付接口
 */
@Controller
@RequestMapping("/wxpay")
public class WxPlay extends AbstractController {
    @Resource
    private IOrderService orderService;
    @Resource
    private IOrderDetailsService orderDetailsService;
    @Resource
    private IUserService userService;
    private Logger lo = Logger.getLogger(WxPlay.class);

    /**
     * @param request
     * @param orderNumber 订单号 totalFee 金额 以分单位
     * @return
     * @throws IllegalAccessException
     */
    @RequestMapping("/pay")
    @ResponseBody
    public Map<String, Object> pay(HttpServletRequest request,
                                   String orderNumber) {
        lo.info("微信支付开始..." + orderNumber);
        Map<String, Object> map = new ConcurrentHashMap<String, Object>();
        Map<String, Object> returnMap = new ConcurrentHashMap<String, Object>();
        Order order = orderService.getOrderByNumber(orderNumber);
        int totalPrice = 0;
        if (null == order) {
            JoinOrder joinOrder = orderService.getJoinOrderByNumber(orderNumber);
            if (null == joinOrder) {
                return null;
            } else {
                totalPrice = joinOrder.getTotalPrice();
            }
        } else {
            totalPrice = order.getPaidAmount();
        }

        String prepay_id = "";
        WxPlaceOrder wxPlaceOrder = new WxPlaceOrder();
        wxPlaceOrder.setAppid(Configure.APP_ID);
        wxPlaceOrder.setBody("购买商品");
        wxPlaceOrder.setMch_id(Configure.PAY_ID);
        wxPlaceOrder.setNonce_str(Util.uuid());
        wxPlaceOrder.setNotify_url(Configure.NOTIFY_URL);
        User user = SessionUtil.getUser(request);
        if (null == user) {
            return null;
        } else if (null == user.getOpenid()) {
            user = userService.selectByPrimaryKey(user.getUserId());
        }
        wxPlaceOrder.setOpenid(user.getOpenid());
        wxPlaceOrder.setOut_trade_no(orderNumber);
        wxPlaceOrder.setSpbill_create_ip("127.0.0.1");
//		wxPlaceOrder.setTotal_fee(totalPrice);
        wxPlaceOrder.setTotal_fee(1);
        wxPlaceOrder.setTrade_type("JSAPI");
        wxPlaceOrder.setSign(Signature.getSign(wxPlaceOrder));
        XStream xStream = new XStream(new StaxDriver(new NoNameCoder()));
        xStream.alias("xml", WxPlaceOrder.class);
        String xml = xStream.toXML(wxPlaceOrder);
        String result = CommondUtil.httpsRequest(Configure.WX_PlACE_ORDER,
                "GET", xml);
        lo.info("微信支付开始...xml:" + xml);
        lo.info("微信支付开始...result:" + result);
        returnMap.put("code", "-1");// 下单失败
        if (!"".equals(result)) {
            try {
                map = XMLParser.getMapFromXML(result);
                if (map.containsKey("prepay_id")) {
                    // 统一下单接口成功
                    prepay_id = "";
                    prepay_id = (String) map.get("prepay_id");
                    // 签名 并返回前端
                    wxPlaceOrder = new WxPlaceOrder();
                    wxPlaceOrder.setAppid(Configure.APP_ID);
                    wxPlaceOrder.setNonce_str(Util.uuid());
                    wxPlaceOrder.setTimeStamp(System.currentTimeMillis() / 1000
                            + "");
                    wxPlaceOrder.setPrepay_id(prepay_id);

                    returnMap.put("nonce_str", wxPlaceOrder.getNonce_str());
                    returnMap.put("appid", Configure.APP_ID);
                    returnMap.put("timeStamp", wxPlaceOrder.getTimeStamp());
                    returnMap
                            .put("paySign", Signature.getSignPay(wxPlaceOrder));
                    returnMap.put("prepay_id", prepay_id);
                    returnMap.put("code", "1");// 下单成功
                }
            } catch (Exception e) {
                logError("统一下单异常", e);
            }
        }
        lo.info("微信支付结束");
        return returnMap;
    }

    @RequestMapping("/notify")
    public void notity(HttpServletResponse response, HttpServletRequest request)
            throws Exception {
        lo.info("微信支付回调开始...");
        Map<String, String> map = parseXml(request);
        WxPlaceOrder wxPlaceOrder = new WxPlaceOrder();
        // 当前订单的通知业务
        if ("SUCCESS".equals(map.get("return_code"))) {
            if ("SUCCESS".equals(map.get("result_code"))) {
                String out = map.get("out_trade_no");
                String paymentSeq = map.get("transaction_id");
                // 支付交易成功
                Order order = new Order();
                lo.info(out);
                JoinOrder joinOrder = orderService.getJoinOrderByNumber(out);
                String orderNumbers = null;
                if (null != joinOrder) {
                    orderNumbers = joinOrder.getOrderNumbers();
                    orderService.notifyAll(orderNumbers, paymentSeq);
                } else {
                    order.setOrderNumber(out);
                    order.setPaymentSeq(paymentSeq);
                    order.setUpdateTime(new Date());
                    // order.setState((byte)2);//更新订单 为支付成功
                    order.setPayState((byte) 2);// 更新订单 为支付成功
                    orderService.updateByPrimaryKeySelective(order);
                }
            }
            // 通知成功
            wxPlaceOrder.setReturn_code("SUCCESS");
            XStream xStream = new XStream(new StaxDriver(new NoNameCoder()));
            xStream.alias("xml", WxPlaceOrder.class);
            String returnXml = xStream.toXML(wxPlaceOrder);
            try {
                response.getWriter().write(returnXml);
            } catch (IOException e) {
                logError("通知回调 微信服务器 异常", e);
            }
        }
        lo.info("微信支付回调结束...");
    }

    public Map<String, String> parseXml(HttpServletRequest request)
            throws Exception, IOException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(request.getInputStream());
        // 获取到document里面的全部结点
        NodeList allNodes = document.getFirstChild().getChildNodes();
        Node node;
        Map<String, String> map = new HashMap<String, String>();
        int i = 0;
        while (i < allNodes.getLength()) {
            node = allNodes.item(i);
            if (node instanceof Element) {
                map.put(node.getNodeName(), node.getTextContent());
            }
            i++;
        }
        return map;

    }


}
