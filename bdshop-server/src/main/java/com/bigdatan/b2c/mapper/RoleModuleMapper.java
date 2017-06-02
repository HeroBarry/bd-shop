package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.RoleModule;

import java.util.List;

/**
 * 管理员角色模块Mapper
 */
public interface RoleModuleMapper extends IBaseDao<RoleModule> {
    /**
     * 删除所有roleId的记录
     *
     * @param roleId
     */
    void deleteByRoleModuleId(int roleModuleId);

    /**
     * 根据roleId查询记录
     *
     * @param roleId
     */
    List<RoleModule> selectByRoleId(int roleId);
}
