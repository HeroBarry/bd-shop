package com.bigdatan.b2c.controller.front;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Logistics;
import com.bigdatan.b2c.service.ILogisticsService;
import constant.SystemCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import util.JsonResponse;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

;

/**
 *  配送管理模块  前端
 */
@RestController
@RequestMapping("/front/logistics/logistic")
public class LogisticsController extends AbstractController {

    @Resource
    private ILogisticsService logisticsService;

    /**
     * @param request
     * @return 查看配送列表
     */
    //@GetMapping("/getListLogistics")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getListLogistics")
    public JsonResponse<Logistics> getListLogistics(HttpServletRequest request) {
        JsonResponse<Logistics> result = new JsonResponse<Logistics>(SystemCode.FAILURE);
        List<Logistics> listLogistics = logisticsService.getListLogistics();
        if (!listLogistics.isEmpty()) {
            result.setList(listLogistics);
            result.setRes(SystemCode.SUCCESS);
        }
        return result;
    }

}
