package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.Role;
import com.bigdatan.b2c.entity.RoleModule;

import java.util.List;

/**
 *
 *
 * 管理员角色服务接口定义
 */
public interface IRoleService extends IBaseService<Role> {

    /**
     * 授权
     *
     * @param role       角色对象
     * @param moduleList 模块列表
     */
    void grantPowerToRole(Role role, List<RoleModule> moduleList) throws Exception;
}
