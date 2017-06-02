package com.bigdatan.b2c.controller.admin;

import com.alibaba.fastjson.JSONArray;
import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.entity.Goods;
import com.bigdatan.b2c.entity.GoodsPrice;
import com.bigdatan.b2c.service.IGoodsPriceService;
import com.bigdatan.b2c.service.IGoodsService;
import com.bigdatan.b2c.vo.QueryGoodsAdminVO;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;
import util.SessionUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

;

/**
 *  商品 管理模块 后台
 */
@RestController
@RequestMapping("/admin/goods/goodsAdmin")
public class GoodsAdminController extends AbstractController {

    @Resource
    private IGoodsService goodsService;

    @Resource
    private IGoodsPriceService goodsPriceService;

    /**
     * 添加商品
     */
    //@GetMapping("/addGoods")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/addGoods")
    public JsonResponse<Goods> addGoods(Goods goods, HttpServletRequest request) {
        JsonResponse<Goods> result = new JsonResponse<Goods>();
        String srcgoodspriceList = request.getParameter("goodspriceList");
        List<GoodsPrice> goodspriceList = (List<GoodsPrice>) JSONArray
                .parseArray(srcgoodspriceList, GoodsPrice.class);

        Admin admin = SessionUtil.getAdminUser(request);
        goods.setAdminId(admin.getAdminId());
        // SimpleDateFormat formatter = new
        // SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        goods.setCreateTime(new Date());
        goods.setUpdateTime(new Date());
        goods.setDelState((byte) 1);
        try {
            goodsService.insertSelective(goods);
            //goods = goodsService.getOne(goods);// 为了获取保存后的id
            if (goodspriceList != null && goodspriceList.size() > 0) {
                for (int i = 0; i < goodspriceList.size(); i++) {
                    GoodsPrice temp = goodspriceList.get(i);
                    temp.setGoodsId(goods.getGoodsId());
                    temp.setAdminId(admin.getAdminId());
                    temp.setCreateTime(new Date());
                    temp.setUpdateTime(new Date());
                    temp.setState((byte) 1);
                    goodsPriceService.insertSelective(temp);
                }

            }

            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",新增商品异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 编辑商品
     */
    //@GetMapping("/editGoods")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editGoods")
    public JsonResponse<Goods> editGoods(Goods goods, HttpServletRequest request) {
        JsonResponse<Goods> result = new JsonResponse<Goods>();
        String srcgoodspriceList = request.getParameter("goodspriceList");
        List<GoodsPrice> goodspriceList = (List<GoodsPrice>) JSONArray
                .parseArray(srcgoodspriceList, GoodsPrice.class);
        if (goodspriceList == null) {
            goodspriceList = new ArrayList<GoodsPrice>();
        }
        Admin admin = SessionUtil.getAdminUser(request);
        goods.setAdminId(admin.getAdminId());
        goods.setUpdateTime(new Date());
        try {
            goodsService.updateByPrimaryKeySelective(goods);
            // 删除旧数据
            List<GoodsPrice> hisgoodspriceList = goodsPriceService
                    .findAllNormalGoodsPriceByGoodsId(goods.getGoodsId());
            for (int y = 0; y < hisgoodspriceList.size(); y++) {
                GoodsPrice hist = hisgoodspriceList.get(y);
                boolean checkExist = false;
                for (int k = 0; k < goodspriceList.size(); k++) {
                    if (hist.getPriceId() == goodspriceList.get(k).getPriceId()) {
                        // 此次更新有数据
                        checkExist = true;
                    }
                }
                if (checkExist == true) {
                    // 历史数据当前有记录，不删除
                    continue;
                }
                hist.setState((byte) 2);// 删除
                hist.setAdminId(admin.getAdminId());
                hist.setUpdateTime(new Date());
                goodsPriceService.updateByPrimaryKeySelective(hist);
            }
            // 新增新数据
            for (int y = 0; y < goodspriceList.size(); y++) {
                GoodsPrice newt = goodspriceList.get(y);
                if (newt.getPriceId() == 0) {
                    // 新增的规格
                    newt.setPriceId(0);
                    newt.setGoodsId(goods.getGoodsId());
                    newt.setState((byte) 1);// 新增
                    newt.setAdminId(admin.getAdminId());
                    newt.setCreateTime(new Date());
                    newt.setUpdateTime(new Date());
                    goodsPriceService.insertSelective(newt);
                } else {
                    // 更新的规格，由于页面限制了不允许更新，因此不用处理
                    System.out.println("gengxin");
                }
            }
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",编辑商品异常]", e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

    /**
     * 商品列表
     */

    //@GetMapping("/getGoodsByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getGoodsByPage")
    public JsonResponse<PageResult<Goods>> getGoodsByPage(
            PageResult<Goods> page, QueryGoodsAdminVO goods, HttpServletRequest request) {
        JsonResponse<PageResult<Goods>> result = new JsonResponse<PageResult<Goods>>();
        //goodsService.queryByPage(page, goods);
        goodsService.getPageByQueryGoodsAdminVO(page, goods);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * 删除商品
     */
    //@GetMapping("/delGoodsById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/delGoodsById")
    public JsonResponse<Goods> delGoodsById(Goods goods,
                                            HttpServletRequest request) {
        JsonResponse<Goods> result = new JsonResponse<Goods>();
        Admin admin = SessionUtil.getAdminUser(request);
        goods.setAdminId(admin.getAdminId());
        goods.setDelState((byte) 2);
        goods.setUpdateTime(new Date());
        try {
            goodsService.updateByPrimaryKeySelective(goods);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",删除商品异常]", e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

    /**
     * 查找商品
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

}
