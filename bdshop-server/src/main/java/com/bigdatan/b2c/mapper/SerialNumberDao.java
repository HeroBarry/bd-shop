package com.bigdatan.b2c.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.Map;

/**
 */
public interface SerialNumberDao {
    public Map<String, String> getNum();

    public Integer update(@Param("date") String date, @Param("num") String num);

    void insert(@Param("date") String date, @Param("num") String num);
}
