package com.bigdatan.b2c.pay;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.AlipayResponse;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradeWapPayModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradeWapPayRequest;
import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Order;
import com.bigdatan.b2c.service.IOrderDetailsService;
import com.bigdatan.b2c.service.IOrderService;
import com.bigdatan.b2c.service.IUserService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 支付宝支付
 */
@Controller
@RequestMapping("/alipay")
public class AliPlay extends AbstractController {
    @Resource
    private IOrderService orderService;
    @Resource
    private IOrderDetailsService orderDetailsService;
    @Resource
    private IUserService userService;
    private Logger lo = Logger.getLogger(AliPlay.class);

    /**
     * @param request
     * @param orderNumber 订单号 totalFee 金额 以分单位
     * @return
     * @throws IllegalAccessException
     */
    @RequestMapping("/pay")
    @ResponseBody
    public Map<String, Object> pay(HttpServletRequest request, String orderNumber) {
        lo.info("支付宝支付开始...");
        Map<String, Object> map = new ConcurrentHashMap<String, Object>();
        Map<String, Object> returnMap = new ConcurrentHashMap<String, Object>();
        Order order = orderService.getOrderByNumber(orderNumber);

        // 商户订单号，商户网站订单系统中唯一订单号，必填
        String out_trade_no = orderNumber;
        // 订单名称，必填
        String subject = "购买商品";
        // 付款金额，必填
        String total_amount = order.getTotalAmount().toString();
        // 商品描述，可空
        String body = "";
        // 超时时间 可空
        String timeout_express = "2m";
        // 销售产品码 必填
        String product_code = "QUICK_WAP_PAY";
        /**********************/
        // SDK 公共请求类，包含公共请求参数，以及封装了签名与验签，开发者无需关注签名与验签
        // 调用RSA签名方式
        System.out.println("xxx" + AlipayConfig.RSA_PRIVATE_KEY);
        AlipayClient client = new DefaultAlipayClient(AlipayConfig.URL, AlipayConfig.APPID,
                AlipayConfig.RSA_PRIVATE_KEY, AlipayConfig.FORMAT, AlipayConfig.CHARSET,
                AlipayConfig.ALIPAY_PUBLIC_KEY, AlipayConfig.SIGNTYPE);
        AlipayTradeWapPayRequest alipay_request = new AlipayTradeWapPayRequest();

        // 封装请求支付信息
        AlipayTradeWapPayModel model = new AlipayTradeWapPayModel();
        model.setOutTradeNo(out_trade_no);
        model.setSubject(subject);
        model.setTotalAmount(total_amount);
        model.setBody(body);
        model.setTimeoutExpress(timeout_express);
        model.setProductCode(product_code);
        alipay_request.setBizModel(model);
        // 设置异步通知地址
        alipay_request.setNotifyUrl(AlipayConfig.notify_url);
        // 设置同步地址
        // alipay_request.setReturnUrl(AlipayConfig.return_url);

        try {
            AlipayResponse alipay_response = client.sdkExecute(alipay_request);
            returnMap.put("code", "1");// 下单成功
        } catch (AlipayApiException e) {
            // TODO Auto-generated catch block
            logError("统一下单异常", e);
        }

        return returnMap;

    }

    @RequestMapping("/notify")
    public void notity(HttpServletResponse response, HttpServletRequest request) throws Exception {
        lo.info("支付宝回调开始...");
        // 获取支付宝POST过来反馈信息
        Map<String, String> params = new HashMap<String, String>();
        Map requestParams = request.getParameterMap();
        for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext(); ) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
            }
            // 乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
            // valueStr = new String(valueStr.getBytes("ISO-8859-1"), "gbk");
            params.put(name, valueStr);
        }
        // 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
        // 商户订单号

        String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"), "UTF-8");
        // 支付宝交易号

        String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"), "UTF-8");

        // 交易状态
        String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"), "UTF-8");

        // 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
        // 计算得出通知验证结果
        // boolean AlipaySignature.rsaCheckV1(Map<String, String> params, String
        // publicKey, String charset, String sign_type)
        boolean verify_result = AlipaySignature.rsaCheckV1(params, AlipayConfig.ALIPAY_PUBLIC_KEY,
                AlipayConfig.CHARSET, "RSA2");

        if (verify_result) {// 验证成功
            // ////////////////////////////////////////////////////////////////////////////////////////
            // 请在这里加上商户的业务逻辑程序代码

            // ——请根据您的业务逻辑来编写程序（以下代码仅作参考）——

            if (trade_status.equals("TRADE_FINISHED")) {
                // 判断该笔订单是否在商户网站中已经做过处理
                // 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                // 请务必判断请求时的total_fee、seller_id与通知时获取的total_fee、seller_id为一致的
                // 如果有做过处理，不执行商户的业务程序

                // 注意：
                // 如果签约的是可退款协议，退款日期超过可退款期限后（如三个月可退款），支付宝系统发送该交易状态通知
                // 如果没有签约可退款协议，那么付款完成后，支付宝系统发送该交易状态通知。
            } else if (trade_status.equals("TRADE_SUCCESS")) {
                // 判断该笔订单是否在商户网站中已经做过处理
                // 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                // 请务必判断请求时的total_fee、seller_id与通知时获取的total_fee、seller_id为一致的
                // 如果有做过处理，不执行商户的业务程序

                // 注意：
                // 如果签约的是可退款协议，那么付款完成后，支付宝系统发送该交易状态通知。
                // 支付交易成功
                Order order = new Order();
                order.setOrderNumber(out_trade_no);
                order.setPaymentSeq(trade_no);
                order.setUpdateTime(new Date());
                // order.setState((byte)2);//更新订单 为支付成功
                order.setPayState((byte) 2);// 更新订单 为支付成功
                orderService.updateByPrimaryKeySelective(order);
            }

            // ////////////////////////////////////////////////////////////////////////////////////////
        } else {// 验证失败

        }
        lo.info("支付宝回调结束...");
    }

    public Map<String, String> parseXml(HttpServletRequest request) throws Exception, IOException {
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
