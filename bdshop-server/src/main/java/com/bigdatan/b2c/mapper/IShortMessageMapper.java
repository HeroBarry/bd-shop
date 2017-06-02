package com.bigdatan.b2c.mapper;

import com.bigdatan.b2c.entity.ShortMessageModel;
import org.apache.ibatis.annotations.Param;

public interface IShortMessageMapper extends IBaseDao<ShortMessageModel> {
    public ShortMessageModel getCodeByPhone(@Param("phone") String phone);
}