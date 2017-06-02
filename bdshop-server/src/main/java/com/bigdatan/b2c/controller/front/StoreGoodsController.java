package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.StoreGoods;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.IStoreGoodsService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

;

/**
 * 收藏controller
 */
@RestController
@RequestMapping("/front/storegoods/storegoods")
public class StoreGoodsController extends AbstractController {

    @Resource
    private IStoreGoodsService storeGoodsService;

    /**
     * 收藏或取消收藏一个商品，用state标志操作类型，1为收藏，其余为取消收藏
     *
     * @param storeGoods
     * @param request
     * @return
     */
    //@GetMapping("/addOrSubStoreGoods")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/addOrSubStoreGoods")
    public JsonResponse<StoreGoods> queryShoppingCartInfo(
            StoreGoods storeGoods, HttpServletRequest request) {
        JsonResponse<StoreGoods> result = new JsonResponse<StoreGoods>();
        User user = SessionUtil.getUser(request);
        if (null == user) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        if (storeGoods == null) {
            result.setRes(SystemCode.FAILURE);
            return result;
        }
        try {
            storeGoods.setUserId(user.getUserId());
            if (storeGoods.getState() == 1) {
                // 收藏
                StoreGoods temp = storeGoodsService
                        .queryStoreGoodsByUserIdAndGoodsId(storeGoods);
                if (temp == null) {
                    // 没有收藏过
                    storeGoods.setCreateTime(new Date());
                    storeGoods.setUpdateTime(new Date());
                    storeGoods.setState(1);
                    storeGoodsService.insertSelective(storeGoods);
                } else {
                    // 已经收藏过
                    temp.setUpdateTime(new Date());
                    storeGoodsService.updateByPrimaryKeySelective(temp);
                }
            } else {
                // 取消收藏
                storeGoodsService.delete(storeGoods);
            }
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception ex) {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

}
