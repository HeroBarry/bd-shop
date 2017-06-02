package com.bigdatan.b2c.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 广告实体类
 */
@Data
public class Ad implements Serializable {
    /**
     * 广告id，主键，自增1
     */
    private Integer adId;
    /**
     * 广告位置id
     */
    ////@MultiLanguageField
    @Column(name = "ad_position_id")
    private Integer adPositionId;
    /**
     * 广告图像地址
     */
    ////@MultiLanguageField
    @Column(name = "image")
    private String image;
    /**
     * 广告描述
     */
    ////@MultiLanguageField
    @Column(name = "description")
    private String description;
    /**
     * 广告链接
     */
    ////@MultiLanguageField
    @Column(name = "url")
    private String url;
    /**
     * 状态，1开启 2关闭
     */
    ////@MultiLanguageField
    @Column(name = "state")
    private Integer state;

    /**
     * 删除状态 1 已删除 2 未删除
     */
    ////@MultiLanguageField
    @Column(name = "del_state")
    private Integer delState;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;



}
