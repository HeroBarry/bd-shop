package com.bigdatan.b2c.controller.admin;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.service.IAdminService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.Encryp.MD5Util;
import util.JsonResponse;
import util.PageResult;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;


/**
 *  管理员 管理模块 后台
 */
@RestController
@RequestMapping("/admin/admin/adminUser")
public class AdminUserAdminController extends AbstractController {
    @Resource
    private IAdminService adminService;

    /**
     * 管理员列表
     */
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getAdminByPage")
    //@GetMapping("/getAdminByPage")

    public JsonResponse<PageResult<Admin>> getAdminByPage(PageResult<Admin> page, Admin admin,
                                                          HttpServletRequest request) {
        JsonResponse<PageResult<Admin>> result = new JsonResponse<PageResult<Admin>>();
        adminService.queryByPage(page, admin);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 添加管理员
     */

    //@GetMapping("/addAdmin")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/addAdmin")
    public JsonResponse<String> addAdmin(Admin admin, HttpServletRequest request) {
        JsonResponse<String> result = new JsonResponse<String>();
        try {
            String rand = MD5Util.getRand();
            String password = MD5Util.encoder(admin.getPassword(), rand);
            admin.setRand(rand);
            admin.setPassword(password);
            Date now = new Date();
            admin.setCreateTime(now);
            admin.setUpdateTime(now);
            int count = adminService.getCountByAdminName(admin.getAdminName());
            if (count != 0) {
                result.setRes(SystemCode.USER_EXISTS);
                return result;
            }
            adminService.insertSelective(admin);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[添加管理员异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 用户名是否存在
     */

    //@GetMapping("/adminNameIsExit")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/adminNameIsExit")
    public JsonResponse<String> adminNameIsExit(HttpServletRequest request, Admin admin) {
        JsonResponse<String> result = new JsonResponse<String>(SystemCode.FAILURE);
        int count = adminService.getCountByAdminName(admin.getAdminName());
        if (count != 0) {
            result.setRes(SystemCode.USER_EXISTS);
            return result;
        }
        return result;
    }

    /**
     * 编辑管理员
     */
    //@GetMapping("/editAdmin")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editAdmin")
    public JsonResponse<Admin> editAdmin(HttpServletRequest request, Admin admin) {
        JsonResponse<Admin> result = new JsonResponse<Admin>(SystemCode.FAILURE);
        try {
            adminService.updateByPrimaryKeySelective(admin);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[用户信息编辑失败]", e);
            result.setRes(SystemCode.OBJ_EXISTS);
        }
        return result;
    }

    /**
     * @param request
     * @return 获取管理员信息
     */

    //@GetMapping("/getAdminInfo")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getAdminInfo")
    public JsonResponse<Admin> getAdminInfo(Integer adminId, HttpServletRequest request) {
        JsonResponse<Admin> result = new JsonResponse<Admin>();
        Admin admin = adminService.selectByPrimaryKey(adminId);
        result.setRes(SystemCode.SUCCESS);
        result.setObj(admin);
        return result;
    }

    /**
     * @param newPassword
     * @return 管理员 修改密码
     */

    //@GetMapping("/resetPasswordByAdminId")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/resetPasswordByAdminId")
    public JsonResponse<String> resetPasswordByAdminId(String newPassword, Integer adminId) {
        JsonResponse<String> result = new JsonResponse<String>();
        Admin admin = new Admin();
        String rand = MD5Util.getRand();
        String password = MD5Util.encoder(newPassword, rand);
        admin.setRand(rand);
        admin.setPassword(password);
        admin.setUpdateTime(new Date());
        admin.setAdminId(adminId);
        try {
            adminService.updateByPrimaryKeySelective(admin);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError("[用户修改密码失败]", e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

}
