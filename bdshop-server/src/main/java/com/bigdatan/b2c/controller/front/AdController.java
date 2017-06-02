package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Ad;
import com.bigdatan.b2c.service.IAdService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;
import util.PageResult;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

;

/**
 *
 */
@RestController
@RequestMapping("/front/ad/ad")
public class AdController extends AbstractController {
    @Resource
    private IAdService adService;


    //@GetMapping("/getAdByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getAdByPage")
    public JsonResponse<PageResult<Ad>> getAdByPage(PageResult<Ad> page, Ad ad,
                                                    HttpServletRequest request) {
        JsonResponse<PageResult<Ad>> result = new JsonResponse<PageResult<Ad>>();
        adService.queryByPageFront(page, ad);
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
}
