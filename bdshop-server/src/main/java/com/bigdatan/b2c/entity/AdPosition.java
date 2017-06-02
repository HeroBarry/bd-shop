package com.bigdatan.b2c.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * 广告位置实体类
 */
@Data
public class AdPosition implements Serializable {
    /**
     * 广告位置id，主键，自增1
     */
    private Integer adPositionId;
    /**
     * 广告名称
     */
    private String name;
    /**
     * 位置
     */
    private String position;
    /**
     * 尺寸
     */
    private String measure;
    /**
     * 状态，1开启 2关闭
     */
    private Integer state;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;


}
