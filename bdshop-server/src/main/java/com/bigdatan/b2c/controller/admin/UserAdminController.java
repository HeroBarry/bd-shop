package com.bigdatan.b2c.controller.admin;

import com.bigdatan.b2c.entity.*;
import com.bigdatan.b2c.service.IPaymentService;
import com.bigdatan.b2c.service.IUserPrivilegeService;
import com.bigdatan.b2c.service.IUserService;
import com.bigdatan.b2c.vo.HigherPaymentVo;
import constant.SystemCode;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

;

/**
 *  管理员 管理模块 后台
 */
@RestController
@RequestMapping("/admin/user/userAdmin")
public class UserAdminController {

    @Resource
    private IUserService userService;
    @Resource
    private IPaymentService paymentService;
    @Resource
    private IUserPrivilegeService userPrivilegeService;

    /**
     * 会员列表
     */
    //@GetMapping("/getUserByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getUserByPage")
    public JsonResponse<PageResult<User>> getUserByPage(PageResult<User> page,
                                                        User user, HttpServletRequest request) {
        JsonResponse<PageResult<User>> result = new JsonResponse<PageResult<User>>();
        userService.queryByPage(page, user);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 会员列表
     */

    //@GetMapping("/getUsersByUserIds")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getUsersByUserIds")
    public JsonResponse<PageResult<User>> getUsersByUserIds(PageResult<User> page,
                                                            String userIds, HttpServletRequest request) {
        JsonResponse<PageResult<User>> result = new JsonResponse<PageResult<User>>();
        userService.getUsersByUserIds(page, userIds);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 会员详情
     */

    //@GetMapping("/getUserById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getUserById")
    public JsonResponse<User> getUserById(Integer userId,
                                          HttpServletRequest request) {
        JsonResponse<User> result = new JsonResponse<User>();
        User user = userService.selectByPrimaryKey(userId);
        if (user != null) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(user);
        }
        return result;
    }

    /**
     * 获取高级支付方式
     *
     * @param user
     * @param request
     * @return
     */
    //@GetMapping("/queryUserHigherPayment")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryUserHigherPayment")
    public JsonResponse<List<HigherPaymentVo>> queryUserHigherPayment(
            User user, HttpServletRequest request) {
        JsonResponse<List<HigherPaymentVo>> result = new JsonResponse<List<HigherPaymentVo>>();
        Payment payment = new Payment();
        // payment.setIsGeneral((byte) 0);
        // payment.setState((byte) 2);
        List<Payment> payments = paymentService.getAllBySelect(payment);

        List<HigherPaymentVo> higherPaymentVos = new ArrayList<HigherPaymentVo>();
        HigherPaymentVo higherPaymentVo = null;
        if (null != payments) {
            // 查询用户拥有的高级支付方式
            List<Payment> userPayments = paymentService.queryUserPayment(user);
            if (null != userPayments) {
                for (Payment tempPayment : payments) {
                    higherPaymentVo = new HigherPaymentVo();
                    higherPaymentVo.setPaymentId(tempPayment.getPaymentId());
                    higherPaymentVo.setName(tempPayment.getName());
                    higherPaymentVo
                            .setDescription(tempPayment.getDescription());
                    higherPaymentVo.setCreateTime(tempPayment.getCreateTime());
                    higherPaymentVo.setUpdateTime(tempPayment.getUpdateTime());
                    higherPaymentVo.setState(tempPayment.getState());
                    higherPaymentVo.setIsOwnered((byte) 2);

                    for (Payment userPayment : userPayments) {
                        if (tempPayment.getPaymentId() == userPayment
                                .getPaymentId()) {
                            higherPaymentVo.setIsOwnered((byte) 1);
                        }
                    }
                    higherPaymentVos.add(higherPaymentVo);
                }
            }
        }
        result.setObj(higherPaymentVos);
        result.setRes(SystemCode.SUCCESS);
        return result;
    }

    /**
     * 获取支付优惠权限
     *
     * @param user
     * @param request
     * @return
     */

    //@GetMapping("/queryUserPrivilege")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryUserPrivilege")
    public JsonResponse<UserPrivilege> queryUserPrivilege(User user,
                                                          HttpServletRequest request) {
        JsonResponse<UserPrivilege> result = new JsonResponse<UserPrivilege>();
        UserPrivilege userPrivilege = userPrivilegeService
                .queryUserPrivilege(user);
        if (null == userPrivilege) {
            userPrivilege = new UserPrivilege();
            userPrivilege.setIsWholeSalePrice((byte) 0);
            userPrivilege.setIsDiscount((byte) 0);
            userPrivilege.setDiscount(100);
        } else {
            if (null == userPrivilege.getIsDiscount()) {
                userPrivilege.setIsDiscount((byte) 0);
                userPrivilege.setDiscount(100);
            }
            if (null == userPrivilege.getIsWholeSalePrice()) {
                userPrivilege.setIsWholeSalePrice((byte) 0);
            }
        }
        result.setObj(userPrivilege);
        result.setRes(SystemCode.SUCCESS);
        return result;
    }

    /**
     * 修改会员权限
     *
     * @param user
     * @param userPrivilege
     * @param higherPaymentVos
     * @param request
     * @return
     */
    //@GetMapping("/editUser")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editUser")
    public JsonResponse<String> editUser(HttpServletRequest request,
                                         UserPrivilege userPrivilege, String paymentString) {
        JsonResponse<String> result = new JsonResponse<String>(
                SystemCode.FAILURE);
        // TODO添加商品优惠设置和高级付款方式设置
        Admin admin = SessionUtil.getAdminUser(request);
        if (null == admin) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        userPrivilege.setAdminId(admin.getAdminId());
        Date now = new Date();
        userPrivilege.setCreateTime(now);
        userPrivilege.setUpdateTime(now);

        UserPayment userPayment = null;
        List<UserPayment> userPayments = new ArrayList<UserPayment>();
        if (StringUtils.isNotBlank(paymentString)) {
            int index = paymentString.indexOf(",");
            if (index > 0) {
                String[] strs = paymentString.split(",");
                for (String str : strs) {
                    userPayment = new UserPayment();
                    int paymentId = Integer.parseInt(str);
                    userPayment.setPaymentId(paymentId);
                    userPayment.setUserId(userPrivilege.getUserId());
                    userPayment.setAdminId(admin.getAdminId());
                    userPayment.setCreateTime(now);

                    userPayments.add(userPayment);
                }
            } else {
                userPayment = new UserPayment();
                int paymentId = Integer.parseInt(paymentString);
                userPayment.setPaymentId(paymentId);
                userPayment.setUserId(userPrivilege.getUserId());
                userPayment.setAdminId(admin.getAdminId());
                userPayment.setCreateTime(now);
                userPayments.add(userPayment);

            }
        }

        try {
            userService.grantPrivilege(userPrivilege, userPayments);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
            result.setMsg("添加失败");
        }

        return result;
    }
}
