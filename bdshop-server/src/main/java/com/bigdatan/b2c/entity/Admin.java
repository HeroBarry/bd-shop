package com.bigdatan.b2c.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
@Data
public class Admin implements Serializable {
    /**
     * 管理员id
     */
    private Integer adminId;
    /**
     * 角色id
     */
    private Integer roleId;
    @Transient
    private Role role;

    /**
     * 管理账号名称
     */
    private String adminName;
    /**
     * 密码
     */
    private String password;
    /**
     * md5 随机码
     */
    private String rand;
    /**
     * 公司名称
     */
    private String companyName;
    /**
     * 描述
     */
    private String description;
    /**
     * 状态：1.开启 2.关闭
     */

    private Integer state;

    /**
     * 删除状态 1 已删除 2 未删除
     */

    private Integer delState;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    @Transient
    private List<Module> modules;// Session保存


}