package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.Admin;

public interface IAdminService extends IBaseService<Admin> {
    public Admin login(Admin admin);

    public int forgetPassword(Admin admin);

    public int getCountByAdminName(String name);
}
