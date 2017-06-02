package com.bigdatan.b2c.controller.admin;

import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.service.IAdminService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.Encryp.MD5Util;
import util.JsonResponse;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

;

/**
 *  后台用户登陆退出
 */
@RestController
@RequestMapping("/adminLogin")
public class AdminLoginController {

    @Resource
    private IAdminService adminService;


    /**
     * @param request
     * @param admin   登录
     * @return adminName, password
     */

//    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/toLogin")
//    //@GetMapping("/toLogin")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/toLogin")
    private JsonResponse<Admin> toLogin(HttpServletRequest request, Admin admin) {
        JsonResponse<Admin> result = new JsonResponse<Admin>(SystemCode.FAILURE);
        Admin model = adminService.login(admin);
        //首先判断用户状态是否为关闭
        if (model.getState() == 2) {
            return result;
        }
        if (model != null) {
            // 登录成功
            String password = MD5Util.encoder(admin.getPassword(), model.getRand());
            if (password.equals(model.getPassword())) {

                SessionUtil.setAdminUser(request, model);
                // 登陆成功
                result.setRes(SystemCode.SUCCESS);
                result.setObj(model);
                result.setResult(SystemCode.GetErrorDesc(SystemCode.SUCCESS));
                return result;
            }
        }
        // 登录失败
        result.setRes(SystemCode.NO_OBJ_ERROR_PASS);
        result.setResult(SystemCode.GetErrorDesc(SystemCode.NO_OBJ_ERROR_PASS));
        return result;
    }

    //@GetMapping("/loginOut")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/loginOut")
    public JsonResponse<String> loginOut(HttpServletRequest request) {
        JsonResponse<String> result = new JsonResponse<String>();
        request.getSession().invalidate();
        result.setRes(SystemCode.SUCCESS);
        return result;
    }

    //@GetMapping("/isLogin")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/isLogin")
    public JsonResponse<String> isLogin(HttpServletRequest request) {
        JsonResponse<String> result = new JsonResponse<String>(SystemCode.FAILURE);
        Admin admin = SessionUtil.getAdminUser(request);
        if (admin != null) {
            result.setRes(SystemCode.SUCCESS);
        }
        return result;
    }

}
