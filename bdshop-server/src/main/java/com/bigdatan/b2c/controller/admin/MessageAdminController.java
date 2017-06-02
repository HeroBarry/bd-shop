package com.bigdatan.b2c.controller.admin;

import com.bigdatan.b2c.controller.AbstractController;
import com.bigdatan.b2c.entity.Admin;
import com.bigdatan.b2c.entity.Message;
import com.bigdatan.b2c.mapper.IUserMessageMapper;
import com.bigdatan.b2c.service.IMessageService;
import com.bigdatan.b2c.service.IUserMessageService;
import com.bigdatan.b2c.service.IUserService;
import constant.SystemCode;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
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
import java.util.Map;

//import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
;

/**
 *  后台消息管理
 */
@RestController
@RequestMapping("/admin/message/messageAdmin")
public class MessageAdminController extends AbstractController {
    @Resource
    private IMessageService messageService;
    @Resource
    private IUserMessageService userMessageService;
    @Resource
    private IUserService userService;
    @Resource
    private IUserMessageMapper userMessageMapper;
    @Resource
    private ThreadPoolTaskExecutor taskExecutor;

    /**
     * @param messageId
     * @return 查看消息推送 记录 已经推送
     */

    //@GetMapping("getUserMessageRecord")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "getUserMessageRecord")
    public List<Map<String, Object>> getUserMessageRecord(int messageId) {
        List<Map<String, Object>> map = userMessageMapper.getUserListByMessageId(messageId);
        return map;
    }


    /**
     * @param
     * @return 查询消息列表 分页
     */

    //@GetMapping("/getMessageByPage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getMessageByPage")
    public JsonResponse<PageResult<Message>> getMessageByPage(PageResult<Message> page, Message messageModel,
                                                              HttpServletRequest request) {
        JsonResponse<PageResult<Message>> result = new JsonResponse<PageResult<Message>>(SystemCode.FAILURE);
        // User user=SessionUtil.getAdminUser(request);
        /*
         * if(user.getRoleType()==2){ //操作员
		 * messageModel.setUserId(user.getUserId()); }
		 */
        messageService.queryByPage(page, messageModel);
        if (page.getTotal() != 0) {
            result.setRes(SystemCode.SUCCESS);
            result.setObj(page);
        }
        return result;
    }

    /**
     * @param
     * @return 编辑消息
     */

    //@GetMapping("/getMessageById")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getMessageById")
    public JsonResponse<Message> getMessageById(Integer messageId, HttpServletRequest request) {
        JsonResponse<Message> result = new JsonResponse<Message>();
        Admin admin = SessionUtil.getAdminUser(request);
        try {
            Message msg = messageService.selectByPrimaryKey(messageId);
            result.setObj(msg);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",编辑消息异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * @param
     * @return 添加消息 state 1所有用户 2指定用户
     */
    //@GetMapping("/addMessage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/addMessage")
    public JsonResponse<String> addMessage(final Message messageModel, HttpServletRequest request) {
        JsonResponse<String> result = new JsonResponse<String>();
        Admin admin = SessionUtil.getAdminUser(request);
        messageModel.setAdminId(admin.getAdminId());
        messageModel.setCreateTime(new Date());
        messageModel.setUpdateTime(new Date());
        String content = messageModel.getMessageContext();
        messageModel.setMessageContext(content);
        if (content != null && content.length() > 15) {
            messageModel.setMessageShortContext(content.substring(0, 15) + "...");
        } else {
            messageModel.setMessageShortContext(content);
        }
        try {
            if (messageModel.getIsAll() == 1) {
                messageModel.setUserIds(userService.getAllFrontUser());
            }
            if (messageModel.getPushNow() == 1) {
                // 立即推送
                messageModel.setPush((byte) 1);
                messageModel.setPushTime(new Date());
                messageService.insert(messageModel);
//                // 另开一个线程 批量添加 用户-消息 记录
                taskExecutor.execute(new Runnable() {
                    @Override
                    public void run() {
                userMessageService.addMessageRecord(messageModel.getMessageId(), messageModel.getUserIds());
                    }
                });
            } else {
                messageService.insert(messageModel);
            }
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",新增消息异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * @param
     * @return 编辑消息
     */
    //@GetMapping("/editMessage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/editMessage")
    public JsonResponse<String> editMessage(final Message messageModel, HttpServletRequest request) {
        JsonResponse<String> result = new JsonResponse<String>();
        Admin admin = SessionUtil.getAdminUser(request);
        messageModel.setUpdateTime(new Date());
        String content = messageModel.getMessageContext();
        messageModel.setMessageContext(content);
        if (content != null && content.length() > 15) {
            messageModel.setMessageShortContext(content.substring(0, 15) + "...");
        }
        try {
            if (messageModel.getIsAll() == 1) {
                messageModel.setUserIds(userService.getAllFrontUser());
            }
            if (messageModel.getPushNow() == 1) {
                // 立即推送
                messageModel.setPush((byte) 1);
                messageModel.setPushTime(new Date());
//                // 另开一个线程 批量添加 用户-消息 记录
                taskExecutor.execute(new Runnable() {
                    @Override
                    public void run() {
                userMessageService.addMessageRecord(messageModel.getMessageId(), messageModel.getUserIds());
                    }
                });
            }
            messageService.updateByPrimaryKeySelective(messageModel);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",编辑消息异常]", e);
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * @param messageModel 消息id
     * @return 推送消息
     */

    //@GetMapping("/pushMessage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/pushMessage")
    public JsonResponse<String> pushMessage(final Message messageModel, HttpServletRequest request) {
        JsonResponse<String> result = new JsonResponse<String>();
        Admin admin = SessionUtil.getAdminUser(request);
        messageModel.setUpdateTime(new Date());
        messageModel.setPushTime(new Date());
        messageModel.setPush((byte) 1);
        if (messageModel.getIsAll() == 1) {
            messageModel.setUserIds(userService.getAllFrontUser());
        }
        try {
            messageService.updateByPrimaryKeySelective(messageModel);
        } catch (Exception e) {
            logError(request, "[admin:" + admin.getAdminName() + ",编辑消息异常]", e);
        }
        taskExecutor.execute(new Runnable() {
            @Override
            public void run() {
        userMessageService.addMessageRecord(messageModel.getMessageId(), messageModel.getUserIds());
            }
        });
        result.setRes(SystemCode.SUCCESS);
        return result;
    }

    /**
     * @param messageId 消息id
     * @return 删除消息
     */

    //@GetMapping("/delMessage")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/delMessage")
    public JsonResponse<String> delMessage(Integer messageId) {
        JsonResponse<String> result = new JsonResponse<String>();
        Message messageModel = new Message();
        messageModel.setUpdateTime(new Date());
        messageModel.setMessageId(messageId);
        messageModel.setDelState((byte) 1);
        try {
            messageService.updateByPrimaryKeySelective(messageModel);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }

    /**
     * @param messageId 消息id
     * @return 删除消息
     */

    //@GetMapping("/getMsgUser")
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET},value = "/getMsgUser")
    public JsonResponse<String> getMsgUser(Integer messageId) {
        JsonResponse<String> result = new JsonResponse<String>();
        Message messageModel = new Message();
        messageModel.setUpdateTime(new Date());
        messageModel.setMessageId(messageId);
        messageModel.setDelState((byte) 1);
        try {
            messageService.updateByPrimaryKeySelective(messageModel);
            result.setRes(SystemCode.SUCCESS);
        } catch (Exception e) {
            result.setRes(SystemCode.FAILURE);
        }
        return result;
    }
}
