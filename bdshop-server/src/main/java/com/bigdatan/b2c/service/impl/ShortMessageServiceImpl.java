package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.ShortMessageModel;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.IShortMessageMapper;
import com.bigdatan.b2c.service.IShortMessageService;
import constant.SystemCode;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.AvoidSubmit;
import util.JsonResponse;
import util.SendMessage;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.security.MessageDigest;
import java.util.Date;
import java.util.Random;

;
@Transactional
@Service
public class ShortMessageServiceImpl extends BaseServiceImpl<ShortMessageModel> implements IShortMessageService {
    @Resource
    private IShortMessageMapper shortMessageMapper;
    private static Logger log = Logger.getLogger(ShortMessageServiceImpl.class);

    @Override
    protected IBaseDao<ShortMessageModel> getMapper() {
        return shortMessageMapper;
    }

    @Override
    public ShortMessageModel getCodeByPhone(String phone) {
        return shortMessageMapper.getCodeByPhone(phone);
    }

    /**
     * @param request
     * @param phone
     * @return 发送短息
     */
    public JsonResponse<String> sendMessage(HttpServletRequest request, String phone) {
        JsonResponse<String> result = new JsonResponse<String>(SystemCode.FAILURE);
        if (!AvoidSubmit.invokeNum(request)) {
            // 请求通过
            int randCode = new Random().nextInt(888888) + 111111;
//				String str = "121";
            System.out.println("======randCode======="+randCode);
            String str = SendMessage.regist(phone, randCode);

            if (!("".equals(str))) {
                // 短信下发成功
                ShortMessageModel messageModel = new ShortMessageModel();
                messageModel.setPhone(phone);
                messageModel.setCode(randCode);
                messageModel.setCreateTime(new Date());
                messageModel.setUpdateTime(new Date());
                try {
                    shortMessageMapper.insertSelective(messageModel);
                    result.setRes(SystemCode.SUCCESS);
                } catch (Exception e) {
                    log.error("短信验证码插入失败", e);
                }
            }
        } else {
            result.setRes(SystemCode.OFTEN);
        }
        return result;
    }

    /**
     * @param phone
     * @param code
     * @return 检验短信验证码
     */
    public JsonResponse<String> checkCode(String phone, Integer code) {
        JsonResponse<String> result = new JsonResponse<String>(SystemCode.INNER_ERROR);
        ShortMessageModel model = shortMessageMapper.getCodeByPhone(phone);
        if (model != null) {
            // 验证码正确
            if (model.getState() == 2) {
                // 该验证码已经验证过了 不可重复使用
                result.setRes(SystemCode.OBJ_EXISTS);
            } else {
                if (new Date().getTime() - model.getCreateTime().getTime() > 60 * 1000) {
                    // 超过10分钟 已失效
                    result.setRes(SystemCode.TIME_OUT);
                } else {
                    // 判断用户输入的code和短信表里的code是否相同
                    if (!(code.equals(model.getCode()))) {
                        return result;
                    }

                    int id = model.getMessageId();
                    model = new ShortMessageModel();
                    model.setUpdateTime(new Date());
                    model.setMessageId(id);
                    model.setState((byte) 2);
                    try {
                        shortMessageMapper.updateByPrimaryKeySelective(model);
                    } catch (Exception e) {
                        log.error("[更新验证码状态失败]", e);
                    }
                    result.setRes(SystemCode.SUCCESS);
                }
            }
        }
        return result;
    }

    private static String sendCode(String phone, int randCode) {


        return "";
    }

    private static String toMD5(String plainText) {
        StringBuffer buf = new StringBuffer("");
        try {
            // 生成实现指定摘要算法的 MessageDigest 对象。
            MessageDigest md = MessageDigest.getInstance("MD5");
            // 使用指定的字节数组更新摘要。
            md.update(plainText.getBytes());
            // 通过执行诸如填充之类的最终操作完成哈希计算。
            byte b[] = md.digest();
            // 生成具体的md5密码到buf数组
            int i;
            for (int offset = 0; offset < b.length; offset++) {
                i = b[offset];
                if (i < 0)
                    i += 256;
                if (i < 16)
                    buf.append("0");
                buf.append(Integer.toHexString(i));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return buf.toString();
    }

}
