package com.bigdatan.b2c.controller.admin;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.entity.Module;
import com.bigdatan.b2c.service.IModuleService;
import com.bigdatan.b2c.vo.ModuleVo;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

;

/**
 * 系统模块Controller
 */
@RestController
@RequestMapping("/admin/module/module")
public class ModuleController extends AbstractController {
    @Resource
    private IModuleService moduleService;

    /**
     * 获取全部的module
     *
     * @param request
     * @return
     */

    //@GetMapping("/queryAllValidModule")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryAllValidModule")
    public JsonResponse<List<ModuleVo>> queryAllValidModule(HttpServletRequest request, Integer roleId) {
        JsonResponse<List<ModuleVo>> result = new JsonResponse<List<ModuleVo>>();
        List<Module> modules = moduleService.queryAllValidModule();
        List<ModuleVo> moduleVos = new ArrayList<ModuleVo>();
        ModuleVo moduleVo = null;
        if (null != modules) {
            // 查询用户拥有的高级支付方式
            List<Module> roleModules = moduleService.queryRoleModule(roleId);

            if (null != roleModules) {
                for (Module module : modules) {
                    moduleVo = new ModuleVo();
                    moduleVo.setCreateTime(module.getCreateTime());
                    moduleVo.setDescription(module.getDescription());
                    moduleVo.setModuleId(module.getModuleId());
                    moduleVo.setName(module.getName());
                    moduleVo.setParentId(module.getParentId());
                    moduleVo.setState(module.getState());
                    moduleVo.setModuleId(module.getModuleId());
                    moduleVo.setUpdateTime(module.getUpdateTime());
                    moduleVo.setUrl(module.getUrl());
                    moduleVo.setIsOwnered((byte) 2);

                    for (Module roleModule : roleModules) {
                        if (module.getModuleId() == roleModule.getModuleId()) {
                            moduleVo.setIsOwnered((byte) 1);
                        }
                    }
                    moduleVos.add(moduleVo);
                }
            }
        }
        result.setObj(moduleVos);
        result.setRes(SystemCode.SUCCESS);
        return result;
    }

    /**
     * 获取全部的module
     *
     * @param request
     * @return
     */

    //@GetMapping("/queryModules")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryModules")
    public JsonResponse<List<Module>> queryModules(HttpServletRequest request) {
        JsonResponse<List<Module>> result = new JsonResponse<List<Module>>(SystemCode.FAILURE);
        Admin admin = SessionUtil.getAdminUser(request);
        if (null == admin) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        List<Module> modules = null;
        if (null == admin.getModules()) {
            modules = moduleService.queryModulesByAdminId(admin.getAdminId());
            admin.setModules(modules);
            SessionUtil.setAdminUser(request, admin);
        } else {
            modules = admin.getModules();
        }
        result.setObj(modules);
        result.setRes(SystemCode.SUCCESS);
        return result;
    }
}
