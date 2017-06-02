package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.UserPrivilege;

/**
 * 用户优惠
 */
public interface UserPrivilegeMapper extends IBaseDao<UserPrivilege> {
    /**
     * 查询用户优惠
     *
     * @param userId 用户id
     * @return
     */
    UserPrivilege selectByUserId(int userId);

    UserPrivilege selectAllByUserId(int userId);
}
