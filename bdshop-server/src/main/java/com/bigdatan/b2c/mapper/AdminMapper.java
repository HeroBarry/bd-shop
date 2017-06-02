package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.Admin;


public interface AdminMapper extends IBaseDao<Admin> {
    public Admin login(Admin admin);

    public int forgetPassword(Admin admin);

    public int getCountByAdminName(String name);


}