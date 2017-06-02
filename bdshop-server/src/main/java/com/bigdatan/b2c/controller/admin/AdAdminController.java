package com.bigdatan.b2c.controller.admin;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Ad;
import com.bigdatan.b2c.entity.AdPosition;
import com.bigdatan.b2c.service.IAdPositionService;
import com.bigdatan.b2c.service.IAdService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

;

/**
 * 广告Controller
 */
@RestController
@RequestMapping("/admin/ad/ad")
public class AdAdminController extends AbstractController {
    @Resource
    private IAdPositionService adPositionService;
    @Resource
    private IAdService adService;


    //@GetMapping("/getAdPositionByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getAdPositionByPage")
    public JsonResponse<PageResult<AdPosition>> getAdPositionByPage(PageResult<AdPosition> page, AdPosition adPosition,
                                                                    HttpServletRequest request) {
        JsonResponse<PageResult<AdPosition>> result = new JsonResponse<PageResult<AdPosition>>();
        adPositionService.queryByPage(page, adPosition);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }


    //@GetMapping("/getAdPositionById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getAdPositionById")
    public JsonResponse<AdPosition> getAdPositionById(Integer adPositionId, HttpServletRequest request) {
        JsonResponse<AdPosition> result = new JsonResponse<AdPosition>();
        AdPosition adposition = adPositionService.selectByPrimaryKey(adPositionId);
        if (adposition != null) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(adposition);
        }
        return result;
    }

    //@GetMapping("/editAdPosition")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editAdPosition")
    public JsonResponse<AdPosition> editAdPosition(AdPosition adPosition, HttpServletRequest request) {
        JsonResponse<AdPosition> result = new JsonResponse<AdPosition>();
        try {
            adPositionService.updateByPrimaryKeySelective(adPosition);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[用户信息编辑失败]", e);
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }


    //@GetMapping("/getAdByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getAdByPage")
    public JsonResponse<PageResult<Ad>> getAdByPage(PageResult<Ad> page, Ad ad, HttpServletRequest request) {
        JsonResponse<PageResult<Ad>> result = new JsonResponse<PageResult<Ad>>();
        adService.queryByPage(page, ad);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        } else {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }


    //@GetMapping("/queryAdByAdId")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/queryAdByAdId")
    public JsonResponse<Ad> queryAdByAdId(Integer adId, HttpServletRequest request) {
        JsonResponse<Ad> result = new JsonResponse<Ad>();
        try {
            Ad ad = adService.selectByPrimaryKey(adId);
            result.setRes(SystemCode.SUCCESS);
            result.setObj(ad);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }


    //@GetMapping("/editAd")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editAd")
    public JsonResponse<Ad> editAd(Ad ad, HttpServletRequest request) {
        JsonResponse<Ad> result = new JsonResponse<Ad>();
        try {
            Date now = new Date();
            ad.setUpdateTime(now);
            adService.updateByPrimaryKeySelective(ad);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }

    //@GetMapping("/addAd")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/addAd")
    public JsonResponse<Ad> addAd(Ad ad, HttpServletRequest request) {
        JsonResponse<Ad> result = new JsonResponse<Ad>();
        try {
            Date now = new Date();
            ad.setCreateTime(now);
            ad.setUpdateTime(now);
//			ad.setDelState((byte) 2);
            adService.insertSelective(ad);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }


    //@GetMapping("/delAd")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/delAd")
    public JsonResponse<Ad> delAd(Ad ad, HttpServletRequest request) {
        JsonResponse<Ad> result = new JsonResponse<Ad>();
        try {
            adService.delete(ad);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
        }

        return result;
    }
}
