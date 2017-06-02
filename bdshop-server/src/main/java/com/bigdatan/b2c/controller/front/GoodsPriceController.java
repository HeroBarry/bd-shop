package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.GoodsPrice;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.ICommonExchangeService;
import com.bigdatan.b2c.service.IGoodsPriceService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

;

/**
 * 商品规格前台服务controller
 */
@RestController
@RequestMapping("/front/goodsPrice/goodsPrice")
public class GoodsPriceController extends AbstractController {

    @Resource
    private IGoodsPriceService goodsPriceService;


    @Resource
    ICommonExchangeService commonExchangeService;

    /**
     * 查找商品
     */
    //@GetMapping("/getGoodsPriceById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getGoodsPriceById")
    public JsonResponse<GoodsPrice> getGoodsPriceById(Integer priceId,
                                                      HttpServletRequest request) {
        JsonResponse<GoodsPrice> result = new JsonResponse<GoodsPrice>();
        GoodsPrice goodsPrice = goodsPriceService.selectByPrimaryKey(priceId);
        if (goodsPrice != null) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(goodsPrice);
        }
        return result;
    }

    /**
     * 查找商品规格，已启用的，显示的实际价放在零售价字段里（依据用户不同价格不一样），购物车中的数量放在批发价字段里
     */
    //@GetMapping("/getGoodsPriceListByGoodsId")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getGoodsPriceListByGoodsId")
    public JsonResponse<List<GoodsPrice>> getGoodsPriceByGoodsId(
            Integer goodsId, HttpServletRequest request) {
        JsonResponse<List<GoodsPrice>> result = new JsonResponse<List<GoodsPrice>>();
        List<GoodsPrice> goodsPrice = goodsPriceService
                .findAllByGoodsIdAndNotState(goodsId, (byte) 2);
        if (goodsPrice != null) {
            User user = SessionUtil.getUser(request);

            goodsPrice = commonExchangeService.getCurrentUserGoodsprice(user, goodsPrice);
            result.setRes(SystemCode.SUCCESS);
            result.setObj(goodsPrice);
        } else {
            result.setRes(SystemCode.OBJ_NOT_EXISTS);
        }
        return result;
    }

}
