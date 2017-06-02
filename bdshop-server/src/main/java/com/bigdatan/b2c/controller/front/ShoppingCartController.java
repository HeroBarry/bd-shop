package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.GoodsPrice;
import com.bigdatan.b2c.entity.ShoppingCart;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.ICommonExchangeService;
import com.bigdatan.b2c.service.IGoodsPriceService;
import com.bigdatan.b2c.service.IShoppingCartService;
import com.bigdatan.b2c.vo.ShoppingCartDetailVO;
import com.bigdatan.b2c.vo.ShoppingCartVo;
import com.bigdatan.b2c.vo.TotalPriveAndCategory;
import constant.SystemCode;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

;

/**
 * 购物车条目的前台controller
 */
@RestController
@RequestMapping("/front/shoppingcart/shoppingcart")
public class ShoppingCartController extends AbstractController {

    @Resource
    private IShoppingCartService shoppingCartService;
    @Resource
    private IGoodsPriceService goodsPriceService;// 用来第一次新增规格至购物车时查询goodsid
    @Resource
    ICommonExchangeService commonExchangeService;

    /**
     * 添加商品规格至购物车
     */
    //@GetMapping("/addOneToShoppingCart")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/addOneToShoppingCart")
    public JsonResponse<ShoppingCart> addOneToShoppingCart(
            ShoppingCart shoppingCart, HttpServletRequest request) {
        JsonResponse<ShoppingCart> result = new JsonResponse<ShoppingCart>();

        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        try {
            shoppingCart.setUserId(user.getUserId());
            ShoppingCart his = shoppingCartService
                    .queryShoppingCartByUserIdAndPriceId(shoppingCart);
            if (his == null) {
                // 该用户第一次购买该规格
                shoppingCart.setQuantity(1);
                shoppingCart.setIsBuy(1);// 1 表示购买
                shoppingCart.setCreateTime(new Date());
                shoppingCart.setUpdateTime(new Date());
                GoodsPrice goodsPrice = goodsPriceService
                        .findNormalGoodsPriceByPriceId(shoppingCart
                                .getPriceId());
                if (goodsPrice == null) {
                    throw new Exception("当前规格" + shoppingCart.getPriceId()
                            + "不存在！");
                }
                shoppingCart.setGoodsId(goodsPrice.getGoodsId());
                shoppingCartService.insertSelective(shoppingCart);
            } else {
                // 已购买过该规格，新增一个
                his.setQuantity(his.getQuantity() + 1);
                his.setUpdateTime(new Date());
                shoppingCartService.updateByPrimaryKeySelective(his);
            }
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname() + ",新增商品异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 减少购物车中的一个规格数量
     */
    //@GetMapping("/subOneToShoppingCart")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/subOneToShoppingCart")
    public JsonResponse<ShoppingCart> subOneToShoppingCart(
            ShoppingCart shoppingCart, HttpServletRequest request) {
        JsonResponse<ShoppingCart> result = new JsonResponse<ShoppingCart>();
        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }

        try {
            shoppingCart.setUserId(user.getUserId());
            ShoppingCart his = shoppingCartService
                    .queryShoppingCartByUserIdAndPriceId(shoppingCart);
            if (his == null) {
                throw new Exception("购物车中没有该用户购买规格" + shoppingCart.getPriceId()
                        + "的记录！");
            } else {
                // 已购买过该规格，减少一个
                int quantity = his.getQuantity();
                if (quantity > 1) {
                    his.setQuantity(quantity - 1);
                    his.setUpdateTime(new Date());
                    shoppingCartService.updateByPrimaryKeySelective(his);
                } else {
                    shoppingCartService.delete(his);
                }
            }
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname()
                    + ",删除购物车中的商品规格异常]", e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

    /**
     * 直接修改购物车中的规格数量
     */
    //@GetMapping("/editNumeberToShoppingCart")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editNumeberToShoppingCart")
    public JsonResponse<ShoppingCart> editNumeberToShoppingCart(
            ShoppingCart shoppingCart, HttpServletRequest request) {
        JsonResponse<ShoppingCart> result = new JsonResponse<ShoppingCart>();
        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        try {
            shoppingCart.setUserId(user.getUserId());
            ShoppingCart his = shoppingCartService
                    .queryShoppingCartByUserIdAndPriceId(shoppingCart);
            if (his == null) {
                // 该用户第一次购买该规格
                shoppingCart.setCreateTime(new Date());
                shoppingCart.setUpdateTime(new Date());
                shoppingCart.setIsBuy(1);// 1 表示购买
                GoodsPrice goodsPrice = goodsPriceService
                        .findNormalGoodsPriceByPriceId(shoppingCart
                                .getPriceId());
                if (goodsPrice == null) {
                    throw new Exception("当前规格" + shoppingCart.getPriceId()
                            + "不存在！");
                }
                shoppingCart.setGoodsId(goodsPrice.getGoodsId());
                shoppingCartService.insertSelective(shoppingCart);
            } else {
                // 已购买过该规格，修改数据

                if (shoppingCart.getQuantity() == 0) {
                    // 直接修改数据为0，则删掉
                    shoppingCartService.delete(his);
                } else {
                    his.setIsBuy(1);//shoppingCart.setIsBuy(1);// 1 表示购买
                    his.setQuantity(shoppingCart.getQuantity());
                    his.setUpdateTime(new Date());
                    shoppingCartService.updateByPrimaryKeySelective(his);
                }
            }
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname()
                    + ",直接修改购物车中的规格数量异常]", e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

    /**
     * 查询当前登录用户所有准备购买的规格 如果用户未登录，则返回SystemCode.NO_LOGIN
     *
     * @param request
     * @return
     */
    //@GetMapping("/queryCurrentUserAllBuyShoppingCart")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryCurrentUserAllBuyShoppingCart")
    public JsonResponse<List<ShoppingCart>> queryCurrentUserAllBuyShoppingCart(
            HttpServletRequest request) {
        JsonResponse<List<ShoppingCart>> result = new JsonResponse<List<ShoppingCart>>();

        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        try {
            List<ShoppingCart> resultlist = shoppingCartService
                    .queryAllBuyShoppingCartByUserId(user.getUserId());
            result.setRes(SystemCode.SUCCESS);
            result.setObj(resultlist);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname()
                    + ",查询当前登录用户所有准备购买的规格异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 删除当前登录用户所有准备购买的规格 如果用户未登录，则返回SystemCode.NO_LOGIN
     *
     * @param request
     * @return
     */
    //@GetMapping("/delCurrentUserAllBuyShoppingCart")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/delCurrentUserAllBuyShoppingCart")
    public JsonResponse<List<ShoppingCart>> delCurrentUserAllBuyShoppingCart(
            HttpServletRequest request) {
        JsonResponse<List<ShoppingCart>> result = new JsonResponse<List<ShoppingCart>>();

        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        try {
            shoppingCartService.delAllBuyShoppingCartByUserId(user.getUserId());
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname()
                    + ",删除当前登录用户所有准备购买的规格异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 删除当前登录用户所有购物车中的规格，即清空购物车 如果用户未登录，则返回SystemCode.NO_LOGIN
     *
     * @param request
     * @return
     */
    //@GetMapping("/delCurrentUserAllShoppingCart")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/delCurrentUserAllShoppingCart")
    public JsonResponse<List<ShoppingCart>> delCurrentUserAllShoppingCart(
            HttpServletRequest request) {
        JsonResponse<List<ShoppingCart>> result = new JsonResponse<List<ShoppingCart>>();

        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        try {
            shoppingCartService.delAllShoppingCartByUserId(user.getUserId());
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname()
                    + ",删除当前登录用户所有准备购买的规格异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 查询当前用户购买总种类数和总金额
     */
    //@GetMapping("/queryCurrentUserTotalPriceAndCategory")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryCurrentUserTotalPriceAndCategory")
    public JsonResponse<TotalPriveAndCategory> queryCurrentUserTotalPriceAndCategory(
            ShoppingCart shoppingCart, HttpServletRequest request) {
        JsonResponse<TotalPriveAndCategory> result = new JsonResponse<TotalPriveAndCategory>();
        User user = SessionUtil.getUser(request);
        TotalPriveAndCategory totalPriveAndCategory = new TotalPriveAndCategory();
        if (user != null && StringUtils.isBlank(user.getPhone()) == false) {
            List<ShoppingCart> resultList = shoppingCartService
                    .queryAllBuyShoppingCartByUserId(user.getUserId());
            totalPriveAndCategory = commonExchangeService
                    .getCurrentUserTotalPrice(user, resultList);
        }
        result.setRes(SystemCode.SUCCESS);
        result.setObj(totalPriveAndCategory);
        return result;
    }


    //@GetMapping("/queryShoppingCartInfo")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryShoppingCartInfo")
    public JsonResponse<ShoppingCartVo> queryShoppingCartInfo(
            HttpServletRequest request) {
        JsonResponse<ShoppingCartVo> result = new JsonResponse<ShoppingCartVo>();
        User user = SessionUtil.getUser(request);
        if (null == user || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        ShoppingCartVo shoppingCartVo = shoppingCartService
                .queryShoppingCartInfo(user);
        result.setObj(shoppingCartVo);
        result.setRes(SystemCode.SUCCESS);
        return result;
    }

    /**
     * 获取当前登录用户的购物车中所有条目，以供通过视图删减规格数量和确认是否购买
     *
     * @param request
     * @return
     */
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryShoppingCartDetailVO")
    //@GetMapping("/queryShoppingCartDetailVO")
    public JsonResponse<PageResult<ShoppingCartDetailVO>> queryShoppingCartDetailVO(
            PageResult<ShoppingCartDetailVO> page, HttpServletRequest request) {
        JsonResponse<PageResult<ShoppingCartDetailVO>> result = new JsonResponse<PageResult<ShoppingCartDetailVO>>();

        User user = SessionUtil.getUser(request);
        if (user == null || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        try {
            shoppingCartService.queryShoppingCartDetailVOByUserId(page,
                    user.getUserId());
            List<ShoppingCartDetailVO> listResult = page.getDataList();
            listResult = this.commonExchangeService
                    .getCurrentUserGoodspriceForShoppingCartDetailVO(user,
                            listResult);
            page.setDataList(listResult);
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname()
                    + ",获取当前登录用户的购物车中所有条目异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 翻转当前登录人对某规格产品的购买标志
     *
     * @param cartId
     * @param request
     * @return
     */

    //@GetMapping("/invertIsBuy")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/invertIsBuy")
    public JsonResponse<ShoppingCartVo> invertIsBuy(
            ShoppingCartDetailVO cartId, HttpServletRequest request) {
        JsonResponse<ShoppingCartVo> result = new JsonResponse<ShoppingCartVo>();
        User user = SessionUtil.getUser(request);
        if (null == user || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setPriceId(cartId.getPriceId());
        shoppingCart.setUserId(user.getUserId());
        ShoppingCart selectReult = shoppingCartService
                .queryShoppingCartByUserIdAndPriceId(shoppingCart);
        if (selectReult == null) {
            // 已删除，不用翻转
            result.setRes(SystemCode.SUCCESS);
        } else {
            selectReult.setIsBuy(selectReult.getIsBuy() % 2 + 1);
            selectReult.setUpdateTime(new Date());
            try {
                shoppingCartService.updateByPrimaryKeySelective(selectReult);
                result.setRes(SystemCode.SUCCESS);
            } catch (Exception e) {
                logError(request,
                        "[admin:" + user.getNickname() + ",翻转购买标志异常]", e);
                result.setRes(SystemCode.FAILURE);
            }
        }
        return result;
    }

    /**
     * 用于前台翻转所有购物条目的购买标志
     *
     * @param shoppingCart
     * @param request
     * @return
     */
    //@GetMapping("/reSetIsBuyState")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/reSetIsBuyState")
    public JsonResponse<ShoppingCart> reSetIsBuyState(
            ShoppingCart shoppingCart, HttpServletRequest request) {
        JsonResponse<ShoppingCart> result = new JsonResponse<ShoppingCart>();
        User user = SessionUtil.getUser(request);
        if (null == user || StringUtils.isBlank(user.getPhone())) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }

        if (shoppingCart == null) {
            result.setRes(SystemCode.FAILURE);
            return result;
        }
        shoppingCart.setUserId(user.getUserId());
        try {
            shoppingCartService
                    .updateAllIsBuyStateByUserIdAndisBuyValue(shoppingCart);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + user.getNickname() + ",翻转所有购买标志异常]",
                    e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

}
