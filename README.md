# yifang-read-frond-end
使用uniapp打造的阅读软件，实现：读书记录、目录等

先实现完整的功能
后续要实现：
1、view loading效果 每个组件都加上loading效果，在数据加载完成后解除
2、点击搜索跳转专用搜索页（现搜索是个摆设）。类似淘宝
3、书籍详情页，书籍详情组件背景需要虚化的图片作为背景

时间：2020-10-26 11:49
完成顶部搜索框、轮播图、菜单等
还未开始封装网络请求
![](http://cdn.fologde.com/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20201026114759.png)

首页第一版就长这样了
![](http://cdn.fologde.com/2020-10-26%5B12-53-17%5D1603687997.png)

2020-10-27 11：15
加了菜单
![](http://cdn.fologde.com/2020-10-27%5B11-15-39%5D1603768539.png)

2020-10-27 12:34
停一段时间 学学产品

2020年10月27日14:03:17
http://www.imooc.com/learn/926  免费课程:ui动效入门知识储备

2020年11月3日15:47:19
axios 在uniapp使用中  有这有那的问题 太臃肿了
放弃了  还是用uniapp原生的写法
换成 [](https://www.quanzhan.co/luch-request/guide/3.x/#example)

2020年11月3日19:30:32
换好了  轮播、菜单、推荐阅读列表在h5、小程序、app正常使用

2020年11月3日20:01:05
菜单又出问题了 这些第三方开发者写的东西 一言难尽
还是自己用swiper做一个算了

2020年11月3日20:39:11
自制菜单  还不赖
![](http://cdn.fologde.com/yifangread/2020-11-03%5B20-38-32%5D1604407112.png)

2020年11月3日20:48:47
暂时确认主色调为 #FF5501  黄黄色

2020年11月4日17:54:22
功夫还是得靠练，看、想都是空谈，只有实际用上了，才能有突破和创新
代码写多了，就会有创新和不一样的想法，一样的代码不会每次都是
把你的想法付诸实践，通过代码的形式表现出来，会有一种成就感油然而生，这或许就是程序员的快乐



2020年11月4日18:35:46
饭后  大概花了一下阅读器核心部分分层架构：
![](http://cdn.fologde.com/yifangread/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201104183442.jpg)
仔细一看  看可以，就照这个想法来做
需要够简单  之前看了有几个阅读器，写的洋洋洒洒好多行代码，云里雾里的
用很少的一部分代码完成功能

2020年11月4日18:43:23
初始的四层分层结构
<tem plate>
	<view>
		<!-- 阅读器分四层 每层分别是： -->
		<!-- 用以承载书籍章节内容 第一层 -->
		<div class="read-layer"></div>
		
		<!-- 用来控制上一页、下一页、调出菜单的层  为第二层-->
		<div class="controller-layer"></div>
	
		<!-- 全屏层  用来弹出菜单后关闭菜单层的作用  为第三层 -->
		<div class="close-controller-layer"></div>
		
		<!-- 菜单层  返回、章节、设置都在这一层  为第四层 -->
		<div class="menu-layer"></div>
	
	</view>
</template>

每一层都是全屏
第一层的内容先不急  先把基本的功能实现，如点击中间部分弹出菜单、弹出菜单后，点击中间任意内容能
关闭菜单

四层架构能让很多东西解耦
每层负责不一样的任务，协调完成复杂的功能


2020年11月4日20:15:42
发现 不必用四层，三层就够了  去掉了第三层，原本你的第四层可以实现第三层的功能（已经实现了）


2020年11月4日20:29:26
考虑到一本书需要占用户很多内存空间  故内容不存用户手机空间
而是实时从服务器获取的形式
一本500页码的书 大概70万字左右  如果全部加载到用户手机  需要2M？ 这么点？
70万字=700000*3 = 2100000字节 = 2100000 / 1024 = 2050kb = 2050/1024 = 2mb


2020年11月5日10:07:43
书籍章节的内容存储问题还有待商议
花80%的时间思考、20%的时间做开发
我比较喜欢这段为了折腾自己的作品而思考的时间

2020年11月5日11:28:10
书籍详情页
![](http://cdn.fologde.com/yifangread/2020-11-05%5B11-28-29%5D1604546909.png)


2020年11月5日11:48:40
发现还是要第四层来承载 章节、设置等内容的一层


2020年11月8日18:14:30
微信小程序最初的可读版本 可选择章节  H5、APP一样的体验
![](http://cdn.fologde.com/20201108_180847%2000_00_00-00_00_30.gif)


2020年11月9日12:48:23
APP 预览版 [一方阅读 v1.0 体验版本下载](http://cdn.fologde.com//yifangread/__UNI__CF0EF73_1109142529.apk)

2020年11月9日14:23:48
弹出章节选择界面时  点击旁边空白区域可关闭章节选择

2020年11月9日20:10:15
开始处理设置功能

2020年11月14日20:34:42：
可本地使用设置字体大小、预设背景颜色

2020年11月14日23:31:35
下一章、上一章、进度显示、优化字体大小设置

2020年11月14日23:40:15
[一方阅读 v1.0.1 体验版下载](http://cdn.fologde.com/__UNI__CF0EF73_1114233705.apk)

***
2020年11月18日11:05:12   
我的个人中心手绘原型图
[我的个人中心设计稿](https://p-wund.tower.im/p/9ln6)   
先暂时按设计图来做出基础的页面  后续如果想到其他想法，再实现   
很多功能都要建立在会员的基础上、保存阅读的进度   
还是说先建立本地的设置保存
***
2020年11月18日16:55:03   
根据手绘原型图完成了个人中心大概页面   
![](http://cdn.fologde.com//yifangread/2020-11-18%5B16-54-13%5D1605689653.png)
   
![](http://cdn.fologde.com//yifangread/2020-11-18%5B16-59-05%5D1605689945.png)
   
未登录：   
![](http://cdn.fologde.com//yifangread/2020-11-18%5B17-13-45%5D1605690825.png)
   
已登录   
![](http://cdn.fologde.com//yifangread/2020-11-18%5B17-14-00%5D1605690840.png)
***
2020年11月18日18:03:44   
开始登录、注册页面开发   
注册页面暂时这样   
![](http://cdn.fologde.com//yifangread/2020-11-18%5B20-50-59%5D1605703859.png)
***
要不要使用前端框架？
    后续新建的页面使用框架开发
    [uniapp uview前端框架](https://www.uviewui.com/guide/demo.html)

   
2021年1月2日16:43:34   
最新开发进度   
小程序   
![](http://cdn.fologde.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210102164420.jpg)   
H5   
![](http://cdn.fologde.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210102164414.jpg)   
APP   
![](http://cdn.fologde.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210102164425.jpg)
最新版APP体验地址 [一方阅读 v1.0.1 体验版下载](http://cdn.fologde.com/__UNI__CF0EF73_20210102164708.apk)


2021年1月2日18:47:20   
截止当下，完成的功能：   
1、加入|取消书架   
2、保存阅读的进度   
3、修复一些bug   

后续要实现的功能：   
1、字体大小、背景等的设置云保存   
2、各种设置本地化缓存（这个需要在基本的功能全部完成后再开始开发）   
3、优化，API接口缓存等   
4、广场功能   

2021年1月3日12:39:36   
完成字体大小、背景颜色设置云存储   

   
2021年1月10日15:48:27   
完成   
1. 完成字间距、行间距、两边空白间距设置以及保存
2. 丝滑滚动
3. 自动切换下一章
4. 其他一些优化   
截止当前的体验版本：[一方阅读 v1.0.0 体验版下载](http://cdn.fologde.com/__UNI__CF0EF73_20210110154659.apk)   

2021年1月10日17:02:12   
完成：
1. APP端全屏模式阅读
2. APP端显示时间和电量  
截止当前的体验版本：[一方阅读 v1.0.0 体验版下载](http://cdn.fologde.com/__UNI__CF0EF73_20210110170040.apk)  


2021年1月10日17:39:40   
完成   
1. 充电中提示
截止当前的体验版本：[一方阅读 v1.0.0 体验版下载](http://cdn.fologde.com/__UNI__CF0EF73_0110173628.apk)  


2021年1月21日13:22:52   
完成：
1. 设置本地化存储

下次修改内容：
1. 阅读进度本地化存储   

备注：
1. 因为谷歌的云服务器抽风，用不了了，故使用本地服务器进行开发工作。所以之前的APP版本可能也用不了（因为之前的应用使用的是谷歌服务器）  暂时无法体验了


2021年1月22日12:37:35   
完成：
1. 本地进度储存

2021年2月10日09:30:10   
就一个我本以为简简单单的进度保存的问题，我居然折腾了将近一个多月，可算是搞定了这个大问题，可以愉快的开发后续功能了   

   
2021年2月10日14:04:15   
博采众长的书籍详情页
![](http://cdn.fologde.com/2021-02-10%5B14-05-08%5D1612937108.png)

   
2021年2月10日21:46:56   
修改头像目前是只能选择已有的头像，不能上传自己的图片
![](http://cdn.fologde.com/2021-02-10%5B21-42-25%5D1612964545.png)
因为图片的存储是个问题，等这个问题有了解决方案，再介入上传图片作为头像也不为迟晚   
目前为止只完成前端部分，后端需要接收参数并修改用户信息，前端还需要更新一下本地的用户信息

   
2021年2月12日10:27:42  
使用了uview框架，日历组件效果三端一致
![](http://cdn.fologde.com/2021-02-12%5B10-25-09%5D1613096709.png)   


2021年3月11日12:59:15   
修改了阅读页设置的样式   
![](http://cdn.fologde.com/2021-03-11%5B12-58-07%5D1615438687.png)   
以及阅读历史页一些更改  加入了骨架屏的动画   
![](http://cdn.fologde.com/2021-03-11%5B13-00-24%5D1615438824.png)

   
2021年3月18日13:14:34   
第一版今天完成，开始提交小程序审核！

***
使用
npm i