package com.bigdatan.b2c.service;

import com.bigdatan.b2c.entity.ShortMessageModel;
import util.JsonResponse;

import javax.servlet.http.HttpServletRequest;

public interface IShortMessageService extends IBaseService<ShortMessageModel> {
    public ShortMessageModel getCodeByPhone(String phone);

    public JsonResponse<String> sendMessage(HttpServletRequest request, String phone);

    public JsonResponse<String> checkCode(String phone, Integer code);
}