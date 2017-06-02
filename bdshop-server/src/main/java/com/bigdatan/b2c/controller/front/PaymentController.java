package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Payment;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.IPaymentService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

;

/**
 * 获取付款方式控制器
 */
@RestController
@RequestMapping("/front/payment/payment")
public class PaymentController extends AbstractController {
    @Resource
    private IPaymentService paymentService;

    //@GetMapping("/queryUserPayment")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryUserPayment")
    public JsonResponse<List<Payment>> queryUserPayment(HttpServletRequest request) {
        JsonResponse<List<Payment>> result = new JsonResponse<List<Payment>>(SystemCode.FAILURE);
        User user = SessionUtil.getUser(request);
        if (null == user) {
            return result;
        }
        List<Payment> paymentList = paymentService.queryUserPayment(user);
        if (null != paymentList) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(paymentList);
        }
        return result;
    }
}
