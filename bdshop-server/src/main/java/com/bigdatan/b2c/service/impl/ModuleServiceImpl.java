package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.Module;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.ModuleMapper;
import com.bigdatan.b2c.service.IModuleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

;

/**
 *
 *
 * 系统模块服务接口实现
 */
@Service
@Transactional
public class ModuleServiceImpl extends BaseServiceImpl<Module> implements IModuleService {
    @Resource
    private ModuleMapper moduleMapper;

    @Override
    protected IBaseDao<Module> getMapper() {
        return this.moduleMapper;
    }

    @Override
    public List<Module> queryAllValidModule() {
        Module module = new Module();
        module.setState((byte) 1);
        return moduleMapper.getAllBySelect(module);
    }

    @Override
    public List<Module> queryRoleModule(int roleId) {
        return moduleMapper.selectByRoleId(roleId);

    }

    @Override
    public List<Module> queryModulesByAdminId(int adminId) {
        return moduleMapper.queryModulesByAdminId(adminId);
    }

}
