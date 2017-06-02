package com.bigdatan.b2c.service.impl;

import com.bigdatan.b2c.entity.*;
import com.bigdatan.b2c.mapper.IBaseDao;
import com.bigdatan.b2c.mapper.ShoppingCartMapper;
import com.bigdatan.b2c.mapper.UserPrivilegeMapper;
import com.bigdatan.b2c.service.IShoppingCartService;
import com.bigdatan.b2c.vo.ShoppingCartDetailVO;
import com.bigdatan.b2c.vo.ShoppingCartVo;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import util.PageResult;

import javax.annotation.Resource;
import java.util.List;

;
@Transactional
@Service
public class ShoppingCartServiceImpl extends BaseServiceImpl<ShoppingCart> implements IShoppingCartService {

    @Resource
    private ShoppingCartMapper shoppingCartMapper;
    @Resource
    private UserPrivilegeMapper userPrivilegeMapper;

    @Override
    protected IBaseDao<ShoppingCart> getMapper() {
        return shoppingCartMapper;
    }

    @Override
    public ShoppingCart queryShoppingCartByUserIdAndPriceId(ShoppingCart shoppingCart) {
        return shoppingCartMapper.queryShoppingCartByUserIdAndPriceId(shoppingCart);
    }

    @Override
    public int queryCountGoodsByUserIdAndGoodsId(ShoppingCart shoppingCart) {
        return shoppingCartMapper.queryCountGoodsByUserIdAndGoodsId(shoppingCart);
    }

    @Override
    public List<ShoppingCart> queryAllBuyShoppingCartByUserId(int userId) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setUserId(userId);
        shoppingCart.setIsBuy(2);// 2表示不购买
        return shoppingCartMapper.queryAllNotIsBuyShoppingCartByUserId(shoppingCart);

    }

    @Override
    public List<ShoppingCart> queryAllShoppingCartByUserId(int userId) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setUserId(userId);
        shoppingCart.setIsBuy(3);// 1表示买 2表示不购买
        return shoppingCartMapper.queryAllNotIsBuyShoppingCartByUserId(shoppingCart);
    }

    @Override
    public int delAllBuyShoppingCartByUserId(int userId) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setUserId(userId);
        shoppingCart.setIsBuy(2);// 1表示买 2表示不购买
        return shoppingCartMapper.delAllNotIsBuyShoppingCartByUserId(shoppingCart);
    }

    @Override
    public int delAllShoppingCartByUserId(int userId) {
        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setUserId(userId);
        shoppingCart.setIsBuy(3);// 1表示买 2表示不购买
        return shoppingCartMapper.delAllNotIsBuyShoppingCartByUserId(shoppingCart);
    }

    public ShoppingCartMapper getShoppingCartMapper() {
        return shoppingCartMapper;
    }

    public void setShoppingCartMapper(ShoppingCartMapper shoppingCartMapper) {
        this.shoppingCartMapper = shoppingCartMapper;
    }

    @Override
    public ShoppingCartVo queryShoppingCartInfo(User user) {
        // 获取用户的优惠信息
        UserPrivilege userPrivilege = userPrivilegeMapper.selectByUserId(user.getUserId());

        boolean isWholeSalePrice = false;
        boolean isDiscount = false;
        int discount = 100;
        if (null != userPrivilege) {
            Byte isWholeSalePriceByte = userPrivilege.getIsWholeSalePrice();
            if (null != isWholeSalePriceByte && isWholeSalePriceByte == 1) {
                isWholeSalePrice = true;
            }
            Byte isDiscountByte = userPrivilege.getIsDiscount();
            if (null != isDiscountByte && isDiscountByte == 1) {
                isDiscount = true;
            }
            Integer discountInt = userPrivilege.getDiscount();
            if (isDiscount && null != discountInt) {
                if (discountInt > 100) {
                    discount = 100;
                } else if (discountInt <= 0) {
                    discount = 0;
                } else {
                    discount = discountInt;
                }
            }
        }

        ShoppingCartVo shoppingCartVo = new ShoppingCartVo();
        int goodsNum = 0;
        int totalAmount = 0;
        int needPayAmount = 0;
        int discoiuntAmount = 0;

        int price = 0;
        int retailPrice = 0;
        int unitGoodNum = 0;

        List<ShoppingCartItem> shoppingCartItems = shoppingCartMapper.queryBuyShopCartItemByUserId(user.getUserId());
        if (null != shoppingCartItems && shoppingCartItems.size() > 0) {
            shoppingCartVo.setShoppingCartItem(shoppingCartItems);

            GoodsPrice goodsPrice = null;
            for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
                goodsPrice = shoppingCartItem.getGoodsPrice();

                goodsNum += shoppingCartItem.getQuantity();
                unitGoodNum = shoppingCartItem.getQuantity();
                retailPrice = goodsPrice.getRetailPrice();
                if (isWholeSalePrice) {
                    price = goodsPrice.getWholesalePrice();
                } else {
                    price = goodsPrice.getRetailPrice();
                }
                totalAmount += retailPrice * unitGoodNum;
                needPayAmount += (price * discount / 100) * unitGoodNum;
                ;
            }
        }
        shoppingCartVo.setGoodsNum(goodsNum);
        shoppingCartVo.setNeedPayAmount(needPayAmount);
        shoppingCartVo.setTotalAmount(totalAmount);
        discoiuntAmount = totalAmount = needPayAmount;
        shoppingCartVo.setDiscoiuntAmount(discoiuntAmount);

        return shoppingCartVo;
    }


    @Override
    public PageResult<ShoppingCartDetailVO> queryShoppingCartDetailVOByUserId(PageResult<ShoppingCartDetailVO> t,
                                                                              int userId) {
        int pageNo = t.getPageNo();
        int pageSize = t.getPageSize();
        pageNo = pageNo == 0 ? 1 : pageNo;
        pageSize = pageSize == 0 ? 10 : pageSize;
        PageHelper.startPage(pageNo, pageSize);

        return PageResult.toPageResult(shoppingCartMapper.queryShoppingCartDetailVOByUserId(userId), t);
    }

    @Override
    public int updateAllIsBuyStateByUserIdAndisBuyValue(
            ShoppingCart shoppingCart) {
        return shoppingCartMapper.updateAllIsBuyStateByUserIdAndisBuyValue(shoppingCart);
    }

}
