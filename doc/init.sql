/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50717
Source Host           : 127.0.0.1:3306
Source Database       : b2c2

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-04-24 13:53:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_ad
-- ----------------------------
DROP TABLE IF EXISTS `t_ad`;
CREATE TABLE `t_ad` (
  `ad_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '广告id，主键，自增1',
  `ad_position_id` int(11) DEFAULT NULL COMMENT '广告位置id',
  `image` varchar(255) DEFAULT NULL COMMENT '广告图像地址',
  `description` varchar(255) DEFAULT NULL COMMENT '广告描述',
  `url` varchar(255) DEFAULT NULL COMMENT '广告链接',
  `state` tinyint(4) DEFAULT NULL COMMENT '状态，1开启 2关闭',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除状态 1 已删除 2 未删除',
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`ad_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_ad
-- ----------------------------

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `role_id` int(11) DEFAULT NULL COMMENT '角色id',
  `admin_name` varchar(255) DEFAULT NULL COMMENT '管理账号名称',
  `password` varchar(255) DEFAULT '' COMMENT '密码',
  `rand` varchar(255) DEFAULT '' COMMENT 'md5 随机码',
  `company_name` varchar(255) DEFAULT NULL COMMENT '公司名称',
  `description` varchar(255) DEFAULT '' COMMENT '描述',
  `state` tinyint(4) DEFAULT '1' COMMENT '状态：1.开启 2.关闭',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除状态 1 已删除 2 未删除',
  `creat_id` int(11) DEFAULT NULL COMMENT '创建者id',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_name` (`admin_name`) USING BTREE,
  UNIQUE KEY `company_name` (`company_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='管理员表';

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('1', '1', 'super', 'e0383773c0d34c4a2584601aee4733b5', '137296', '2211', '222', '1', '2017-03-23 15:13:49', '2017-03-23 15:55:17', '2', null);
INSERT INTO `t_admin` VALUES ('2', '4', 'admin', 'e0383773c0d34c4a2584601aee4733b5', '137296', 'xx', 'xx', '1', '2017-03-23 15:56:13', '2017-03-23 15:56:14', '2', null);
INSERT INTO `t_admin` VALUES ('3', '1', 'test11', 'e0383773c0d34c4a2584601aee4733b5', '137296', '测试公司', '的', '1', '2017-04-15 17:56:28', '2017-04-15 17:56:28', '2', null);
INSERT INTO `t_admin` VALUES ('4', '1', 'test22', 'e0383773c0d34c4a2584601aee4733b5', '137296', '啛啛喳喳', 'xxxxx', '1', '2017-04-15 17:59:59', '2017-04-15 17:59:59', '2', null);
INSERT INTO `t_admin` VALUES ('5', '1', 'test13', 'e0383773c0d34c4a2584601aee4733b5', '137296', 'dddd', 'dddddd', '1', '2017-04-15 18:04:48', '2017-04-15 18:04:48', '2', null);
INSERT INTO `t_admin` VALUES ('6', '1', 'test33', 'e0383773c0d34c4a2584601aee4733b5', '137296', 'ddd', 'ddd', '1', '2017-04-15 18:07:15', '2017-04-15 18:07:15', '2', null);
INSERT INTO `t_admin` VALUES ('7', '1', 'test14', 'e0383773c0d34c4a2584601aee4733b5', '137296', 'dsadfsfas', 'dasfadsfas', '1', '2017-04-15 18:09:03', '2017-04-15 18:09:03', '2', null);
INSERT INTO `t_admin` VALUES ('9', '3', 'test16', 'e0383773c0d34c4a2584601aee4733b5', '137296', 'adsf', 'adsfasdf', '1', '2017-04-15 18:20:47', '2017-04-15 18:20:47', '2', null);
INSERT INTO `t_admin` VALUES ('10', '4', 'test21', 'e0383773c0d34c4a2584601aee4733b5', '137296', 'ss', 'ss', '1', '2017-04-15 21:13:39', '2017-04-15 21:13:39', '2', null);
INSERT INTO `t_admin` VALUES ('11', '4', 'admin123', 'e0383773c0d34c4a2584601aee4733b5', '137296', '22', 'xx', '1', '2017-04-22 15:00:07', '2017-04-22 15:00:07', '2', null);

-- ----------------------------
-- Table structure for t_admin_role
-- ----------------------------
DROP TABLE IF EXISTS `t_admin_role`;
CREATE TABLE `t_admin_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色id，主键，自增1',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '角色名称',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `state` tinyint(4) DEFAULT '1' COMMENT '状态：1.开启 2.关闭',
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_admin_role
-- ----------------------------
INSERT INTO `t_admin_role` VALUES ('1', '总管理员', '总管理员', null, null, '1', null);
INSERT INTO `t_admin_role` VALUES ('2', '运营人员', '运营人员', null, null, '1', null);
INSERT INTO `t_admin_role` VALUES ('3', '机构', '机构', '2017-04-04 20:23:55', '2017-04-04 20:23:55', '1', null);
INSERT INTO `t_admin_role` VALUES ('4', '角色测试', '角色测试', '2017-04-14 18:34:37', '2017-04-14 18:34:37', '1', null);

-- ----------------------------
-- Table structure for t_ad_position
-- ----------------------------
DROP TABLE IF EXISTS `t_ad_position`;
CREATE TABLE `t_ad_position` (
  `ad_position_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '广告位置id，主键，自增1',
  `name` varchar(255) DEFAULT NULL COMMENT '广告名称',
  `position` varchar(255) DEFAULT NULL COMMENT '位置',
  `measure` varchar(255) DEFAULT NULL COMMENT '尺寸',
  `state` tinyint(4) DEFAULT '1' COMMENT '状态，1开启 2关闭',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`ad_position_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_ad_position
-- ----------------------------
INSERT INTO `t_ad_position` VALUES ('1', '首页Banner', '首页-头部', '600 * 300px', '1', '2017-04-04 21:38:38', '2017-04-04 21:38:41', null);

-- ----------------------------
-- Table structure for t_article
-- ----------------------------
DROP TABLE IF EXISTS `t_article`;
CREATE TABLE `t_article` (
  `article_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `category_id` int(11) DEFAULT NULL COMMENT '文章种类id',
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `key_words` varchar(255) DEFAULT NULL COMMENT '关键字',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  `publishTime` datetime DEFAULT NULL COMMENT '发布时间',
  `publisher` varchar(255) DEFAULT NULL COMMENT '发布人/机构',
  `recommend` tinyint(4) DEFAULT '2' COMMENT '是否推荐  1 推荐 2 不推荐',
  `is_published` tinyint(4) DEFAULT '0' COMMENT '是否发布 1 发布 0 未发布',
  `state` tinyint(4) DEFAULT NULL COMMENT '状态，1 开启 2 关闭',
  `is_top` tinyint(4) DEFAULT '0' COMMENT '是否置顶 1 置顶 0 不置顶',
  `image` varchar(255) DEFAULT NULL COMMENT '文章主图',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '状态 1 已删除 2 未删除',
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_article
-- ----------------------------
INSERT INTO `t_article` VALUES ('1', null, '哈哈', '<p>顶顶顶顶</p>', '多动动', null, null, null, '1', '0', '1', '1', 'abcdefg', '2017-04-06 08:36:58', '2017-04-12 14:00:53', '1', '2');
INSERT INTO `t_article` VALUES ('2', null, '多动动', '<p>顶顶顶顶<img src=\"http://img.baidu.com/hi/jx2/j_0031.gif\"/></p>', '多动动', null, null, null, '1', '0', '1', '1', 'abcdefg', '2017-04-06 08:37:43', '2017-04-12 14:00:51', '1', '2');

-- ----------------------------
-- Table structure for t_cart
-- ----------------------------
DROP TABLE IF EXISTS `t_cart`;
CREATE TABLE `t_cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '购物车id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `price_id` int(11) DEFAULT NULL COMMENT '商品规格价格id',
  `goods_id` int(11) DEFAULT NULL COMMENT '商品id',
  `quantity` int(11) DEFAULT NULL COMMENT '数量',
  `is_buy` tinyint(4) DEFAULT '2' COMMENT '是否购买标志：1 购买 2 不购买',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=925 DEFAULT CHARSET=utf8 COMMENT='购物车条目表';

-- ----------------------------
-- Records of t_cart
-- ----------------------------

-- ----------------------------
-- Table structure for t_goods
-- ----------------------------
DROP TABLE IF EXISTS `t_goods`;
CREATE TABLE `t_goods` (
  `goods_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品id',
  `category_id` int(11) DEFAULT NULL COMMENT '所属类别id',
  `goods_name` varchar(255) DEFAULT '' COMMENT '商品名称',
  `nickname` varchar(255) DEFAULT NULL COMMENT '别名',
  `image` varchar(255) DEFAULT '' COMMENT '商品主图',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除 1是 2否',
  `simple_describe` varchar(255) DEFAULT '' COMMENT '简要描述',
  `detail_describe` text COMMENT '详细描述',
  `is_marketable` tinyint(4) DEFAULT '0' COMMENT '上架标志 1 已上架 0 未上架',
  `recommend` tinyint(4) DEFAULT '2' COMMENT '推荐 1是 2否',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL COMMENT '创建者id',
  PRIMARY KEY (`goods_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COMMENT='商品表';

-- ----------------------------
-- Records of t_goods
-- ----------------------------
INSERT INTO `t_goods` VALUES ('1', '0', '芒果干', '芒果干', '/pic/dydz/user/201704/1492090027116.png,/pic/dydz/user/201704/1492148659765.png,/pic/dydz/user/201704/1492148662871.png,/pic/dydz/user/201704/1492148666503.png,/pic/dydz/user/201704/1492148670172.png,/pic/dydz/user/201704/1492148675607.png', '2', '芒果干', '<p>&nbsp;&nbsp;&nbsp;&nbsp;芒果又名蜜望、庵波罗果，被称为“热带果王”。将<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E8%8A%92%E6%9E%9C/31490\">芒果</a>切片，然后用晾晒的方法脱去水分之后，便成为了芒果干。<a class=\"sup-anchor\"></a></p><p><br/></p><p><br/></p>', '0', '1', '2017-03-23 17:03:06', '2017-04-14 13:58:12', '2');
INSERT INTO `t_goods` VALUES ('2', '2', '苹果', '苹果', '/pic/dydz/user/201704/1491552981139.jpg,/pic/dydz/user/201704/1492933624162.jpg,/pic/dydz/user/201704/1492933966084.jpg,/pic/dydz/user/201704/1492934021770.jpg', '1', '苹果', '<p>的所得税的<br/></p>', '1', '2', '2017-04-01 17:58:48', '2017-04-23 15:53:46', '11');
INSERT INTO `t_goods` VALUES ('3', '2', '桔子', '桔子', '', '1', '桔子', null, '0', '2', '2017-04-01 21:34:02', '2017-04-01 21:34:02', '2');
INSERT INTO `t_goods` VALUES ('4', '1', '干果', '干果', '', '1', '干果', '<p>干果</p>', '0', '1', '2017-04-07 16:23:24', '2017-04-10 15:19:19', '2');
INSERT INTO `t_goods` VALUES ('5', '3', '红苹果', '红苹果', '/pic/dydz/user/201704/1491967410863.jpg', '1', '苹果', '', '1', '1', '2017-04-12 11:23:41', '2017-04-12 22:00:18', '2');
INSERT INTO `t_goods` VALUES ('6', '13', '青苹果', '青苹果', '/pic/dydz/user/201704/1491967466969.jpg', '1', '青苹果', '', '1', '1', '2017-04-12 11:25:02', '2017-04-12 21:55:26', '2');
INSERT INTO `t_goods` VALUES ('7', '2', '柠檬', '柠果', '/pic/dydz/user/201704/1491969550232.jpg', '1', '柠檬，又称柠果，因其味极酸，肝虚孕妇最喜食，故称益母果或益母子。柠檬中含有丰富的柠檬酸，因此被誉为“柠檬酸仓库”', null, '1', '1', '2017-04-12 12:02:57', '2017-04-12 12:02:57', '2');
INSERT INTO `t_goods` VALUES ('8', '14', '苏泊尔套装锅具组合', '苏泊尔套装锅具组合', '/pic/dydz/user/201704/1491986326518.jpg', '1', '苏泊尔套装锅具组合', '<h1>苏泊尔套装锅具组合</h1><h1>苏泊尔套装锅具组合</h1><h1>苏泊尔套装锅具组合</h1><h1>苏泊尔套装锅具组合</h1><p><br/></p>', '1', '1', '2017-04-12 16:39:52', '2017-04-12 17:07:12', '2');
INSERT INTO `t_goods` VALUES ('9', '14', '科翼双层厨房置物架', '科翼双层厨房置物架', '/pic/dydz/user/201704/1491986412666.jpg', '1', '科翼双层厨房置物架', '<h1>科翼双层厨房置物架</h1><h1>科翼双层厨房置物架</h1><h1>科翼双层厨房置物架</h1><h1>科翼双层厨房置物架</h1><p><br/></p>', '1', '1', '2017-04-12 16:40:19', '2017-04-12 17:44:11', '2');
INSERT INTO `t_goods` VALUES ('10', '14', '厨房微波炉架', '厨房微波炉架', '/pic/dydz/user/201704/1491997319523.jpg', '1', '厨房微波炉架', '<h3 class=\"tb-main-title\">厨房微波炉架</h3><h3 class=\"tb-main-title\">厨房微波炉架</h3><h3 class=\"tb-main-title\">厨房微波炉架</h3><p><br/></p>', '1', '2', '2017-04-12 19:42:05', '2017-04-12 20:27:16', '2');
INSERT INTO `t_goods` VALUES ('11', '13', '羽绒服清洗剂干洗剂', '羽绒服清洗剂干洗剂', '/pic/dydz/user/201704/1491997761544.jpg', '1', '羽绒服清洗剂干洗剂', '<h1>羽绒服清洗剂干洗剂</h1><h1>羽绒服清洗剂干洗剂</h1><p><br/></p>', '0', '2', '2017-04-12 19:49:42', '2017-04-12 19:49:42', '2');
INSERT INTO `t_goods` VALUES ('12', '13', '倍舒净内裤洗衣液', '倍舒净内裤洗衣液', '/pic/dydz/user/201704/1491998709987.jpg', '1', '倍舒净内裤洗衣液', '<h1>倍舒净内裤洗衣液</h1><h1>倍舒净内裤洗衣液</h1><p><br/></p>', '1', '1', '2017-04-12 20:05:20', '2017-04-12 20:05:20', '2');
INSERT INTO `t_goods` VALUES ('13', '12', '包邮正宗安徽太和板面料牛肉板面调料', '包邮正宗安徽太和板面料牛肉板面调料', '/pic/dydz/user/201704/1492006026745.jpg', '1', '包邮正宗安徽太和板面料牛肉板面调料', '<h3 class=\"tb-main-title\">包邮正宗安徽太和板面料牛肉板面调料</h3><h3 class=\"tb-main-title\">包邮正宗安徽太和板面料牛肉板面调料</h3><p><br/></p>', '1', '1', '2017-04-12 20:09:10', '2017-04-12 22:07:09', '2');
INSERT INTO `t_goods` VALUES ('14', '7', '016年陕北小米黄小米新米', '016年陕北小米黄小米新米', '/pic/dydz/user/201704/1491999251933.jpg', '1', '016年陕北小米黄小米新米', '<h3 class=\"tb-main-title\">016年陕北小米黄小米新米</h3><h3 class=\"tb-main-title\">016年陕北小米黄小米新米</h3><p><br/></p>', '1', '1', '2017-04-12 20:14:19', '2017-04-12 20:14:19', '2');
INSERT INTO `t_goods` VALUES ('15', '18', '洗衣粉', '洗衣粉', '/pic/dydz/user/201704/1492006569292.jpg', '1', '洗衣粉', '<p>汰渍</p>', '1', '1', '2017-04-12 22:16:23', '2017-04-12 22:16:23', '2');
INSERT INTO `t_goods` VALUES ('16', '17', '天然气灶', '天然气灶', '/pic/dydz/user/201704/1492006686485.jpg', '1', '天然气灶', '<p>天然气灶</p>', '1', '1', '2017-04-12 22:18:16', '2017-04-18 10:17:52', '2');
INSERT INTO `t_goods` VALUES ('17', '0', '土鸡蛋', '土鸡蛋', '/pic/dydz/user/201704/1492007032305.png', '2', '土鸡蛋', '<p>土鸡蛋</p>', '0', '1', '2017-04-12 22:24:00', '2017-04-18 12:01:27', '2');
INSERT INTO `t_goods` VALUES ('18', '21', '巴达木', '巴达木', '/pic/dydz/user/201704/1492007184581.jpg', '1', '巴达木', '<p>巴达木</p>', '1', '1', '2017-04-12 22:26:36', '2017-04-12 22:26:36', '2');
INSERT INTO `t_goods` VALUES ('19', '23', '鸡蛋', '鸡蛋', '/pic/dydz/user/201704/1492072632079.png,/pic/dydz/user/201704/1492494606516.jpg,/pic/dydz/user/201704/1492494613076.jpg', '1', '鸡蛋鸡蛋', '<p>鸡蛋又名鸡卵、鸡子，是母鸡所产的卵。其外有一层硬壳，内则有气室、卵白及卵黄部分。富含胆固醇，营养丰富，一个鸡蛋重约50克，含蛋白质7克。鸡蛋蛋白质的氨基酸比例很适合人体生理需要、易为机体吸收，利用率高达98%以上，营养价值很高，是人类常食用的食物之一</p>', '1', '1', '2017-04-13 16:35:29', '2017-04-18 13:50:17', '2');
INSERT INTO `t_goods` VALUES ('20', '5', '花菜', '花菜', '/pic/dydz/user/201704/1492072997825.png', '1', '花菜', '<p>花菜含有丰富的维生素及矿物质，尤以维生素C的含量特别突出，每100克含量高达88毫克，比同类的白菜、油菜等多一倍以上，比芹菜、苹果多一倍。何时传到中国尚不可考，据传地中海东岸曾广为栽种，传入中国江浙、两广地区后迅速在南北各地广为种植，产量颇大。在德国生物学家科赫发现结核菌前后，肺结核曾有大流行，欧洲人便用花菜汁制成治疗咳喘的药物，便宜而有效，称为“穷人的医生”。现代中国又用包心菜提取维生素U治胃病，这两种菜真象一对十字花科植物的孪生兄 弟，为医学做了重大贡献。</p>', '1', '1', '2017-04-13 16:45:01', '2017-04-13 16:45:36', '2');
INSERT INTO `t_goods` VALUES ('21', '0', '大虾', '大虾', '/pic/dydz/user/201704/1492090169380.png', '2', '', '<p>&nbsp;&nbsp;&nbsp;&nbsp;大虾属节肢动物甲壳类，种类很多。包括青虾、河虾、草虾、小龙虾、对虾（南美白对虾，南美蓝对虾，中国对虾，渤海湾牤牛岛对虾）、明虾、基围虾、琵琶虾、龙虾等。其中对虾是我国特产，因个大出售时常成对出售而得名对虾。对虾生活在暖海里，夏秋两季能够在渤海湾生活和繁殖，冬季虾要长途迁移到黄海南部海底水温较高的水域去避寒。冬季虾的活动能力很差，也不捕食。每年3月分散在各地的虾开始集中，成群结队地向北方游。经两个月的旅行到达渤海近岸浅海，开始了它们的繁殖，雌虾经过长途旅行已疲惫不堪，产完卵后大部分就死去了，只有体力较强的才能继续生存，刚孵出的小虾身体结构要发生很多变化，经过20多次蜕皮才长为成虾。雄虾当年成熟，雌虾要到第二年才成熟。虾有两倍于身体长的细长触须，用来感知周围的水体情况，胸部强大的肌肉有利于长途洄游。腹部的尾扇可用来控制身体的平衡，也可以反弹后退。</p>', '0', '1', '2017-04-13 21:30:03', '2017-04-15 17:12:15', '2');
INSERT INTO `t_goods` VALUES ('22', '28', '石榴', '石榴', '/pic/dydz/user/201704/1492090865745.png', '1', '石榴', '<p>&nbsp;&nbsp;&nbsp;&nbsp;石榴（学名：Punica granatum \r\nL.）落叶乔木或灌木；单叶，通常对生或簇生，无托叶。花顶生或近顶生，单生或几朵簇生或组成聚伞花序，近钟形，裂片5-9，花瓣5-9，多皱褶，覆瓦状排列；胚珠多数。浆果球形，顶端有宿存花萼裂片，果皮厚；种子多数，浆果近球形，果熟期9-10月。外种皮肉质半透明，多汁；内种皮革质。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;性味甘、酸涩、温，具有杀虫、收敛、涩肠、止痢等功效。<a target=\"_blank\" href=\"http://baike.baidu.com/view/1100440.htm\">石榴果</a>实营养丰富，维生素C含量比苹果、梨要高出一二倍。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;中国栽培石榴的历史，可上溯至汉代，据陆巩记载是张骞从西域引入。中国南北都有栽培，以安徽、江苏、河南等地种植面积较大，并培育出一些较优质的品种。其中安徽怀远县是中国石榴之乡，“怀远石榴”为国家地理标志保护产品。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;中国传统文化视石榴为吉祥物，视它为多子多福的象征。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;<br/></p>', '1', '1', '2017-04-13 21:39:44', '2017-04-14 17:33:01', '2');
INSERT INTO `t_goods` VALUES ('23', '0', '西梅干', '西梅干', '/pic/dydz/user/201704/1492673741959.png', '2', '', '', '0', '1', '2017-04-14 11:42:42', '2017-04-21 13:47:59', '2');
INSERT INTO `t_goods` VALUES ('24', '27', '大柠檬', '大柠檬', '/pic/dydz/user/201704/1492154140808.png,/pic/dydz/user/201704/1492154143687.png,/pic/dydz/user/201704/1492154146080.png,/pic/dydz/user/201704/1492154148110.png,/pic/dydz/user/201704/1492154150105.png,/pic/dydz/user/201704/1492154153870.png', '1', '大柠檬', '<p>柠檬（学名：<em>Citrus limon </em>(L.) Burm. f.），芸香科柑橘属植物，柠檬又称<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E6%9F%A0%E6%9E%9C\">柠果</a>、洋柠檬、<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E7%9B%8A%E6%AF%8D%E6%9E%9C\">益母果</a>等。<sup>[1]</sup><a class=\"sup-anchor\">&nbsp;</a><a target=\"_blank\" href=\"http://baike.baidu.com/item/%E5%B0%8F%E4%B9%94%E6%9C%A8\">小乔木</a>，枝少刺或近于无刺，嫩叶及花芽暗紫红色，叶片厚纸质，卵形或椭圆形。单花腋生或少花簇生。果椭圆形或卵形，果皮厚，通常粗糙，柠檬黄色，果汁酸至甚酸，种子小，卵形，端尖；种皮平滑，子叶乳白色，通常单或兼有多胚。花期4-5月，果期9-11月。</p><p>柠檬产中国长江以南，<sup>[2]</sup><a class=\"sup-anchor\">&nbsp;</a>原产东南亚，主要产地为美国、意大利、西班牙和<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E5%B8%8C%E8%85%8A\">希腊</a>。<sup>[3]</sup><a class=\"sup-anchor\">&nbsp;</a></p><p>柠檬因其味极酸，肝虚孕妇最喜食，故称<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E7%9B%8A%E6%AF%8D%E6%9E%9C\">益母果</a>或<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E7%9B%8A%E6%AF%8D%E5%AD%90\">益母子</a>。柠檬中含有丰富的柠檬酸，因此被誉为“柠檬酸仓库”。它的果实汁多肉脆，有浓郁的芳香气。因为味道特酸，故只能作为上等调味料，用来调制饮料菜肴、化妆品和药品。<sup>[1]</sup><a class=\"sup-anchor\">&nbsp;</a>此外，柠檬富含<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E7%BB%B4%E7%94%9F%E7%B4%A0C\">维生素C</a>，能<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E5%8C%96%E7%97%B0\">化痰</a>止咳，<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E7%94%9F%E6%B4%A5\">生津</a><a target=\"_blank\" href=\"http://baike.baidu.com/item/%E5%81%A5%E8%83%83\">健胃</a>。用于<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E6%94%AF%E6%B0%94%E7%AE%A1%E7%82%8E\">支气管炎</a>，<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E7%99%BE%E6%97%A5%E5%92%B3\">百日咳</a>，食欲不振，维生素缺乏，中暑烦渴等症状，它是&quot;<a target=\"_blank\" href=\"http://baike.baidu.com/item/%E5%9D%8F%E8%A1%80%E7%97%85\">坏血病</a>&quot;的克星。</p><p><br/></p>', '1', '1', '2017-04-14 15:16:07', '2017-04-14 17:32:32', '2');
INSERT INTO `t_goods` VALUES ('25', '0', '紫甘蓝', '紫甘蓝', '/pic/dydz/user/201704/1492480321716.png', '2', '紫甘蓝', '<p>紫甘蓝紫甘蓝</p>', '0', '1', '2017-04-18 09:52:14', '2017-04-20 15:35:13', '2');
INSERT INTO `t_goods` VALUES ('26', '0', '蔬菜测试', '蔬菜测试', '', '2', '蔬菜测试', '<p>蔬菜测试</p>', '0', '1', '2017-04-18 10:29:57', '2017-04-18 11:20:16', '2');
INSERT INTO `t_goods` VALUES ('27', '42', '测试1', '测试1', '/pic/dydz/user/201704/1492499918552.png,/pic/dydz/user/201704/1492499933437.png,/pic/dydz/user/201704/1492499939235.png,/pic/dydz/user/201704/1492499942343.png,/pic/dydz/user/201704/1492499945131.png,/pic/dydz/user/201704/1492499949070.png', '1', '测试1', '<p>测试1</p>', '1', '2', '2017-04-18 15:18:41', '2017-04-18 15:24:39', '2');
INSERT INTO `t_goods` VALUES ('28', '42', '测试2', '测试2', '/pic/dydz/user/201704/1492501927744.png', '1', '测试2', '<p>测试2</p>', '1', '2', '2017-04-18 15:52:22', '2017-04-18 15:52:22', '2');
INSERT INTO `t_goods` VALUES ('29', '42', '测试3', '测试3', '/pic/dydz/user/201704/1492502183841.png', '1', '测试3', '<p>测试3</p>', '1', '2', '2017-04-18 15:52:47', '2017-04-18 15:56:27', '2');
INSERT INTO `t_goods` VALUES ('30', '42', '测试4', '测试4', '/pic/dydz/user/201704/1492502000231.png', '1', '测试4', '<p>测试4</p>', '1', '2', '2017-04-18 15:53:24', '2017-04-18 15:53:24', '2');
INSERT INTO `t_goods` VALUES ('31', '42', '测试5', '测试5', '/pic/dydz/user/201704/1492502038609.png', '1', '测试5', '<p>测试5</p>', '1', '2', '2017-04-18 15:54:00', '2017-04-18 15:54:00', '2');
INSERT INTO `t_goods` VALUES ('32', '42', '测试6', '测试6', '/pic/dydz/user/201704/1492502317321.png', '1', '测试6', '<p>测试6</p>', '1', '2', '2017-04-18 15:58:45', '2017-04-18 15:58:45', '2');
INSERT INTO `t_goods` VALUES ('33', '44', '商品测试', '商品测试', '/pic/dydz/user/201704/1492584904219.png', '1', '商品测试', '<p>商品测试</p>', '1', '2', '2017-04-19 14:55:11', '2017-04-19 14:55:11', '2');
INSERT INTO `t_goods` VALUES ('34', '0', '猪肉', '猪肉', '/pic/dydz/user/201704/1492676520540.png,/pic/dydz/user/201704/1492676566865.png,/pic/dydz/user/201704/1492676569651.png,/pic/dydz/user/201704/1492676572100.png,/pic/dydz/user/201704/1492676578043.png,/pic/dydz/user/201704/1492676581062.png', '2', '猪肉', '<p>猪肉</p>', '0', '2', '2017-04-20 16:23:12', '2017-04-21 14:55:19', '2');
INSERT INTO `t_goods` VALUES ('35', '0', ' Q弹鸡蛋干休闲零食素食干子五香味', 'Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492745610768.png,/pic/dydz/user/201704/1492745617000.png', '2', '', '<p><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745777758088497.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745777869035441.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745777980068647.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745778064068740.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745778147040993.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745778230041066.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745778286000818.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492745778343093532.jpg\" class=\"img-ks-lazyload\"/></p>', '0', '2', '2017-04-21 11:34:20', '2017-04-21 11:42:04', '2');
INSERT INTO `t_goods` VALUES ('36', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492746558027.jpg', '1', ' Q弹鸡蛋干休闲零食素食干子五香味', '<p><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2fDGvXanyQeBjSspeXXa8WpXa_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2.mzSlVXXXXc6XXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2CgjIlVXXXXbEXpXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2I7ZhlVXXXXaUXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2rRUqlVXXXXXJXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2ExMhlVXXXXbaXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2MmgplVXXXXXNXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i4/725677994/TB2yCwjlVXXXXaFXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:49:24', '2017-04-21 13:54:45', '2');
INSERT INTO `t_goods` VALUES ('37', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492746697362.jpg', '1', '', '<p><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2fDGvXanyQeBjSspeXXa8WpXa_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2.mzSlVXXXXc6XXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2CgjIlVXXXXbEXpXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2I7ZhlVXXXXaUXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2rRUqlVXXXXXJXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2ExMhlVXXXXbaXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2MmgplVXXXXXNXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i4/725677994/TB2yCwjlVXXXXaFXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:51:51', '2017-04-21 13:55:00', '2');
INSERT INTO `t_goods` VALUES ('38', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492747612871.jpg', '1', '', '<p><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717083017819.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717274088067.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717384053672.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717466044548.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717549040699.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717606017049.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717662068458.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746717720069179.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:52:14', '2017-04-21 13:55:19', '2');
INSERT INTO `t_goods` VALUES ('39', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492753946256.jpg', '1', '', '<p><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746740517067747.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746740709067966.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746740819050464.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746740902093931.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746740985027381.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746741067096906.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746741123044919.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746741180054571.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:52:32', '2017-04-21 13:55:42', '2');
INSERT INTO `t_goods` VALUES ('40', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492747652985.jpg', '1', '', '<p><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2fDGvXanyQeBjSspeXXa8WpXa_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2.mzSlVXXXXc6XXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2CgjIlVXXXXbEXpXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2I7ZhlVXXXXaUXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2rRUqlVXXXXXJXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2ExMhlVXXXXbaXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2MmgplVXXXXXNXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i4/725677994/TB2yCwjlVXXXXaFXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:52:58', '2017-04-21 13:58:32', '2');
INSERT INTO `t_goods` VALUES ('41', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492754167202.jpg', '1', '', '<p><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2fDGvXanyQeBjSspeXXa8WpXa_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2.mzSlVXXXXc6XXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2CgjIlVXXXXbEXpXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2I7ZhlVXXXXaUXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i2/725677994/TB2rRUqlVXXXXXJXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i3/725677994/TB2ExMhlVXXXXbaXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i1/725677994/TB2MmgplVXXXXXNXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"https://img.alicdn.com/imgextra/i4/725677994/TB2yCwjlVXXXXaFXXXXXXXXXXXX_!!725677994.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '1', '2017-04-21 11:53:10', '2017-04-21 13:56:13', '2');
INSERT INTO `t_goods` VALUES ('42', '48', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492747787563.jpg', '1', '', '<p><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802154078531.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802346057905.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802456093599.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802540004965.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802623099422.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802708021624.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802765047478.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746802822051547.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:53:26', '2017-04-21 13:48:48', '2');
INSERT INTO `t_goods` VALUES ('43', '50', ' Q弹鸡蛋干休闲零食素食干子五香味', ' Q弹鸡蛋干休闲零食素食干子五香味', '/pic/dydz/user/201704/1492747806355.jpg', '1', '', '<p><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746816744095968.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746816924027136.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746817026024365.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746817103019051.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746817181010478.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746817235007502.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746817287056458.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746817341002597.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 11:53:39', '2017-04-21 13:54:17', '2');
INSERT INTO `t_goods` VALUES ('44', '49', ' Q弹鸡蛋干休闲零食素食干子五香味1', ' Q弹鸡蛋干休闲零食素食干子五香味1', '/pic/dydz/user/201704/1492747865059.jpg', '1', '', '<p><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746825734023264.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746825941059451.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746826045021901.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746826124017861.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746826202014132.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746826256046048.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746826309095381.jpg\" class=\"img-ks-lazyload\"/><img alt=\"\" src=\"/ueditor/jsp/upload/image/20170421/1492746826362083321.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '1', '2017-04-21 11:53:52', '2017-04-21 13:57:48', '2');
INSERT INTO `t_goods` VALUES ('45', '46', '安徽淮南特产萝卜干农家自制下饭菜1', '安徽淮南特产萝卜干农家自制下饭菜', '/pic/dydz/user/201704/1492754856100.jpg', '1', '', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492754878872068192.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879082057437.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879186065888.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879366099059.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879468052937.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879575087880.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879679011104.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754879789042837.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:08:03', '2017-04-21 14:37:01', '2');
INSERT INTO `t_goods` VALUES ('46', '46', '安徽淮南特产萝卜干农家自制下饭菜', '安徽淮南特产萝卜干农家自制下饭菜', '/pic/dydz/user/201704/1492755184601.jpg', '1', '安徽淮南特产萝卜干农家自制下饭菜', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492754965219018548.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965428012294.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965482042862.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965614029139.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965668098376.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965748070476.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965828063136.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754965908001886.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:09:37', '2017-04-21 14:13:05', '2');
INSERT INTO `t_goods` VALUES ('47', '46', '安徽淮南特产萝卜干农家自制下饭菜', '安徽淮南特产萝卜干农家自制下饭菜', '/pic/dydz/user/201704/1492755203318.jpg', '1', '安徽淮南特产萝卜干农家自制下饭菜', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492754982304011550.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982507092233.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982560095012.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982688056529.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982741094676.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982818021614.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982896078095.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754982973012220.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:09:52', '2017-04-21 14:13:24', '2');
INSERT INTO `t_goods` VALUES ('48', '46', '安徽淮南特产萝卜干农家自制下饭菜22', '安徽淮南特产萝卜干农家自制下饭菜22', '/pic/dydz/user/201704/1492755215376.jpg', '1', '', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492754998957014565.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754999365023446.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754999557042802.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492754999845079767.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755000025038954.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755000206080382.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755000386002996.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755000588096071.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:10:02', '2017-04-21 14:19:57', '2');
INSERT INTO `t_goods` VALUES ('49', '46', '安徽淮南特产萝卜干农家自制下饭菜1', '安徽淮南特产萝卜干农家自制下饭菜1', '/pic/dydz/user/201704/1492755226604.jpg', '1', '安徽淮南特产萝卜干农家自制下饭菜', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492755010055067168.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755010408013656.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755010498031419.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755010719020759.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755010810047682.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755010944085764.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755011078007363.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755011210015699.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:10:16', '2017-04-21 14:18:20', '2');
INSERT INTO `t_goods` VALUES ('50', '46', '安徽淮南特产萝卜干农家自制下饭菜', '安徽淮南特产萝卜干农家自制下饭菜', '/pic/dydz/user/201704/1492755258447.jpg', '1', '安徽淮南特产萝卜干农家自制下饭菜', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492755025933034525.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755026329068246.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755026433051055.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755026690053118.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755026831059490.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755026986082811.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755027140084176.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492755027295023014.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:10:30', '2017-04-21 14:14:24', '2');
INSERT INTO `t_goods` VALUES ('51', '53', '定安黑猪冰鲜五花肉片', '定安黑猪冰鲜五花肉片', '/pic/dydz/user/201704/1492757977294.jpg', '1', '', '<p><img src=\"https://img.alicdn.com/imgextra/i2/2471189597/TB2JRploVXXXXbMXpXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i2/2471189597/TB2OAhRoVXXXXaeXXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i3/2471189597/TB2KpdxoVXXXXakXpXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i1/2471189597/TB2OJNJoVXXXXb4XXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i4/2471189597/TB2UjVXoVXXXXXZXFXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i1/2471189597/TB228hToVXXXXavXXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i2/2471189597/TB2AHlnoVXXXXa9XpXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i3/2471189597/TB2818moVXXXXbSXpXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i2/2471189597/TB21GBZoVXXXXXJXXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i4/2471189597/TB2fH0ToVXXXXazXXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i4/2471189597/TB2MPLUppXXXXbuXpXXXXXXXXXX_!!2471189597.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:57:41', '2017-04-21 14:59:43', '2');
INSERT INTO `t_goods` VALUES ('52', '53', '定安黑猪冰鲜五花肉片', '定安黑猪冰鲜五花肉片', '/pic/dydz/user/201704/1492758012666.jpg', '1', '', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492757867273000461.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867520028729.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867549022488.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867641041778.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867752014900.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867863098886.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867919067909.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757867976066095.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757868171047304.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757868392007979.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757868449087153.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:58:00', '2017-04-21 15:01:30', '2');
INSERT INTO `t_goods` VALUES ('53', '53', '定安黑猪冰鲜五花肉片', '定安黑猪冰鲜五花肉片', '/pic/dydz/user/201704/1492758046382.jpg', '1', '', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492757899657017874.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757899874019265.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757899903091552.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757899985035920.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900095055937.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900205091447.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900260093839.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900316022935.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900507050713.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900724010700.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757900780070082.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:58:13', '2017-04-21 15:00:47', '2');
INSERT INTO `t_goods` VALUES ('54', '53', '定安黑猪冰鲜五花肉片', '定安黑猪冰鲜五花肉片', '/pic/dydz/user/201704/1492757934259.jpg', '1', '', '<p><img src=\"/ueditor/jsp/upload/image/20170421/1492757913127005093.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913350080544.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913376017792.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913451049180.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913551012964.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913650023673.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913700036478.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913751008633.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757913925089845.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757914123060365.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492757914174089598.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p>', '1', '2', '2017-04-21 14:59:27', '2017-04-21 14:59:27', '2');
INSERT INTO `t_goods` VALUES ('55', '56', '精选荷兰豆300g 辣椒 新鲜蔬菜', '精选荷兰豆300g 辣椒 新鲜蔬菜', '/pic/dydz/user/201704/1492758349422.jpg', '1', '', '<p style=\"margin-top: 1.12em; margin-bottom: 1.12em; padding: 0px; line-height: 1.4; color: rgb(64, 64, 64); font-family: tahoma, arial, 宋体, sans-serif; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);\"><img src=\"/ueditor/jsp/upload/image/20170421/1492758241017038711.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758241223052582.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758241337024633.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758241485012910.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758241596097832.jpg\" class=\"img-ks-lazyload\"/></p><p><img src=\"/ueditor/jsp/upload/image/20170421/1492758241623007341.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p><p><br/></p>', '1', '2', '2017-04-21 15:04:15', '2017-04-21 15:05:57', '2');
INSERT INTO `t_goods` VALUES ('56', '56', '精选荷兰豆300g 辣椒 新鲜蔬菜', '精选荷兰豆300g 辣椒 新鲜蔬菜', '/pic/dydz/user/201704/1492758377383.jpg', '1', '', '<p style=\"margin-top: 1.12em; margin-bottom: 1.12em; padding: 0px; line-height: 1.4; color: rgb(64, 64, 64); font-family: tahoma, arial, 宋体, sans-serif; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);\"><img src=\"/ueditor/jsp/upload/image/20170421/1492758266122069990.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758266305062365.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758266385086073.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758266516078557.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758266621038715.jpg\" class=\"img-ks-lazyload\"/></p><p><img src=\"/ueditor/jsp/upload/image/20170421/1492758266648035519.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p><p><br/></p>', '1', '2', '2017-04-21 15:04:29', '2017-04-21 15:06:20', '2');
INSERT INTO `t_goods` VALUES ('57', '56', '精选荷兰豆300g 辣椒 新鲜蔬菜', '精选荷兰豆300g 辣椒 新鲜蔬菜', '/pic/dydz/user/201704/1492758398551.jpg', '1', '', '<p style=\"margin-top: 1.12em; margin-bottom: 1.12em; padding: 0px; line-height: 1.4; color: rgb(64, 64, 64); font-family: tahoma, arial, 宋体, sans-serif; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);\"><img src=\"https://img.alicdn.com/imgextra/i4/2471189597/TB2mG5WmVXXXXXvXpXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i2/2471189597/TB2G5q5mVXXXXctXXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i1/2471189597/TB2q45WmVXXXXXFXpXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i1/2471189597/TB2s454mVXXXXcxXXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/><img src=\"https://img.alicdn.com/imgextra/i2/2471189597/TB2S.y9mVXXXXb7XXXXXXXXXXXX_!!2471189597.jpg\" class=\"img-ks-lazyload\"/></p><p><img src=\"https://img.alicdn.com/imgextra/i4/2471189597/TB2MPLUppXXXXbuXpXXXXXXXXXX_!!2471189597.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p><p><br/></p>', '1', '2', '2017-04-21 15:04:43', '2017-04-21 15:06:40', '2');
INSERT INTO `t_goods` VALUES ('58', '56', '精选荷兰豆300g 辣椒 新鲜蔬菜', '精选荷兰豆300g 辣椒 新鲜蔬菜', '/pic/dydz/user/201704/1492758420324.jpg', '1', '', '<p style=\"margin-top: 1.12em; margin-bottom: 1.12em; padding: 0px; line-height: 1.4; color: rgb(64, 64, 64); font-family: tahoma, arial, 宋体, sans-serif; font-size: 14px; white-space: normal; background-color: rgb(255, 255, 255);\"><img src=\"/ueditor/jsp/upload/image/20170421/1492758293643039851.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758293831069288.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758293939098412.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758294075006056.jpg\" class=\"img-ks-lazyload\"/><img src=\"/ueditor/jsp/upload/image/20170421/1492758294183036985.jpg\" class=\"img-ks-lazyload\"/></p><p><img src=\"/ueditor/jsp/upload/image/20170421/1492758294211012829.jpg\" alt=\" 华南物流蔬菜模板-新.jpg\" class=\"img-ks-lazyload\"/></p><p><br/></p>', '1', '1', '2017-04-21 15:04:56', '2017-04-21 15:08:50', '2');

-- ----------------------------
-- Table structure for t_goods_category
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_category`;
CREATE TABLE `t_goods_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品种类id',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父种类id 为零表示顶层种类',
  `category_name` varchar(255) DEFAULT NULL COMMENT '商品种类名称',
  `image` varchar(255) DEFAULT NULL COMMENT '商品种类主图',
  `state` tinyint(4) DEFAULT '2' COMMENT '状态 1.启用 2.未启用 3 已删除',
  `simple_describe` varchar(255) DEFAULT NULL COMMENT '简要描述',
  `recommend` tinyint(4) DEFAULT '2' COMMENT '推荐标志 1是 2否',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) DEFAULT NULL COMMENT '创建者id',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8 COMMENT='商品种类表';

-- ----------------------------
-- Records of t_goods_category
-- ----------------------------
INSERT INTO `t_goods_category` VALUES ('1', '0', '水果', '/pic/dydz/user/201704/1491642215056.png', '3', '水果', '0', '2017-03-23 16:59:05', '2017-04-12 22:02:33', '2');
INSERT INTO `t_goods_category` VALUES ('2', '0', '热带水果', '', '3', '热带水果', '0', '2017-03-23 17:00:01', '2017-04-12 22:02:39', '2');
INSERT INTO `t_goods_category` VALUES ('3', '0', '海鲜', '/pic/dydz/user/201704/1492051262857.png', '1', '海鲜', '2', '2017-03-24 11:43:06', '2017-04-13 10:43:53', '2');
INSERT INTO `t_goods_category` VALUES ('4', '0', '干货', '/pic/dydz/user/201704/1492051380230.png', '1', '干货', '1', '2017-03-27 15:54:40', '2017-04-13 12:02:36', '2');
INSERT INTO `t_goods_category` VALUES ('5', '0', '蔬菜', '/pic/dydz/user/201704/1492051510860.png', '1', '蔬菜', '1', '2017-03-27 15:54:58', '2017-04-13 12:05:11', '2');
INSERT INTO `t_goods_category` VALUES ('6', '0', '肉蛋', '/pic/dydz/user/201704/1492051154958.png', '1', '柔内', '1', '2017-03-27 17:43:50', '2017-04-13 12:05:01', '2');
INSERT INTO `t_goods_category` VALUES ('7', '0', '粮油', '/pic/dydz/user/201704/1492051215398.png', '1', '酒类', '1', '2017-03-27 17:44:20', '2017-04-13 12:04:02', '2');
INSERT INTO `t_goods_category` VALUES ('8', '0', '糖果', '/pic/dydz/user/201704/1492006947040.jpg', '1', '糖果', '1', '2017-03-27 17:45:02', '2017-04-12 22:22:29', '2');
INSERT INTO `t_goods_category` VALUES ('9', '0', '茶具', '', '3', '茶具', '0', '2017-03-27 17:45:18', '2017-04-12 22:08:36', '2');
INSERT INTO `t_goods_category` VALUES ('10', '0', '饮料', '', '3', '饮料', '0', '2017-03-27 17:45:36', '2017-04-12 22:03:00', '2');
INSERT INTO `t_goods_category` VALUES ('11', '0', '水产', '/pic/dydz/user/201704/1492051444296.png', '1', '水产', '1', '2017-04-08 17:04:34', '2017-04-13 12:04:42', '2');
INSERT INTO `t_goods_category` VALUES ('12', '0', '调料', '/pic/dydz/user/201704/1492051200017.png', '1', '', '1', '2017-04-08 17:06:35', '2017-04-13 12:03:09', '2');
INSERT INTO `t_goods_category` VALUES ('13', '0', '洗涤', '/pic/dydz/user/201704/1492051175412.png', '1', '', '1', '2017-04-08 17:07:16', '2017-04-13 12:02:57', '2');
INSERT INTO `t_goods_category` VALUES ('14', '0', '厨具', '/pic/dydz/user/201704/1492051347878.png', '1', '', '1', '2017-04-08 17:07:32', '2017-04-13 12:02:47', '2');
INSERT INTO `t_goods_category` VALUES ('15', '0', '23123', '/pic/dydz/user/201704/1491808946526.png', '3', '', '0', '2017-04-10 15:22:54', '2017-04-12 15:31:12', '2');
INSERT INTO `t_goods_category` VALUES ('16', '0', '商品分类测试', '/pic/dydz/user/201704/1491817916896.jpg,/pic/dydz/user/201704/1491817919667.jpg,/pic/dydz/user/201704/1491817924384.jpg', '3', '商品简要描述', '0', '2017-04-10 17:52:20', '2017-04-12 15:31:09', '2');
INSERT INTO `t_goods_category` VALUES ('17', '0', '液化气灶', '', '3', '液化气灶', '0', '2017-04-12 22:04:11', '2017-04-21 14:46:37', '2');
INSERT INTO `t_goods_category` VALUES ('18', '13', '洗衣粉', '', '1', '洗衣粉', '1', '2017-04-12 22:04:29', '2017-04-12 22:04:29', '2');
INSERT INTO `t_goods_category` VALUES ('19', '12', '酱油', '', '1', '酱油', '1', '2017-04-12 22:04:51', '2017-04-12 22:04:51', '2');
INSERT INTO `t_goods_category` VALUES ('20', '7', '植物油', '', '1', '植物油', '1', '2017-04-12 22:05:08', '2017-04-12 22:05:08', '2');
INSERT INTO `t_goods_category` VALUES ('21', '4', '松果', '', '1', '松果', '1', '2017-04-12 22:05:46', '2017-04-12 22:05:46', '2');
INSERT INTO `t_goods_category` VALUES ('22', '11', '水库鱼', '', '1', '水库鱼', '1', '2017-04-12 22:06:19', '2017-04-12 22:06:19', '2');
INSERT INTO `t_goods_category` VALUES ('23', '6', '鸡蛋', '', '1', '鸡蛋', '1', '2017-04-12 22:07:44', '2017-04-12 22:07:44', '2');
INSERT INTO `t_goods_category` VALUES ('24', '5', '小白菜', '', '1', '小白菜', '1', '2017-04-12 22:08:16', '2017-04-12 22:08:16', '2');
INSERT INTO `t_goods_category` VALUES ('25', '8', '水果糖', '', '1', '水果糖', '1', '2017-04-12 22:09:13', '2017-04-12 22:09:13', '2');
INSERT INTO `t_goods_category` VALUES ('26', '3', '比目鱼', '', '1', '比目鱼', '1', '2017-04-12 22:10:04', '2017-04-12 22:10:04', '2');
INSERT INTO `t_goods_category` VALUES ('27', '0', '水果', '/pic/dydz/user/201704/1492051589011.png', '1', '水果', '1', '2017-04-13 10:46:37', '2017-04-13 12:04:29', '2');
INSERT INTO `t_goods_category` VALUES ('28', '0', '苹果', '/pic/dydz/user/201704/1492051705695.jpg', '3', '苹果', '0', '2017-04-13 10:48:32', '2017-04-14 17:34:41', '2');
INSERT INTO `t_goods_category` VALUES ('29', '27', '非洲水果', '', '1', '非洲水果', '2', '2017-04-14 17:39:14', '2017-04-14 17:40:05', '2');
INSERT INTO `t_goods_category` VALUES ('30', '27', '热带水果', '', '1', '', '2', '2017-04-14 17:39:42', '2017-04-14 17:41:57', '2');
INSERT INTO `t_goods_category` VALUES ('31', '0', '带叶蔬菜', '', '3', '带叶蔬菜', '0', '2017-04-18 09:50:08', '2017-04-18 09:52:27', '2');
INSERT INTO `t_goods_category` VALUES ('32', '0', '测试蔬菜二级', '', '3', '测试蔬菜二级', '0', '2017-04-18 10:29:07', '2017-04-18 10:30:20', '2');
INSERT INTO `t_goods_category` VALUES ('33', '0', '测试二级分类', '', '3', '测试二级分类', '0', '2017-04-18 10:52:45', '2017-04-18 10:53:19', '2');
INSERT INTO `t_goods_category` VALUES ('34', '0', '刀具', '', '3', '刀具', '0', '2017-04-18 15:10:21', '2017-04-21 14:46:46', '2');
INSERT INTO `t_goods_category` VALUES ('35', '0', '保温壶', '', '3', '保温壶', '0', '2017-04-18 15:12:00', '2017-04-21 14:47:01', '2');
INSERT INTO `t_goods_category` VALUES ('36', '0', '焖烧罐', '', '3', '焖烧罐', '0', '2017-04-18 15:12:18', '2017-04-21 14:47:07', '2');
INSERT INTO `t_goods_category` VALUES ('37', '0', '烧烤炉', '', '3', '', '0', '2017-04-18 15:12:38', '2017-04-21 14:47:13', '2');
INSERT INTO `t_goods_category` VALUES ('38', '0', '砂锅', '', '3', '', '0', '2017-04-18 15:12:49', '2017-04-21 14:47:19', '2');
INSERT INTO `t_goods_category` VALUES ('39', '14', '餐盘', '', '1', '', '2', '2017-04-18 15:13:35', '2017-04-18 15:13:35', '2');
INSERT INTO `t_goods_category` VALUES ('40', '4', '压力锅', '', '1', '压力锅', '2', '2017-04-18 15:14:06', '2017-04-18 15:14:06', '2');
INSERT INTO `t_goods_category` VALUES ('41', '14', '碗', '', '1', '', '2', '2017-04-18 15:14:56', '2017-04-18 15:14:56', '2');
INSERT INTO `t_goods_category` VALUES ('42', '14', '玻璃杯', '', '1', '', '2', '2017-04-18 15:15:16', '2017-04-18 15:15:16', '2');
INSERT INTO `t_goods_category` VALUES ('43', '0', '一级分类测试', '', '3', '一级分类测试', '0', '2017-04-19 14:54:12', '2017-04-20 16:05:51', '2');
INSERT INTO `t_goods_category` VALUES ('44', '0', '二级分类测试', '', '3', '二级分类测试', '0', '2017-04-19 14:54:25', '2017-04-19 14:55:30', '2');
INSERT INTO `t_goods_category` VALUES ('45', '0', '豆制', '', '1', '', '2', '2017-04-20 16:06:20', '2017-04-21 15:08:40', '2');
INSERT INTO `t_goods_category` VALUES ('46', '0', '腌制', '', '1', '', '1', '2017-04-20 16:06:51', '2017-04-21 15:08:19', '2');
INSERT INTO `t_goods_category` VALUES ('47', '0', '鲜肉', '', '1', '', '2', '2017-04-20 16:07:09', '2017-04-20 16:07:09', '2');
INSERT INTO `t_goods_category` VALUES ('48', '45', '白豆腐', '', '1', '', '2', '2017-04-21 11:30:53', '2017-04-21 11:31:26', '2');
INSERT INTO `t_goods_category` VALUES ('49', '45', '老豆腐', '', '1', '', '2', '2017-04-21 11:31:40', '2017-04-21 11:31:40', '2');
INSERT INTO `t_goods_category` VALUES ('50', '45', '卤豆干', '', '1', '', '2', '2017-04-21 11:31:51', '2017-04-21 11:31:51', '2');
INSERT INTO `t_goods_category` VALUES ('51', '0', '嫩豆腐', '', '3', '', '0', '2017-04-21 14:38:59', '2017-04-21 14:41:43', '2');
INSERT INTO `t_goods_category` VALUES ('52', '0', '魔芋豆腐', '', '3', '', '0', '2017-04-21 14:39:27', '2017-04-21 14:46:13', '2');
INSERT INTO `t_goods_category` VALUES ('53', '47', '猪肉', '', '1', '', '2', '2017-04-21 14:56:02', '2017-04-21 14:56:02', '2');
INSERT INTO `t_goods_category` VALUES ('54', '47', '牛肉', '', '1', '', '2', '2017-04-21 14:56:12', '2017-04-21 14:56:12', '2');
INSERT INTO `t_goods_category` VALUES ('55', '47', '鸡肉', '', '1', '', '2', '2017-04-21 14:56:22', '2017-04-21 14:56:22', '2');
INSERT INTO `t_goods_category` VALUES ('56', '5', '豆类', '', '1', '', '2', '2017-04-21 15:03:53', '2017-04-21 15:03:53', '2');

-- ----------------------------
-- Table structure for t_goods_price
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_price`;
CREATE TABLE `t_goods_price` (
  `price_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '商品规格价格id',
  `goods_id` int(11) DEFAULT NULL COMMENT '商品id',
  `unit_name` varchar(255) DEFAULT NULL COMMENT '计量单位',
  `retail_price` int(11) DEFAULT NULL COMMENT '零售价（以分为单位）',
  `buy_price` int(11) DEFAULT NULL COMMENT '采购价（以分为单位）',
  `wholesale_price` int(11) DEFAULT NULL COMMENT '批发价（以分为单位）',
  `state` tinyint(4) DEFAULT NULL COMMENT '状态：1.启用 2.未启用 （后台未启用页面不显示，前台显示已下架）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) DEFAULT NULL COMMENT '创建者id',
  PRIMARY KEY (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8 COMMENT='商品规格价格';

-- ----------------------------
-- Records of t_goods_price
-- ----------------------------
INSERT INTO `t_goods_price` VALUES ('1', '1', '每斤', '500', '450', '490', '2', '2017-03-23 17:20:23', '2017-04-12 15:32:27', '2');
INSERT INTO `t_goods_price` VALUES ('2', '2', '每斤', '500000', '500000', '500000', '2', '2017-04-01 18:21:57', '2017-04-23 15:53:46', '11');
INSERT INTO `t_goods_price` VALUES ('3', '3', '每斤', '100000', '100000', '100000', '1', '2017-04-01 21:34:02', '2017-04-01 21:34:02', '2');
INSERT INTO `t_goods_price` VALUES ('4', '2', '每十斤', '2000', '5000', '2000', '2', '2017-04-06 09:02:29', '2017-04-23 15:53:46', '11');
INSERT INTO `t_goods_price` VALUES ('5', '4', '每十斤', '2300', '3101', '2323', '1', '2017-04-10 15:19:19', '2017-04-10 15:19:19', '2');
INSERT INTO `t_goods_price` VALUES ('6', '5', '每斤', '2343', '2343', '2343', '2', '2017-04-12 11:23:41', '2017-04-12 22:00:18', '2');
INSERT INTO `t_goods_price` VALUES ('7', '6', '每斤', '4334', '5434', '3534', '1', '2017-04-12 11:25:02', '2017-04-12 11:25:02', '2');
INSERT INTO `t_goods_price` VALUES ('8', '7', '吨', '100000', '130000', '120000', '1', '2017-04-12 12:02:57', '2017-04-12 12:02:57', '2');
INSERT INTO `t_goods_price` VALUES ('9', '7', '斤', '1100', '1300', '1200', '1', '2017-04-12 12:02:57', '2017-04-12 12:02:57', '2');
INSERT INTO `t_goods_price` VALUES ('10', '8', '每套', '80000', '50000', '60000', '1', '2017-04-12 17:07:12', '2017-04-12 17:07:12', '2');
INSERT INTO `t_goods_price` VALUES ('11', '1', '斤', '900', '500', '700', '2', '2017-04-12 17:16:25', '2017-04-13 21:25:40', '2');
INSERT INTO `t_goods_price` VALUES ('12', '2', '吨', '17000', '14000', '16000', '2', '2017-04-12 17:29:40', '2017-04-23 15:53:46', '11');
INSERT INTO `t_goods_price` VALUES ('13', '9', '个', '20000', '9000', '17000', '1', '2017-04-12 17:44:11', '2017-04-12 17:44:11', '2');
INSERT INTO `t_goods_price` VALUES ('14', '10', '1', '1300', '1000', '1200', '2', '2017-04-12 19:42:05', '2017-04-12 20:27:16', '2');
INSERT INTO `t_goods_price` VALUES ('15', '11', '个', '2600', '2200', '2500', '1', '2017-04-12 19:49:42', '2017-04-12 19:49:42', '2');
INSERT INTO `t_goods_price` VALUES ('16', '12', '个', '4400', '6600', '3300', '1', '2017-04-12 20:05:20', '2017-04-12 20:05:20', '2');
INSERT INTO `t_goods_price` VALUES ('17', '13', '包', '4400', '3300', '4000', '1', '2017-04-12 20:09:10', '2017-04-12 20:09:10', '2');
INSERT INTO `t_goods_price` VALUES ('18', '14', '斤', '8000', '5000', '6000', '1', '2017-04-12 20:14:19', '2017-04-12 20:14:19', '2');
INSERT INTO `t_goods_price` VALUES ('19', '10', '个', '4000', '5500', '3900', '1', '2017-04-12 20:27:16', '2017-04-12 20:27:16', '2');
INSERT INTO `t_goods_price` VALUES ('20', '5', '每斤', '3400', '3200', '5400', '1', '2017-04-12 22:00:18', '2017-04-12 22:00:18', '2');
INSERT INTO `t_goods_price` VALUES ('21', '15', '每包', '4300', '2300', '3400', '1', '2017-04-12 22:16:23', '2017-04-12 22:16:23', '2');
INSERT INTO `t_goods_price` VALUES ('22', '16', '每台', '234300', '234300', '234300', '2', '2017-04-12 22:18:16', '2017-04-18 10:17:52', '2');
INSERT INTO `t_goods_price` VALUES ('23', '17', '每斤', '3400', '3400', '3400', '1', '2017-04-12 22:24:00', '2017-04-12 22:24:00', '2');
INSERT INTO `t_goods_price` VALUES ('24', '17', '每个', '220', '220', '220', '1', '2017-04-12 22:24:48', '2017-04-12 22:24:48', '2');
INSERT INTO `t_goods_price` VALUES ('25', '18', '每斤', '5600', '5600', '5600', '1', '2017-04-12 22:26:36', '2017-04-12 22:26:36', '2');
INSERT INTO `t_goods_price` VALUES ('26', '19', '个', '798', '365', '688', '1', '2017-04-13 16:35:29', '2017-04-13 16:35:29', '2');
INSERT INTO `t_goods_price` VALUES ('27', '20', '斤', '999', '698', '888', '1', '2017-04-13 16:45:36', '2017-04-13 16:45:36', '2');
INSERT INTO `t_goods_price` VALUES ('28', '21', '对', '7800', '8800', '6800', '1', '2017-04-13 21:30:32', '2017-04-13 21:30:32', '2');
INSERT INTO `t_goods_price` VALUES ('29', '1', '包', '8800', '9900', '7700', '1', '2017-04-13 21:30:52', '2017-04-13 21:30:52', '2');
INSERT INTO `t_goods_price` VALUES ('30', '22', '个', '6800', '8800', '5500', '2', '2017-04-13 21:39:44', '2017-04-14 17:32:14', '2');
INSERT INTO `t_goods_price` VALUES ('31', '23', '包', '5656', '4534', '5011', '2', '2017-04-14 11:57:07', '2017-04-20 15:43:36', '2');
INSERT INTO `t_goods_price` VALUES ('32', '24', '个', '800', '400', '600', '1', '2017-04-14 15:16:07', '2017-04-14 15:16:07', '2');
INSERT INTO `t_goods_price` VALUES ('33', '24', '测试5', '5500', '5500', '5500', '1', '2017-04-14 15:39:17', '2017-04-14 15:39:17', '2');
INSERT INTO `t_goods_price` VALUES ('34', '24', '测试3', '4400', '4400', '4400', '1', '2017-04-14 15:39:17', '2017-04-14 15:39:17', '2');
INSERT INTO `t_goods_price` VALUES ('35', '24', '测试2', '2200', '2200', '2200', '1', '2017-04-14 15:39:17', '2017-04-14 15:39:17', '2');
INSERT INTO `t_goods_price` VALUES ('36', '24', '测试1', '1100', '1100', '100', '1', '2017-04-14 15:39:17', '2017-04-14 15:39:17', '2');
INSERT INTO `t_goods_price` VALUES ('37', '22', '个', '33300', '22200', '33300', '1', '2017-04-14 17:33:01', '2017-04-14 17:33:01', '2');
INSERT INTO `t_goods_price` VALUES ('38', '16', '台', '300000', '100000', '200000', '1', '2017-04-18 10:17:52', '2017-04-18 10:17:52', '2');
INSERT INTO `t_goods_price` VALUES ('39', '26', '每斤', '1200', '1200', '3400', '1', '2017-04-18 10:29:57', '2017-04-18 10:29:57', '2');
INSERT INTO `t_goods_price` VALUES ('40', '27', '打', '99900', '66600', '88800', '2', '2017-04-18 15:20:58', '2017-04-18 15:24:39', '2');
INSERT INTO `t_goods_price` VALUES ('41', '27', '个', '33300', '11100', '22200', '2', '2017-04-18 15:20:58', '2017-04-18 15:24:39', '2');
INSERT INTO `t_goods_price` VALUES ('42', '28', '个', '300', '100', '200', '1', '2017-04-18 15:52:22', '2017-04-18 15:52:22', '2');
INSERT INTO `t_goods_price` VALUES ('43', '29', '个', '400', '300', '500', '1', '2017-04-18 15:52:47', '2017-04-18 15:52:47', '2');
INSERT INTO `t_goods_price` VALUES ('44', '30', '个', '200', '100', '300', '1', '2017-04-18 15:53:24', '2017-04-18 15:53:24', '2');
INSERT INTO `t_goods_price` VALUES ('45', '31', '个', '500', '400', '600', '1', '2017-04-18 15:54:00', '2017-04-18 15:54:00', '2');
INSERT INTO `t_goods_price` VALUES ('46', '32', '个', '4800', '4400', '5500', '1', '2017-04-18 15:58:45', '2017-04-18 15:58:45', '2');
INSERT INTO `t_goods_price` VALUES ('47', '33', '个', '7700', '5500', '8800', '1', '2017-04-19 14:55:11', '2017-04-19 14:55:11', '2');
INSERT INTO `t_goods_price` VALUES ('48', '34', '斤', '1300', '1000', '1200', '1', '2017-04-21 10:10:06', '2017-04-21 10:10:06', '2');
INSERT INTO `t_goods_price` VALUES ('49', '23', '斤', '3500', '2500', '3000', '1', '2017-04-21 10:10:43', '2017-04-21 10:10:43', '2');
INSERT INTO `t_goods_price` VALUES ('50', '35', '斤', '700', '500', '600', '1', '2017-04-21 11:34:20', '2017-04-21 11:34:20', '2');
INSERT INTO `t_goods_price` VALUES ('51', '36', '包', '1500', '1200', '1300', '2', '2017-04-21 11:49:24', '2017-04-21 13:54:45', '2');
INSERT INTO `t_goods_price` VALUES ('52', '38', '个', '100', '100', '100', '2', '2017-04-21 11:56:08', '2017-04-21 12:07:04', '2');
INSERT INTO `t_goods_price` VALUES ('53', '41', '个', '100', '100', '100', '1', '2017-04-21 11:57:04', '2017-04-21 11:57:04', '2');
INSERT INTO `t_goods_price` VALUES ('54', '39', '个', '100', '100', '200', '2', '2017-04-21 12:06:31', '2017-04-21 13:48:26', '2');
INSERT INTO `t_goods_price` VALUES ('55', '38', '个', '300', '100', '200', '2', '2017-04-21 12:07:04', '2017-04-21 13:55:19', '2');
INSERT INTO `t_goods_price` VALUES ('56', '40', '斤', '300', '100', '200', '2', '2017-04-21 12:07:34', '2017-04-21 13:58:32', '2');
INSERT INTO `t_goods_price` VALUES ('57', '42', '斤', '3300', '1100', '2200', '1', '2017-04-21 12:09:48', '2017-04-21 12:09:48', '2');
INSERT INTO `t_goods_price` VALUES ('58', '43', '斤', '3300', '1100', '2200', '2', '2017-04-21 12:10:08', '2017-04-21 13:54:17', '2');
INSERT INTO `t_goods_price` VALUES ('59', '44', '斤', '3300', '1100', '2200', '2', '2017-04-21 12:11:06', '2017-04-21 13:48:37', '2');
INSERT INTO `t_goods_price` VALUES ('60', '44', '包', '3300', '1100', '2200', '2', '2017-04-21 13:53:55', '2017-04-21 13:56:37', '2');
INSERT INTO `t_goods_price` VALUES ('61', '43', '包', '3300', '1100', '2200', '1', '2017-04-21 13:54:17', '2017-04-21 13:54:17', '2');
INSERT INTO `t_goods_price` VALUES ('62', '36', '包', '3300', '1100', '2200', '1', '2017-04-21 13:54:45', '2017-04-21 13:54:45', '2');
INSERT INTO `t_goods_price` VALUES ('63', '37', '包', '3300', '1100', '2200', '1', '2017-04-21 13:55:00', '2017-04-21 13:55:00', '2');
INSERT INTO `t_goods_price` VALUES ('64', '38', '包', '3300', '1100', '2200', '1', '2017-04-21 13:55:19', '2017-04-21 13:55:19', '2');
INSERT INTO `t_goods_price` VALUES ('65', '39', '包', '3300', '1100', '2200', '1', '2017-04-21 13:55:42', '2017-04-21 13:55:42', '2');
INSERT INTO `t_goods_price` VALUES ('66', '44', '包', '3300', '1100', '2200', '2', '2017-04-21 13:56:37', '2017-04-21 13:56:59', '2');
INSERT INTO `t_goods_price` VALUES ('67', '44', '包', '3300', '1100', '2200', '2', '2017-04-21 13:56:59', '2017-04-21 13:57:24', '2');
INSERT INTO `t_goods_price` VALUES ('68', '44', '包', '3300', '1100', '2200', '2', '2017-04-21 13:57:24', '2017-04-21 13:57:48', '2');
INSERT INTO `t_goods_price` VALUES ('69', '44', '斤', '23400', '12300', '1100', '1', '2017-04-21 13:57:48', '2017-04-21 13:57:48', '2');
INSERT INTO `t_goods_price` VALUES ('70', '40', '包', '3300', '1100', '2200', '1', '2017-04-21 13:58:32', '2017-04-21 13:58:32', '2');
INSERT INTO `t_goods_price` VALUES ('71', '45', '斤', '1600', '1000', '1500', '2', '2017-04-21 14:08:03', '2017-04-21 14:15:02', '2');
INSERT INTO `t_goods_price` VALUES ('72', '46', '斤', '1500', '1200', '1300', '1', '2017-04-21 14:11:30', '2017-04-21 14:11:30', '2');
INSERT INTO `t_goods_price` VALUES ('73', '47', '斤', '1400', '1000', '1200', '1', '2017-04-21 14:11:57', '2017-04-21 14:11:57', '2');
INSERT INTO `t_goods_price` VALUES ('74', '48', '斤', '1500', '1200', '1200', '2', '2017-04-21 14:12:22', '2017-04-21 14:13:36', '2');
INSERT INTO `t_goods_price` VALUES ('75', '49', '斤', '1900', '1500', '1800', '2', '2017-04-21 14:12:49', '2017-04-21 14:15:35', '2');
INSERT INTO `t_goods_price` VALUES ('76', '50', '斤', '1500', '1200', '1300', '1', '2017-04-21 14:14:24', '2017-04-21 14:14:24', '2');
INSERT INTO `t_goods_price` VALUES ('77', '45', '斤', '2400', '1900', '2000', '2', '2017-04-21 14:15:02', '2017-04-21 14:23:30', '2');
INSERT INTO `t_goods_price` VALUES ('78', '49', '斤', '1300', '900', '1200', '2', '2017-04-21 14:15:35', '2017-04-21 14:18:20', '2');
INSERT INTO `t_goods_price` VALUES ('79', '49', '斤', '3300', '1100', '2200', '1', '2017-04-21 14:18:20', '2017-04-21 14:18:20', '2');
INSERT INTO `t_goods_price` VALUES ('80', '48', '斤', '33300', '11100', '22200', '2', '2017-04-21 14:18:54', '2017-04-21 14:19:57', '2');
INSERT INTO `t_goods_price` VALUES ('81', '48', '斤', '3300', '2200', '2200', '1', '2017-04-21 14:19:57', '2017-04-21 14:19:57', '2');
INSERT INTO `t_goods_price` VALUES ('82', '45', '斤', '10000', '9900', '9900', '1', '2017-04-21 14:37:01', '2017-04-21 14:37:01', '2');
INSERT INTO `t_goods_price` VALUES ('83', '51', '斤', '3600', '3000', '3300', '1', '2017-04-21 14:57:41', '2017-04-21 14:57:41', '2');
INSERT INTO `t_goods_price` VALUES ('84', '54', '斤', '3400', '3000', '3200', '1', '2017-04-21 14:59:27', '2017-04-21 14:59:27', '2');
INSERT INTO `t_goods_price` VALUES ('85', '53', '斤', '3300', '3000', '3200', '1', '2017-04-21 15:00:47', '2017-04-21 15:00:47', '2');
INSERT INTO `t_goods_price` VALUES ('86', '52', '斤', '3800', '3300', '3600', '1', '2017-04-21 15:01:30', '2017-04-21 15:01:30', '2');
INSERT INTO `t_goods_price` VALUES ('87', '55', '斤', '1200', '900', '1100', '1', '2017-04-21 15:05:57', '2017-04-21 15:05:57', '2');
INSERT INTO `t_goods_price` VALUES ('88', '56', '斤', '3300', '1100', '2200', '1', '2017-04-21 15:06:20', '2017-04-21 15:06:20', '2');
INSERT INTO `t_goods_price` VALUES ('89', '57', '斤', '3300', '1100', '2200', '1', '2017-04-21 15:06:40', '2017-04-21 15:06:40', '2');
INSERT INTO `t_goods_price` VALUES ('90', '58', '斤', '3300', '1100', '2200', '2', '2017-04-21 15:07:03', '2017-04-21 15:07:39', '2');

-- ----------------------------
-- Table structure for t_message
-- ----------------------------
DROP TABLE IF EXISTS `t_message`;
CREATE TABLE `t_message` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '消息id，主键，自增1',
  `message_title` varchar(255) DEFAULT NULL COMMENT '消息标题',
  `message_short_context` varchar(255) DEFAULT NULL COMMENT '简单描述',
  `message_context` text COMMENT '消息内容',
  `url` varchar(255) DEFAULT NULL COMMENT '链接地址',
  `push_time` datetime DEFAULT NULL COMMENT '推送时间',
  `push` tinyint(4) DEFAULT NULL COMMENT '推送标志，1 推送 2 未推送',
  `push_now` tinyint(4) DEFAULT NULL COMMENT '立即推送标志，1 立即推送 2 否',
  `is_all` tinyint(4) DEFAULT NULL COMMENT '是否发送全部用户，1 是 2 否',
  `user_ids` text COMMENT '用户id列表',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除状态 1 已删除 2 未删除',
  `admin_id` int(11) DEFAULT NULL COMMENT '创建者id',
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_message
-- ----------------------------

-- ----------------------------
-- Table structure for t_module
-- ----------------------------
DROP TABLE IF EXISTS `t_module`;
CREATE TABLE `t_module` (
  `module_id` int(11) NOT NULL COMMENT '模块id',
  `parent_id` int(11) DEFAULT NULL COMMENT '父id，表示模块id',
  `name` varchar(255) DEFAULT NULL COMMENT '模块名称',
  `url` varchar(255) DEFAULT NULL COMMENT 'URL地址',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `state` tinyint(4) DEFAULT '1' COMMENT '状态：1.开启 2.关闭',
  PRIMARY KEY (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_module
-- ----------------------------
INSERT INTO `t_module` VALUES ('1', '0', '商品管理', null, null, '2017-04-04 10:56:59', '2017-04-04 10:56:59', '1');
INSERT INTO `t_module` VALUES ('2', '0', '客户中心', null, null, '2017-04-04 10:56:21', '2017-04-04 10:56:21', '1');
INSERT INTO `t_module` VALUES ('3', '0', '文章管理', null, null, '2017-04-04 10:57:08', '2017-04-04 10:57:08', '1');
INSERT INTO `t_module` VALUES ('4', '0', '广告管理', null, null, '2017-04-15 17:40:00', '2017-04-15 17:40:03', '1');
INSERT INTO `t_module` VALUES ('5', '0', '商品订单', null, null, '2017-04-15 17:40:26', '2017-04-15 17:40:29', '1');
INSERT INTO `t_module` VALUES ('6', '0', '账号管理', null, null, '2017-04-04 10:57:17', '2017-04-04 10:57:17', '1');
INSERT INTO `t_module` VALUES ('7', '1', '商品列表', '/page/manage_goods_list.html?lid=0', null, '2017-04-15 17:50:58', '2017-04-15 17:50:58', '1');
INSERT INTO `t_module` VALUES ('8', '1', '商品订单', '/page/manage_goods_order.html?lid=1', null, '2017-04-15 17:51:27', '2017-04-15 17:51:27', '1');
INSERT INTO `t_module` VALUES ('9', '1', '商品分类', '/page/manage_product_category_list.html?lid=2', null, '2017-04-15 17:51:50', '2017-04-15 17:51:50', '1');
INSERT INTO `t_module` VALUES ('10', '2', '会员管理', '/page/manage_vip_list.html?lid=3', null, '2017-04-04 12:12:28', '2017-04-04 12:12:28', '1');
INSERT INTO `t_module` VALUES ('11', '2', '消息推送', '/page/manage_message_list.html?lid=4', null, '2017-04-15 17:48:04', '2017-04-15 17:48:04', '1');
INSERT INTO `t_module` VALUES ('12', '3', '文章列表', '/page/manage_article_list.html?lid=5', null, '2017-04-15 17:52:28', '2017-04-15 17:52:28', '1');
INSERT INTO `t_module` VALUES ('13', '4', '设置广告', '/page/manage_adPosition_list.html?lid=6', null, '2017-04-15 17:52:54', '2017-04-15 17:52:54', '1');
INSERT INTO `t_module` VALUES ('14', '5', '商品统计', '/page/manage_goods_report.html?lid=7', null, '2017-04-15 17:53:49', '2017-04-15 17:53:49', '1');
INSERT INTO `t_module` VALUES ('15', '5', '订单统计', '/page/manage_order_report.html?lid=8', null, '2017-04-15 17:54:14', '2017-04-15 17:54:14', '1');
INSERT INTO `t_module` VALUES ('16', '6', '管理员设置', '/page/manage_setting.html?lid=9', null, '2017-04-04 12:10:45', '2017-04-04 12:10:45', '1');
INSERT INTO `t_module` VALUES ('17', '6', '角色权限设置', '/page/manage_role.html?lid=10', null, '2017-04-15 17:49:46', '2017-04-15 17:49:46', '1');

-- ----------------------------
-- Table structure for t_order
-- ----------------------------
DROP TABLE IF EXISTS `t_order`;
CREATE TABLE `t_order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `order_number` varchar(255) DEFAULT '' COMMENT '订单号',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `total_amount` int(11) DEFAULT NULL COMMENT '订单总金额(以分为单位)',
  `paid_amount` int(11) DEFAULT NULL COMMENT '实付金额',
  `discount_amount` int(11) DEFAULT NULL COMMENT '优惠金额',
  `receive_id` int(11) DEFAULT NULL COMMENT '收货id',
  `send_time` datetime DEFAULT NULL COMMENT '发货时间',
  `logistics_state` tinyint(4) DEFAULT '1' COMMENT '配送状态 1 待待配 2  已配送 3 已确认收货',
  `invoice_tag` tinyint(4) DEFAULT '0' COMMENT '开具发票标志 0 否 1 是',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除 1是 2否',
  `payment_id` int(11) DEFAULT NULL COMMENT '支付方式id',
  `payment_seq` varchar(255) DEFAULT NULL COMMENT '在线支付流水号',
  `pay_state` tinyint(3) unsigned DEFAULT '1' COMMENT '支付状态 1.未付款 2 已付款',
  `comment` varchar(255) DEFAULT NULL COMMENT '备注说明',
  `create_time` datetime DEFAULT NULL COMMENT '下单时间',
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8 COMMENT='订单表';

-- ----------------------------
-- Records of t_order
-- ----------------------------

-- ----------------------------
-- Table structure for t_order_certify
-- ----------------------------
DROP TABLE IF EXISTS `t_order_certify`;
CREATE TABLE `t_order_certify` (
  `certify_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '收款凭证id，主键',
  `order_id` int(11) DEFAULT NULL COMMENT '订单id',
  `order_number` varchar(255) DEFAULT NULL COMMENT '订单号',
  `image_url` varchar(255) DEFAULT NULL COMMENT '订单凭证',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`certify_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='订单收款凭证表';

-- ----------------------------
-- Records of t_order_certify
-- ----------------------------


-- ----------------------------
-- Table structure for t_order_details
-- ----------------------------
DROP TABLE IF EXISTS `t_order_details`;
CREATE TABLE `t_order_details` (
  `order_details_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '订单详情id',
  `order_id` int(11) DEFAULT NULL COMMENT '订单id',
  `order_number` varchar(255) DEFAULT '' COMMENT '订单号',
  `price_id` int(11) DEFAULT NULL COMMENT '商品规格价格id',
  `goods_id` int(11) DEFAULT NULL COMMENT '商品id',
  `unit_name` varchar(255) DEFAULT NULL COMMENT '商品规格名称',
  `goods_name` varchar(255) DEFAULT '' COMMENT '商品名称',
  `unit_price` int(11) DEFAULT NULL COMMENT '商品规格价格(以分为单位)',
  `num` int(11) DEFAULT NULL COMMENT '个数',
  `details_amount` int(11) DEFAULT NULL COMMENT '订单单品总价(以分为单位)',
  `create_time` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT '' COMMENT '商品主图',
  PRIMARY KEY (`order_details_id`)
) ENGINE=InnoDB AUTO_INCREMENT=391 DEFAULT CHARSET=utf8 COMMENT='订单单品表';

-- ----------------------------
-- Records of t_order_details
-- ----------------------------
-- ----------------------------
-- Table structure for t_order_join
-- ----------------------------
DROP TABLE IF EXISTS `t_order_join`;
CREATE TABLE `t_order_join` (
  `join_order_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增1',
  `join_order_number` varchar(255) DEFAULT NULL COMMENT '合并订单号',
  `order_ids` varchar(255) DEFAULT NULL COMMENT '订单id',
  `order_numbers` text COMMENT '订单号',
  `total_price` int(11) DEFAULT NULL COMMENT '订单总金额(以分为单位)',
  PRIMARY KEY (`join_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for t_payment_method
-- ----------------------------
DROP TABLE IF EXISTS `t_payment_method`;
CREATE TABLE `t_payment_method` (
  `payment_id` int(11) NOT NULL COMMENT '支付方式id，手动维护',
  `name` varchar(255) DEFAULT NULL COMMENT '支付方式名称',
  `description` varchar(255) DEFAULT NULL,
  `isGeneral` tinyint(4) NOT NULL COMMENT '是否通用 1 是 0 否',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `state` tinyint(4) DEFAULT '2' COMMENT '1 已删除 2 未删除',
  PRIMARY KEY (`payment_id`,`isGeneral`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_payment_method
-- ----------------------------
INSERT INTO `t_payment_method` VALUES ('1', '货到付款', '货到付款', '0', '2017-03-23 16:49:23', '2017-03-23 16:49:23', '2');
INSERT INTO `t_payment_method` VALUES ('2', '在线支付', '在线支付', '1', '2017-03-23 16:50:20', '2017-03-23 16:50:20', '2');
INSERT INTO `t_payment_method` VALUES ('3', '累计结算', '累计结算', '0', '2017-03-23 16:50:27', '2017-03-23 16:50:27', '2');

-- ----------------------------
-- Table structure for t_privilege
-- ----------------------------
DROP TABLE IF EXISTS `t_privilege`;
CREATE TABLE `t_privilege` (
  `privilege_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '优惠id，主键，自增',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `is_wholeSalePrice` tinyint(4) DEFAULT '0' COMMENT '享受批发价标志 1 享受批发价 0 不享受批发价',
  `isDiscount` tinyint(4) DEFAULT NULL COMMENT '是否享受折扣 1 是 0 否',
  `discount` int(11) DEFAULT NULL COMMENT '商品折扣 使用整数表示折扣数，比如98，表示98折',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `state` tinyint(4) DEFAULT '2' COMMENT '状态 1 已删除 2 未删除',
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`privilege_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='优惠信息';

-- ----------------------------
-- Records of t_privilege
-- ----------------------------


-- ----------------------------
-- Table structure for t_role_module
-- ----------------------------
DROP TABLE IF EXISTS `t_role_module`;
CREATE TABLE `t_role_module` (
  `role_module_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增1',
  `role_id` int(11) DEFAULT NULL COMMENT 'role_id',
  `module_id` int(11) DEFAULT NULL COMMENT '系统模块id',
  PRIMARY KEY (`role_module_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_role_module
-- ----------------------------
INSERT INTO `t_role_module` VALUES ('1', '4', '6');
INSERT INTO `t_role_module` VALUES ('2', '4', '9');
INSERT INTO `t_role_module` VALUES ('3', '4', '12');
INSERT INTO `t_role_module` VALUES ('4', '4', '13');
INSERT INTO `t_role_module` VALUES ('5', '4', '14');
INSERT INTO `t_role_module` VALUES ('6', '4', '15');
INSERT INTO `t_role_module` VALUES ('7', '4', '5');
INSERT INTO `t_role_module` VALUES ('8', '4', '10');
INSERT INTO `t_role_module` VALUES ('9', '4', '11');
INSERT INTO `t_role_module` VALUES ('10', '4', '16');
INSERT INTO `t_role_module` VALUES ('11', '4', '17');
INSERT INTO `t_role_module` VALUES ('13', '4', '1');
INSERT INTO `t_role_module` VALUES ('14', '4', '2');
INSERT INTO `t_role_module` VALUES ('15', '4', '3');
INSERT INTO `t_role_module` VALUES ('16', '4', '4');
INSERT INTO `t_role_module` VALUES ('17', '4', '7');
INSERT INTO `t_role_module` VALUES ('18', '4', '8');

-- ----------------------------
-- Table structure for t_serial_number
-- ----------------------------
DROP TABLE IF EXISTS `t_serial_number`;
CREATE TABLE `t_serial_number` (
  `serial_number_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` varchar(25) NOT NULL COMMENT '最新日期',
  `num` varchar(11) NOT NULL COMMENT '当前最大流水号',
  PRIMARY KEY (`serial_number_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='流水号生成表';

-- ----------------------------
-- Records of t_serial_number
-- ----------------------------
INSERT INTO `t_serial_number` VALUES ('3', '2017-04-23', '1');

-- ----------------------------
-- Table structure for t_short_message
-- ----------------------------
DROP TABLE IF EXISTS `t_short_message`;
CREATE TABLE `t_short_message` (
  `message_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) DEFAULT '' COMMENT '手机号',
  `code` int(255) DEFAULT '0' COMMENT '验证码',
  `update_time` datetime DEFAULT NULL COMMENT '最后更新时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `state` tinyint(4) DEFAULT '1' COMMENT '短信验证码是否可用  1 可用 2 不可用',
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8 COMMENT='短信验证码';

-- ----------------------------
-- Records of t_short_message
-- ----------------------------


-- ----------------------------
-- Table structure for t_store_goods
-- ----------------------------
DROP TABLE IF EXISTS `t_store_goods`;
CREATE TABLE `t_store_goods` (
  `store_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '收藏id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `goods_id` int(11) DEFAULT NULL COMMENT '商品id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `state` tinyint(4) DEFAULT '2' COMMENT '状态 1 已删除 2 未删除',
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8 COMMENT='用户收藏商品表';

-- ----------------------------
-- Records of t_store_goods
-- ----------------------------
-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `openid` varchar(255) DEFAULT '' COMMENT '微信和公众号之间的openid',
  `nickname` varchar(255) DEFAULT '' COMMENT '微信名',
  `headimgurl` varchar(255) DEFAULT '' COMMENT '微信头像',
  `sex` varchar(255) DEFAULT '' COMMENT '性别',
  `phone` varchar(255) DEFAULT '' COMMENT '手机',
  `province` varchar(255) DEFAULT '' COMMENT '注册地址：省',
  `city` varchar(255) DEFAULT '' COMMENT '注册地址：城市',
  `country` varchar(255) DEFAULT '' COMMENT '注册地址：县/区',
  `create_time` datetime DEFAULT NULL COMMENT '用户录入时间',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `state` tinyint(4) DEFAULT '1' COMMENT '状态 1 已启用 0 未启用',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of t_user
-- ----------------------------

-- ----------------------------
-- Table structure for t_user_message
-- ----------------------------
DROP TABLE IF EXISTS `t_user_message`;
CREATE TABLE `t_user_message` (
  `user_message_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增1',
  `message_id` int(11) DEFAULT NULL COMMENT '消息id',
  `user_id` int(11) DEFAULT NULL,
  `state` tinyint(4) DEFAULT '2' COMMENT '状态 1 已读 2 未读',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除状态 1 已删除 2 未删除',
  PRIMARY KEY (`user_message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8 COMMENT='用户站内消息表';

-- ----------------------------
-- Records of t_user_message
-- ----------------------------

-- ----------------------------
-- Table structure for t_user_payment
-- ----------------------------
DROP TABLE IF EXISTS `t_user_payment`;
CREATE TABLE `t_user_payment` (
  `user_payment_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键，自增1',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `payment_id` int(11) DEFAULT NULL COMMENT '支付方式id',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `admin_id` int(11) DEFAULT NULL COMMENT '管理员id',
  PRIMARY KEY (`user_payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user_payment
-- ----------------------------

-- ----------------------------
-- Table structure for t_user_receive
-- ----------------------------
DROP TABLE IF EXISTS `t_user_receive`;
CREATE TABLE `t_user_receive` (
  `receive_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '收货id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `contact` varchar(255) DEFAULT '' COMMENT '收货人姓名',
  `tel` varchar(255) DEFAULT '' COMMENT '收货人电话',
  `receive_province` varchar(255) DEFAULT '' COMMENT '收货地址：省',
  `receive_city` varchar(255) DEFAULT '' COMMENT '收货地址：城市',
  `receive_county` varchar(255) DEFAULT '' COMMENT '收货地址：县/区',
  `receive_address` varchar(255) DEFAULT '' COMMENT '收货地址 详细地址',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '最后更新时间',
  `isDefault` tinyint(4) DEFAULT '0' COMMENT '默认收货地址标志 0 否 1 是',
  `del_state` tinyint(4) DEFAULT '2' COMMENT '删除状态 1 已删除 2 未删除',
  PRIMARY KEY (`receive_id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8 COMMENT='送货表';

-- ----------------------------
-- Records of t_user_receive
-- ----------------------------
