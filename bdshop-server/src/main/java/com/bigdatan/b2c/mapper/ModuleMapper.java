package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.Module;

import java.util.List;

/**
 * 系统模块Mapper
 */
public interface ModuleMapper extends IBaseDao<Module> {
    /**
     * 查询该角色拥有的系统模块
     */
    List<Module> selectByRoleId(int roleId);

    List<Module> queryModulesByAdminId(int adminId);
}
