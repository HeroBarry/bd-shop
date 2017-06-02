package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.entity.Goods;
import com.bigdatan.b2c.entity.GoodsPrice;
import com.bigdatan.b2c.entity.StoreGoods;
import com.bigdatan.b2c.entity.User;
import com.bigdatan.b2c.service.ICommonExchangeService;
import com.bigdatan.b2c.service.IGoodsPriceService;
import com.bigdatan.b2c.service.IGoodsService;
import com.bigdatan.b2c.service.IStoreGoodsService;
import com.bigdatan.b2c.vo.GoodsVO;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

;

/**
 *
 * 商品管理模块 前台
 */
@RestController
@RequestMapping("/front/goods/goods")
public class GoodsController {

    @Resource
    private IGoodsService goodsService;
    @Resource
    ICommonExchangeService commonExchangeService;
    @Resource
    private IGoodsPriceService goodsPriceService;
    @Resource
    private IStoreGoodsService storeGoodsService;

    /**
     * 商品列表
     */

    //@GetMapping("/getGoodsByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getGoodsByPage")
    public JsonResponse<PageResult<Goods>> getGoodsByPage(
            PageResult<Goods> page, Goods goods, HttpServletRequest request) {
        JsonResponse<PageResult<Goods>> result = new JsonResponse<PageResult<Goods>>();
        goodsService.queryByPageFront(page, goods);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 商品详情
     */

    //@GetMapping("/getGoodsById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getGoodsById")
    public JsonResponse<Goods> getGoodsById(Integer goodsId,
                                            HttpServletRequest request) {
        JsonResponse<Goods> result = new JsonResponse<Goods>();
        Goods goods = goodsService.selectByPrimaryKey(goodsId);
        if (goods != null) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(goods);
        }
        return result;
    }

    /**
     * 依据商品分类id获取所有商品，供前台调用
     */
    //@GetMapping("/getPageFrontByGoodsCategory")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getPageFrontByGoodsCategory")
    public JsonResponse<List<GoodsVO>> getPageFrontByGoodsCategory(Goods goods,
                                                                   HttpServletRequest request) {
        JsonResponse<List<GoodsVO>> result = new JsonResponse<List<GoodsVO>>();
        List<Goods> goodsList = goodsService.getPageFrontByGoodsCategory(goods);
        if (goodsList != null) {
            List<GoodsVO> goodsVOList = new ArrayList<GoodsVO>();
            if (goodsList != null) {
                // 获取商品规格
                for (int i = 0; i < goodsList.size(); i++) {
                    Goods tempGoods = goodsList.get(i);
                    GoodsVO temGoodsVO = new GoodsVO(tempGoods);
                    User user = SessionUtil.getUser(request);
                    List<GoodsPrice> listGoodsPrice = goodsPriceService
                            .findAllNormalGoodsPriceByGoodsId(tempGoods
                                    .getGoodsId());
                    // 换算价格
                    listGoodsPrice = commonExchangeService
                            .getCurrentUserGoodsprice(user, listGoodsPrice);
                    if (listGoodsPrice == null || listGoodsPrice.size() == 0) {
                        temGoodsVO.setVo_countGoodsPrice(0);
                    } else {
                        temGoodsVO.setVo_countGoodsPrice(listGoodsPrice.size());
                        for (int j = 0; j < listGoodsPrice.size(); j++) {
                            if (temGoodsVO.getVo_retailPrice() == 0) {
                                temGoodsVO.setVo_retailPrice(listGoodsPrice
                                        .get(j).getRetailPrice());
                            } else if (temGoodsVO.getVo_retailPrice() > listGoodsPrice
                                    .get(j).getRetailPrice()) {
                                temGoodsVO.setVo_retailPrice(listGoodsPrice
                                        .get(j).getRetailPrice());
                            }
                        }

                        temGoodsVO.setVo_shoppingCartNum(listGoodsPrice.get(0)
                                .getBuyPrice());
                        temGoodsVO.setVo_priceId(listGoodsPrice.get(0)
                                .getPriceId());
                        temGoodsVO.setVo_unitName(listGoodsPrice.get(0)
                                .getUnitName());
                    }
                    goodsVOList.add(temGoodsVO);
                }
            }
            result.setRes(SystemCode.SUCCESS);
            result.setObj(goodsVOList);
        }
        return result;
    }

