# 前言
重学了新版Echarts，一个基于JavaScript的开源可视化图表库，收集参考了很多网上资料，最终选择电商平台作为练手项目。此篇涉及技术知识点有：Vue全家桶、WebSocket前后端数据推送、后端框架Koa2、Echarts新版图表组件（折线图、柱状图、饼图、地图、散点图），还支持主题切换, 展示酷炫的图表效果，同时也能够支持大屏和小屏的切换，保证了图表在不同屏幕上呈现的效果。本项目涵盖功能比较齐全，适合进阶数据可视化大屏前端开发的小伙伴。如果觉得不错的话，请大大们给个:heart:star，也欢迎大家一起交流学习。

[在线DEMO演示](http://106.55.168.13:8999/)


# 目录结构
```
│  package.json                      // npm包管理所需模块及配置信息
│  vue.config.js                     // webpack配置
├─public
│      favicon.ico                   // 图标
│      index.html                    // 入口html文件
│      static                        // 静态资源文件夹
└─src
    │  App.vue                       // 根组件
    │  main.js                       // 程序入口文件
    ├─assets                         // 存放公共样式、字体、图片文件夹
    ├─components
    │      Hot.vue                   // 热销商品组件
    │      Map.vue                   // 商家分布组件
    │      Rank.vue                  // 销量排行组件
    │      Seller.vue                // 商家销售组件
    │      Stock.vue                 // 库存销量组件
    │      Trend.vue                 // 销量趋势组件
    ├─router
    │      index.js                  // 单页面路由注册组件 
    ├─store
    │  	   index.js                  // 状态管理仓库入口文件
    ├─utils
    │      map_utils.js              // 地图省份中英转换工具方法
    │      socket_service.js         // 定义全局socket类实例化单例模式 
    │      theme_utils.js            // 主题工具方法 
    └─views
            hotPage.vue              // 热销商品界面
            mapPage.vue              // 商家分布界面
            rankPage.vue             // 销量排行界面
            screenPage.vue           // 组件合并界面
            sellerPage.vue           // 商家销售界面
            stockPage.vue            // 库存销量界面
            trendPage.vue            // 销量趋势界面
```


# 技术栈
 * vue-cli 4.x
 * echarts 5
 * axios
 * webpack
 * less
 * WebSocket
 
# 功能模块
* 折线图
* 饼图
* 柱状图
* 实时数据
* 地图和散点图
* 主题切换
* 全屏显示
* 联动效果

# 在线教程

[整理汇总一系列数据可视化大屏项目资源从入门、实战、进阶到全栈](https://juejin.cn/post/6960125126008389669)


# 下载安装依赖
```
git clone https://github.com/jackchen0120/EC-Platform-Monitor.git
cd EC-Platform-Monitor
npm install 或 yarn
```

## 开发模式
```
npm run serve
```
运行之后，访问地址：http://localhost:8999

## 生产环境打包
```
npm run build
```

## 获取更多实操经验及项目源码

欢迎关注个人公众号：**懒人码农**，后台回复“大屏”即可获取更多资源及思维导图

<img src="https://img-blog.csdnimg.cn/20200531011333650.png#pic_center?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE1MDQxOTMx,size_16,color_FFFFFF,t_70" width="200" alt="公众号二维码" />
