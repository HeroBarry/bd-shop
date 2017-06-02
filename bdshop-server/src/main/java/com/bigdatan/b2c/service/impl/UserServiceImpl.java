package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.entity.UserPayment;
import com.bigdatan.b2c.entity.UserPrivilege;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.UserMapper;
import com.bigdatan.b2c.mapper.UserPaymentMapper;
import com.bigdatan.b2c.mapper.UserPrivilegeMapper;
import com.bigdatan.b2c.service.IUserService;
import com.github.pagehelper.PageHelper;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import util.PageResult;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

;
;
@Transactional
@Service
public class UserServiceImpl extends BaseServiceImpl<User> implements IUserService {
    private static Logger logger = Logger.getLogger(UserServiceImpl.class);
    @Resource
    private UserMapper userMapper;
    @Resource
    private UserPrivilegeMapper userPrivilegeMapper;
    @Resource
    private UserPaymentMapper userPaymentMapper;

    @Override
    protected IBaseDao<User> getMapper() {
        return userMapper;
    }

    @Override
    public User getOneByOpenid(String openid) {
        return userMapper.getOneByOpenid(openid);
    }

    @Override
    public User getOneByPhone(String phone) {
        return userMapper.getOneByPhone(phone);
    }

    @Override
    public int updatePhone(String phone, String openid) {
        return userMapper.updatePhone(phone, openid);
    }

    @Override
    public int getCountByPhone(String phone) {
        return userMapper.getCountByPhone(phone);
    }

    public UserMapper getUserMapper() {
        return userMapper;
    }

    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public String getAllFrontUser() {
        return userMapper.getAllFrontUser();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = {Exception.class})
    public void grantPrivilege(UserPrivilege userPrivilege, List<UserPayment> userPayments) throws Exception {
        try {
            UserPrivilege userPrivilegeFormDB = userPrivilegeMapper.selectAllByUserId(userPrivilege.getUserId());
            if (null == userPrivilegeFormDB) {
                userPrivilegeMapper.insertSelective(userPrivilege);
            } else {
                userPrivilege.setCreateTime(null);
                userPrivilege.setPrivilegeId(userPrivilegeFormDB.getPrivilegeId());
                userPrivilegeMapper.updateByPrimaryKeySelective(userPrivilege);
            }

            if (null != userPayments) {
                List<UserPayment> userPaymentsFromDBs = userPaymentMapper.selectByUserId(userPrivilege.getUserId());
                List<UserPayment> userPaymentsInDBs = userPayments;

                List<UserPayment> userPaymentOutDBs = new ArrayList<UserPayment>();
                boolean flag = false;
                if (null != userPaymentsFromDBs && userPaymentsFromDBs.size() > 0) {
                    for (UserPayment payment : userPaymentsFromDBs) {
                        for (UserPayment userPayment : userPayments) {
                            if (payment.getPaymentId() == userPayment.getPaymentId()) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            userPaymentOutDBs.add(payment);
                        }
                    }
                }

                if (null != userPaymentOutDBs) {
                    for (UserPayment userPayment : userPaymentOutDBs) {
                        if (null != userPayment) {
                            userPaymentMapper.delete(userPayment);
                        }
                    }
                }

                if (null != userPaymentsInDBs && userPaymentsInDBs.size() > 0) {
                    Iterator<UserPayment> iterator = userPaymentsInDBs.iterator();
                    while (iterator.hasNext()) {
                        UserPayment payment = iterator.next();
                        for (UserPayment userPayment : userPaymentsFromDBs) {
                            if (payment.getPaymentId() == userPayment.getPaymentId()) {
                                iterator.remove();
                            }
                        }
                    }
                }

                if (null != userPaymentsInDBs) {
                    for (UserPayment userPayment : userPaymentsInDBs) {
                        if (null != userPayment) {
                            userPaymentMapper.insertSelective(userPayment);
                        }
                    }
                }
            }

        } catch (Exception e) {
            logger.error("添加数据失败", e);
        }
    }

    @Override
    public PageResult<User> getUsersByUserIds(PageResult<User> page, String userIds) {
        int pageNo = page.getPageNo();
        int pageSize = page.getPageSize();
        pageNo = pageNo == 0 ? 1 : pageNo;
        pageSize = pageSize == 0 ? 10 : pageSize;
        PageHelper.startPage(pageNo, pageSize);
        return PageResult.toPageResult(this.getUsers(userIds), page);

    }

    private List<User> getUsers(String userIds) {
        List<User> list = null;
        try {
            list = userMapper.getUsersByPage(userIds);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return list;
    }

}
