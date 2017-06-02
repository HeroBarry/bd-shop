package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.mapper.AdminMapper;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.service.IAdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

;

@Service
@Transactional
public class AdminServiceImpl extends BaseServiceImpl<Admin> implements IAdminService {

    @Resource
    private AdminMapper adminMapper;

    @Override
    protected IBaseDao<Admin> getMapper() {
        return adminMapper;
    }

    @Override
    public Admin login(Admin user) {
        return adminMapper.login(user);
    }

    @Override
    public int forgetPassword(Admin user) {
        return adminMapper.forgetPassword(user);
    }

    @Override
    public int getCountByAdminName(String name) {
        return adminMapper.getCountByAdminName(name);
    }

}
