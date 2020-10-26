## 更新日志

**2020-5-8**：

1. 菜单项的点击方法由`onSubmit`改为`onClick`；（其实并没啥意义，就是顾名思义而已）
2. 新增：菜单项无`url`和无符合`navigator`、`button`的`open-type`时，视为点击按钮，组件內定义了一个`press`方法（line 227），页面调用组件时可使用 `<component-name @press="methodName">`；
3. 新增：组件prop `height`，设置菜单项宽度；
4. 新增：菜单项跳转、button的open-type、webview跳转等方式
5. 优化：菜单项`title`支持html；
6. 新增：菜单项设置图标颜色`iconColor`、标题颜色`titleColor`;
7. 有朋友说无法成功调用，现在在说明文档补充调用演示，如果不成功，请下载demo查看，或评论区反馈。
8. 删除：属性`baseIconFont`，当单项中当`icon`属性设置为字体图标class全称且设置`iconfont:true`时，使用字体图标作为单项图标。

## 简介

宫格菜单导航，实现：

1. n行n列
2. 带指示条横行滚动
3. 图标自定义尺寸
4. 文本颜色设置
5. 灵活设置数据的key
6. 可做点击按钮，可做跳转导航
7. 菜单项可使用`navigator`和`button`的`open-type`

## 适用端

**适用于`js`项目**

|端|支持|
|---|---|
|Web|√|
|微信小程序|√|
|iOS|√|

## 依赖

因涉及到计算，依赖于`numeral.js`，直接安装：

```bash
npm i -S numeral
```

## rpx和px的比例

这是一个保证准确的前置条件（其实APP平台是否准确没怎么测），按照小程序文档的指示：

|设备|rpx换算px (屏幕宽度/750)|px换算rpx (750/屏幕宽度)|
|---|---|---|
|iPhone5|1rpx = 0.42px|1px = 2.34rpx|
|iPhone6|1rpx = 0.5px|1px = 2rpx|
|iPhone6 Plus|1rpx = 0.552px|1px = 1.81rpx|

已更新像素比例设置位置，查看顶部到[更新日志](##更新日)。

**注意**：如果不设置，默认会直接取iphone,也就是0.5

## 属性

|属性|类型|必填|默认|可选|说明|
|:---:|:---:|:---:|:---:|---|---|
|element-id|String|√|navigatorMenu|-|菜单的id，用于设置内部元素当绝对宽高，建议一个页面多个菜单时必填且唯一|
|list|Array|√|[]|-|菜单列表|
|name-field-name|String|-|title|-|显示菜单名称的key，设置时按此默认值即可，一般不需要调用时设置|
|icon-field-name|String|-|icon|-|图标的key，对应自己的字体图标库，设置时按此默认值即可，一般不需要调用时设置|
|open-type-field-name|String|-|openType|-|单项openType的字段名，设置时按此默认值即可，一般不需要调用时设置|
|url-field-name|String|-|url|-|跳转链接的key，设置时按此默认值即可，一般不需要调用时设置|
|text-color|String|-|#666|-|文本颜色|
|icon-color|String|-|#666|-|字体图标的颜色|
|row-count|String\|Number|-|2|-|总行数，如果list长度达不到`rowCount` * `col-count`，则不会出现滚动条|
|col-count|String\|Number|-|4|-|总列数|
|height|String\|Number|-|-|-|单项菜单的高度，设置后所有菜单项会统一一个高度，带不带单位都直接按小程序都rpx设置，建议number|
|size|String|-|60rpx|-|图标宽高，如果是字体图标，设置为其`font-size`，如果带单位，则使用了带单位的值，否则根据小程序的比例设置|
|click-feedback|Boolean|-|true|-|点击反，点击时会有灰色背景指示|
|show-scroll-bar|Boolean|-|true|-|当出现横向滚动时，是否显示指示条，隐藏后还是可以滚动的|
|webview|String|-|''|-|如果菜单项需要跳转外部链接，需要设置webview的页面路由，HTML5可以直接`window.location.href`，所以不需要设置|

## 方法

### press

> 当符合条件时，此事件生效，event上会携带该菜单项的所有字段，可在调用页面做一些点击菜单后当操作。

**event**： 携带菜单项所有字段

**使用条件**：

必要条件：**没有url**

必含一项：

1. 菜单项没有`openType`；
2. 菜单项有`openType`但不符合`navigator`和`button`的`open-ype`选项。


## 调用

```html
<!-- 页面调用 -->
<ju-navigator-grid element-id="navigatorMenu" :list="menu" @press="onPress" height="180" size="90"/>
```

```js
...
// 数据
data(){
    return {
        menu1:[
            {title: "带app内url", url: '/pages/field/index', icon: "/static/images/100x100.jpg"},
            {title: "带外部url", url: 'https://baidu.com'},
            {title: "普通按钮", type: 'custom'},
            {title: "open-type=share", openType: 'share', icon: ''},
            {title: "社区团购", icon: "/static/images/200x200-1.jpg"},
            {title: "pt=redirect", openType: 'redirectTo', url: '/pages/field/index'},
            {title: "秒杀", icon: ''},
            {title: "9.9包邮", icon: "/static/images/200x200-2.png"},
            {title: "零点秒杀", icon: ''},
            {title: "聚划算", icon: ''}
	]
    }
},
methods:{
    // 对应没有openType和url时的点击事件
    onPress(e){
        console.log(e)
    }
}
...
```

## list > item 可选属性

```js
...
menu:[
    {
        title:'',           // 单项的标题，支持html，可设置简单的样式，注意宽高
        url:'',             //菜单项跳转，适合外部链接、app内链接
        icon:'',            //单项的图标，接受图片、字体图标
        iconfont:true,      //icon设置为字体图标时，需要标示为true
        openType:'',        //作为navigator时，对应<navigator>的open-type；作为button时，对应<button>的open-type；作为普通链接时，响应 @press 事件
        titleColor:'#555',  //单独设置标题颜色，覆盖组件属性 textColor
        iconColor:'#666',   //单独设置字体图标颜色，icon为图片则无效，覆盖组件属性 iconColor
    }
]
...
```

## 结尾

之前需要这方面的导航，就制作了一个小组件，当前可能还存在不少问题，写的不是很好，请多包涵，如有优化方案，欢迎指教，跪谢。

**fixme**：目前已知底部的指示滚动条在web端没有小程序端流畅。