    /**
     * 依据商品分类id获取所有商品，供前台调用，传的是VO对象，包含商品所有信息及附加信息
     */
    @ResponseBody
    @RequestMapping("/getPageFrontVOByGoodsCategory")
    public JsonResponse<PageResult<GoodsVO>> getPageFrontVOByGoodsCategory(
            PageResult<Goods> page, Goods goods, HttpServletRequest request) {
        JsonResponse<PageResult<GoodsVO>> result = new JsonResponse<PageResult<GoodsVO>>();
        int category =-1;
        try {
            category = Integer.parseInt(java.net.URLDecoder.decode(Integer.toString(goods.getCategoryId()), "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            category=-1;
            e.printStackTrace();
        }
        goods.setCategoryId(category);
        goodsService.getPageFrontByGoodsCategory(page, goods);
        List<Goods> goodsList = page.getDataList();
        List<GoodsVO> goodsVOList = new ArrayList<GoodsVO>();
        PageResult<GoodsVO> resultVO = new PageResult<GoodsVO>();
        resultVO.setPageNo(page.getPageNo());
        resultVO.setPages(page.getPages());
        resultVO.setPageSize(page.getPageSize());
        resultVO.setTotal(page.getTotal());
        if (goodsList != null) {
            // 获取商品规格
            for (int i = 0; i < goodsList.size(); i++) {
                Goods tempGoods = goodsList.get(i);
                GoodsVO temGoodsVO = new GoodsVO(tempGoods);
                User user = SessionUtil.getUser(request);
                List<GoodsPrice> listGoodsPrice = goodsPriceService
                        .findAllNormalGoodsPriceByGoodsId(tempGoods
                                .getGoodsId());
                // 换算价格
                listGoodsPrice = commonExchangeService
                        .getCurrentUserGoodsprice(user, listGoodsPrice);
                if (listGoodsPrice == null || listGoodsPrice.size() == 0) {
                    temGoodsVO.setVo_countGoodsPrice(0);
                } else {
                    temGoodsVO.setVo_countGoodsPrice(listGoodsPrice.size());

                    for (int j = 0; j < listGoodsPrice.size(); j++) {
                        if (temGoodsVO.getVo_retailPrice() == 0) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        } else if (temGoodsVO.getVo_retailPrice() > listGoodsPrice
                                .get(j).getRetailPrice()) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        }
                    }

                    temGoodsVO.setVo_shoppingCartNum(listGoodsPrice.get(0)
                            .getBuyPrice());
                    temGoodsVO
                            .setVo_priceId(listGoodsPrice.get(0).getPriceId());
                    temGoodsVO.setVo_unitName(listGoodsPrice.get(0)
                            .getUnitName());
                }
                goodsVOList.add(temGoodsVO);
            }
            resultVO.setDataList(goodsVOList);
            result.setRes(SystemCode.SUCCESS);
            result.setObj(resultVO);
        }
        return result;
    }

    /**
     * 分页获取推荐的上架商品，依据更新时间倒序取商品,不含删除状态，供前端调用，传的是VO对象，包含商品所有信息及附加信息
     */
    @ResponseBody
    @RequestMapping("/getPageFrontRecommendAndIsMarketableGoods")
    public JsonResponse<PageResult<GoodsVO>> getPageFrontRecommendAndIsMarketableGoods(
            PageResult<Goods> page,  HttpServletRequest request) {
        JsonResponse<PageResult<GoodsVO>> result = new JsonResponse<PageResult<GoodsVO>>();
        goodsService.getPageFrontRecommendAndIsMarketableGoods(page);
        List<Goods> goodsList = page.getDataList();
        List<GoodsVO> goodsVOList = new ArrayList<GoodsVO>();
        PageResult<GoodsVO> resultVO = new PageResult<GoodsVO>();
        resultVO.setPageNo(page.getPageNo());
        resultVO.setPages(page.getPages());
        resultVO.setPageSize(page.getPageSize());
        resultVO.setTotal(page.getTotal());
        if (goodsList != null) {
            // 获取商品规格
            for (int i = 0; i < goodsList.size(); i++) {
                Goods tempGoods = goodsList.get(i);
                GoodsVO temGoodsVO = new GoodsVO(tempGoods);
                User user = SessionUtil.getUser(request);
                List<GoodsPrice> listGoodsPrice = goodsPriceService
                        .findAllNormalGoodsPriceByGoodsId(tempGoods
                                .getGoodsId());
                // 换算价格
                listGoodsPrice = commonExchangeService
                        .getCurrentUserGoodsprice(user, listGoodsPrice);
                if (listGoodsPrice == null || listGoodsPrice.size() == 0) {
                    temGoodsVO.setVo_countGoodsPrice(0);
                } else {
                    temGoodsVO.setVo_countGoodsPrice(listGoodsPrice.size());

                    for (int j = 0; j < listGoodsPrice.size(); j++) {
                        if (temGoodsVO.getVo_retailPrice() == 0) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        } else if (temGoodsVO.getVo_retailPrice() > listGoodsPrice
                                .get(j).getRetailPrice()) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        }
                    }

                    temGoodsVO.setVo_shoppingCartNum(listGoodsPrice.get(0)
                            .getBuyPrice());
                    temGoodsVO
                            .setVo_priceId(listGoodsPrice.get(0).getPriceId());
                    temGoodsVO.setVo_unitName(listGoodsPrice.get(0)
                            .getUnitName());
                }
                goodsVOList.add(temGoodsVO);
            }
        }
        resultVO.setDataList(goodsVOList);
        result.setRes(SystemCode.SUCCESS);
        result.setObj(resultVO);
        return result;
    }


    /**
     * 依据商品id获取商品详情，供前台调用
     * 商品的delstate保存收藏状态，1为收藏，0为未收藏
     */
    @ResponseBody
    @RequestMapping("/getPageFrontByGoodsId")
    public JsonResponse<List<GoodsVO>> getPageFrontByGoodsId(Goods goods,
                                                             HttpServletRequest request) {
        JsonResponse<List<GoodsVO>> result = new JsonResponse<List<GoodsVO>>();
        try {
            List<Goods> goodsList = new ArrayList<Goods>();
            Goods tempgoods = goodsService.selectByPrimaryKey(goods
                    .getGoodsId());
            if (tempgoods != null) {
                //获取商品的收藏状态
                User user = SessionUtil.getUser(request);
                if(user==null){
                    tempgoods.setDelState((byte)0);//未收藏
                }else{
                    StoreGoods storeGoods =new StoreGoods();
                    storeGoods.setUserId(user.getUserId());
                    storeGoods.setGoodsId(tempgoods.getGoodsId());
                    if(storeGoodsService.queryStoreGoodsByUserIdAndGoodsId(storeGoods)==null){
                        //没有收藏记录
                        tempgoods.setDelState((byte)0);//未收藏
                    }else{
                        tempgoods.setDelState((byte)1);//已收藏
                    }
                }

                goodsList.add(tempgoods);
                List<GoodsVO> goodsVOList = new ArrayList<GoodsVO>();
                if (goodsList != null) {
                    // 获取商品规格
                    for (int i = 0; i < goodsList.size(); i++) {
                        Goods tempGoods = goodsList.get(i);
                        GoodsVO temGoodsVO = new GoodsVO(tempGoods);
                        //User user = SessionUtil.getUser(request);
                        List<GoodsPrice> listGoodsPrice = goodsPriceService
                                .findAllNormalGoodsPriceByGoodsId(tempGoods
                                        .getGoodsId());
                        // 换算价格
                        listGoodsPrice = commonExchangeService
                                .getCurrentUserGoodsprice(user, listGoodsPrice);
                        if (listGoodsPrice == null
                                || listGoodsPrice.size() == 0) {
                            temGoodsVO.setVo_countGoodsPrice(0);
                        } else {
                            temGoodsVO.setVo_countGoodsPrice(listGoodsPrice
                                    .size());
                            for (int j = 0; j < listGoodsPrice.size(); j++) {
                                if (temGoodsVO.getVo_retailPrice() == 0) {
                                    temGoodsVO.setVo_retailPrice(listGoodsPrice
                                            .get(j).getRetailPrice());
                                } else if (temGoodsVO.getVo_retailPrice() > listGoodsPrice
                                        .get(j).getRetailPrice()) {
                                    temGoodsVO.setVo_retailPrice(listGoodsPrice
                                            .get(j).getRetailPrice());
                                }
                            }

                            temGoodsVO.setVo_shoppingCartNum(listGoodsPrice
                                    .get(0).getBuyPrice());
                            temGoodsVO.setVo_priceId(listGoodsPrice.get(0)
                                    .getPriceId());
                            temGoodsVO.setVo_unitName(listGoodsPrice.get(0)
                                    .getUnitName());
                        }
                        goodsVOList.add(temGoodsVO);
                    }
                }
                result.setRes(SystemCode.SUCCESS);
                result.setObj(goodsVOList);
            }
        } catch (Exception ex) {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 依据商品名称模糊查询商品，供前台调用，传的是VO对象，包含商品所有信息及附加信息
     */
    @ResponseBody
    @RequestMapping("/getPageFrontVOByGoodsName")
    public JsonResponse<PageResult<GoodsVO>> getPageFrontVOByGoodsName(
            PageResult<Goods> page, Goods goods, HttpServletRequest request) {
        JsonResponse<PageResult<GoodsVO>> result = new JsonResponse<PageResult<GoodsVO>>();
        String serviceNames ="";
        try {
            serviceNames = java.net.URLDecoder.decode(goods.getGoodsName(), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            serviceNames="";
            e.printStackTrace();
        }
        goods.setGoodsName(serviceNames);
        goodsService.getPageFrontByGoodsName(page, goods);
        PageResult<GoodsVO> resultVO = new PageResult<GoodsVO>();
        resultVO.setPageNo(page.getPageNo());
        resultVO.setPages(page.getPages());
        resultVO.setPageSize(page.getPageSize());
        resultVO.setTotal(page.getTotal());

        List<Goods> goodsList = page.getDataList();
        List<GoodsVO> goodsVOList = new ArrayList<GoodsVO>();
        if (goodsList != null) {
            // 获取商品规格
            for (int i = 0; i < goodsList.size(); i++) {
                Goods tempGoods = goodsList.get(i);
                GoodsVO temGoodsVO = new GoodsVO(tempGoods);
                User user = SessionUtil.getUser(request);
                List<GoodsPrice> listGoodsPrice = goodsPriceService
                        .findAllNormalGoodsPriceByGoodsId(tempGoods
                                .getGoodsId());
                // 换算价格
                listGoodsPrice = commonExchangeService
                        .getCurrentUserGoodsprice(user, listGoodsPrice);
                if (listGoodsPrice == null || listGoodsPrice.size() == 0) {
                    temGoodsVO.setVo_countGoodsPrice(0);
                } else {
                    temGoodsVO.setVo_countGoodsPrice(listGoodsPrice.size());
                    for (int j = 0; j < listGoodsPrice.size(); j++) {
                        if (temGoodsVO.getVo_retailPrice() == 0) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        } else if (temGoodsVO.getVo_retailPrice() > listGoodsPrice
                                .get(j).getRetailPrice()) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        }
                    }

                    temGoodsVO.setVo_shoppingCartNum(listGoodsPrice.get(0)
                            .getBuyPrice());
                    temGoodsVO.setVo_priceId(listGoodsPrice.get(0)
                            .getPriceId());
                    temGoodsVO.setVo_unitName(listGoodsPrice.get(0)
                            .getUnitName());
                }
                goodsVOList.add(temGoodsVO);
            }
            resultVO.setDataList(goodsVOList);
            result.setRes(SystemCode.SUCCESS);
            result.setObj(resultVO);
        }
        return result;
    }

    /**
     * 依据商品名称模糊查询商品，供前台调用，传的是VO对象，包含商品所有信息及附加信息
     */
    @ResponseBody
    @RequestMapping("/getPageFrontByMyStoreGoods")
    public JsonResponse<PageResult<GoodsVO>> getPageFrontByMyStoreGoods(
            PageResult<Goods> page,  HttpServletRequest request) {
        JsonResponse<PageResult<GoodsVO>> result = new JsonResponse<PageResult<GoodsVO>>();
        User user = SessionUtil.getUser(request);
        if (user == null) {
            result.setRes(SystemCode.NO_LOGIN);
            return result;
        }
        goodsService.getPageFrontByMyStoreGoods(page, user.getUserId());
        PageResult<GoodsVO> resultVO = new PageResult<GoodsVO>();
        resultVO.setPageNo(page.getPageNo());
        resultVO.setPages(page.getPages());
        resultVO.setPageSize(page.getPageSize());
        resultVO.setTotal(page.getTotal());

        List<Goods> goodsList = page.getDataList();
        List<GoodsVO> goodsVOList = new ArrayList<GoodsVO>();
        if (goodsList != null) {
            // 获取商品规格
            for (int i = 0; i < goodsList.size(); i++) {
                Goods tempGoods = goodsList.get(i);
                GoodsVO temGoodsVO = new GoodsVO(tempGoods);
                List<GoodsPrice> listGoodsPrice = goodsPriceService
                        .findAllNormalGoodsPriceByGoodsId(tempGoods
                                .getGoodsId());
                // 换算价格
                listGoodsPrice = commonExchangeService
                        .getCurrentUserGoodsprice(user, listGoodsPrice);
                if (listGoodsPrice == null || listGoodsPrice.size() == 0) {
                    temGoodsVO.setVo_countGoodsPrice(0);
                } else {
                    temGoodsVO.setVo_countGoodsPrice(listGoodsPrice.size());
                    for (int j = 0; j < listGoodsPrice.size(); j++) {
                        if (temGoodsVO.getVo_retailPrice() == 0) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        } else if (temGoodsVO.getVo_retailPrice() > listGoodsPrice
                                .get(j).getRetailPrice()) {
                            temGoodsVO.setVo_retailPrice(listGoodsPrice
                                    .get(j).getRetailPrice());
                        }
                    }

                    temGoodsVO.setVo_shoppingCartNum(listGoodsPrice.get(0)
                            .getBuyPrice());
                    temGoodsVO.setVo_priceId(listGoodsPrice.get(0)
                            .getPriceId());
                    temGoodsVO.setVo_unitName(listGoodsPrice.get(0)
                            .getUnitName());
                }
                goodsVOList.add(temGoodsVO);
            }
            resultVO.setDataList(goodsVOList);
            result.setRes(SystemCode.SUCCESS);
            result.setObj(resultVO);
        }
        return result;
    }

}
