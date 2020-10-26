<template>
    <view id="navigatorMenu" class="navigator-menu" v-if="list&&list.length">
        <scroll-view scroll-x class="scroll-view" :style="{width: wrapWidth}" @scroll="scrolling" scroll-with-animation>
            <view class="scroll-container" :class="{'is-fix':!fix}" :style="{height: wrapHeight}">
                <!--导航-->
                <view class="menu-container " :id="'navigatorMenu-item-'+index" v-for="(item,index) in list" :key="index" :style="{width:itemWidth}">
                    <template v-if="show">
                        <button class="menu-item" :open-type="item[openTypeFieldName]" @click="onClick" :class="{'click-feedback':clickFeedback}" :data-item="stringifyItem(item)" :style="{height:itemHeight}">
                            <!--图标-->
                            <view>
                                <view class="menu-icon" :class="{'menu-icon-placeholder':!item[iconFieldName]}" :style="{height: iconSize,width: iconSize}">
                                    <template v-if="!item.iconfont">
                                        <view class="menu-icon-container">
                                            <view class="menu-icon-body">
                                                <image lazy-load mode="aspectFit" :src="item[iconFieldName]" v-if="item[iconFieldName]"></image>
                                            </view>
                                        </view>
                                    </template>
                                    <template v-else>
                                        <i :class="item[iconFieldName]" v-if="item[iconFieldName]" :style="{'font-size':iconSize,color:item.iconColor||iconColor}"></i>
                                    </template>
                                </view>
                            </view>
                            <!--文本-->
                            <view class="menu-title" v-if="item[nameFieldName]&&!$slots.title" :style="{color:item.titleColor||textColor}" v-html="item[nameFieldName]"></view>
                        </button>
                    </template>
                </view>
            </view>
        </scroll-view>
        <!--滚动条-->
        <view v-if="isScroll&&showScrollBar" class=" scroll-bar-wrap">
            <view class="scroll-groove ">
                <view class="scroll-bar " :style="{transform: 'translateX('+barScrollLeft+')'}"></view>
            </view>
        </view>
    </view>
</template>
<script>
    import numeral from 'numeral'

    export default {
        props: {
            // 列表，必填
            list: {
                type: Array,
                required: true,
                default: []
            },
            //名称key
            nameFieldName: {
                type: String,
                default: 'title'
            },
            //图标的key
            iconFieldName: {
                type: String,
                default: 'icon'
            },
            // 跳转链接的key，可选
            urlFieldName: {
                type: String,
                default: 'url'
            },
            //开放能力
            openTypeFieldName: {
                type: String,
                default: 'openType'
            },
            // 文本颜色
            textColor: {
                type: String,
                default: '#666'
            },
            // 图标颜色
            iconColor: {
                type: String,
                default: '#666'
            },
            // 行数
            rowCount: {
                type: Number | String,
                default: 2
            },
            // 列数
            colCount: {
                type: Number | String,
                default: 4
            },
            // 图标宽高
            size: {
                type: String,
                default: '60rpx'
            },
            // 每一个菜单的高度，不设置则为内容高度，所有菜单高度统一
            height: {
                type: String,
                default: ''
            },
            // 点击反馈
            clickFeedback: {
                type: Boolean,
                default: true
            },
            //当出现横向滚动时，是否显示指示条
            showScrollBar: {
                type: Boolean,
                default: true
            },
            //项目内，承载一个webview用于外部链接展示的页面路径，如果菜单项是跳转外部链接，h5直接location.href，app和小程序跳转webview
            webview: String
        },
        data() {
            return {
                wrapWidth: null,
                itemWidth: null,
                itemHeight: '',
                barScrollLeft: null,
                show: false,
                containerHeight: '',
                isScroll: false,
                rpxToPxFactor: 0
            }
        },
        computed: {
            iconSize: function () {
                return /(px|rpx|em|pt)/.test(this.size) ? this.size : numeral(this.size.replace(/(px|rpx|em|pt)/g, '')).multiply(this.rpxToPxFactor).value() + 'px'
            },
            fix: function () {
                return this.list.length <= this.rowCount * this.colCount
            },
            wrapHeight: function () {
                return this.fix ? 'auto' : (this.containerHeight || 0)
            }
        },
        mounted() {
            this.getSystemInfo()
            setTimeout(() => {
                this.init()
            }, 10)
        },
        methods: {
            //格式化为字符串
            stringifyItem(item) {
                return JSON.stringify(item)
            },
            /**
             * 将全局的像素比例设置，调整到组件内部
             * */
            getSystemInfo() {
                const that = this
                uni.getSystemInfo({
                    success: function (e) {
                        // 根据安全屏幕宽度，设置rpx和px的比例，比例尺参考微信小程序 1rpx=n px
                        that.rpxToPxFactor = e.safeArea.width < 375 ? 0.42 : (e.safeArea.width > 375 ? .552 : .5)
                    }
                })
            },
            /*
            * 初始化
            * */
            init() {
                const that = this
                if (!that.list || !that.list.length) return

                let query = uni.createSelectorQuery().in(that)
                let node = query.select(`#navigatorMenu-item-0`).boundingClientRect()

                node = query.select('#navigatorMenu').boundingClientRect()
                node.exec(result => {
                    let [ container, wrap ] = result
                    // 取余，如果list长度大于行x列，且有余数，滚动的宽度为单行数量+1，否则，就等于单行数量
                    let more_col = that.list.length > (that.rowCount * that.colCount) && that.list.length % (that.rowCount * that.colCount) === 0
                    //单个宽度
                    let itemWidth = `${numeral(wrap.width).divide(that.colCount).value()}px`
                    that.itemWidth = itemWidth
                    //外部宽度
                    let wrapWidth = `${more_col ? itemWidth * (that.colCount + 1) : wrap.width}px`
                    that.wrapWidth = wrapWidth
                    let has_set_height = that.height ? numeral(that.height.replace(/(rpx|px|em|pt)/g, '')).multiply(that.rpxToPxFactor).value() : 0
                    // 单个高度
                    let itemHeight = has_set_height || numeral(that.size.substr(0, that.size.indexOf('rpx'))).multiply(that.rpxToPxFactor).add(40).value()
                    that.itemHeight = itemHeight + 'px'
                    // 单个高度外框
                    let containerHeight = `${numeral(container.height || itemHeight).multiply(that.rowCount).value()}px`
                    let isScroll = that.list.length > (that.rowCount * that.colCount)
                    that.containerHeight = containerHeight
                    that.isScroll = isScroll
                    that.show = true
                    wrapWidth = null
                    itemWidth = null
                    containerHeight = null
                })
            },
            /**
             * 滚动事件
             * @param e
             */
            scrolling(e) {
                const that = this
                //如果没有开启指示条，不执行滚动监听
                if (!that.showScrollBar) {
                    return
                }
                let {scrollLeft, scrollWidth} = e.detail
                // 可滚动区域
                let canScrollWidth = numeral(scrollWidth).subtract(that.wrapWidth.substring(0, that.wrapWidth.length - 2)).value()
                let scale = numeral(scrollLeft).divide(canScrollWidth).value()
                // 可滚动区域
                let grooveW = 40
                // 计算滚动条可滚动区域
                that.barScrollLeft = `${numeral(scale).multiply(grooveW).value()}px`
            },
            /**
             * 菜单触发的事件
             * @param e
             */
            onClick(e) {
                const that = this
                if (!Object.keys(e.currentTarget.dataset)) {
                    return false
                }
                let item = JSON.parse(e.currentTarget.dataset.item)
                let url = item[ that.urlFieldName ]
                let opentype = item.openType

                let navigate_ot = [ 'navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack' ]
                let button_ot = [ 'feedback', 'share', 'getUserInfo', 'contact', 'getPhoneNumber', 'launchApp', 'openSetting', 'getAuthorize', 'contactShare', 'lifestyle', 'openGroupProfile' ]
                //根据open-type判断点击的这项是链接还是按钮，如果是按钮，且符合open-type列表，则不提供点击事件
                //如果是普通url链接
                let is_navigate = (!opentype && url) || (navigate_ot.indexOf(opentype) > -1 && url)
                //如果是带open-type
                let is_button_open = opentype && button_ot.indexOf(opentype) > -1
                //如果是普通按钮
                let is_click = !url && (!opentype || (navigate_ot.indexOf(opentype) < 0 && button_ot.indexOf(opentype) < 0))

                //普通链接，提供单击事件
                if (is_click) {
                    that.$emit('press', item)
                    return
                }
                //如果是链接
                if (is_navigate) {
                    //如果存在http，则为外链
                    let url_type = url.substr(0, 4) === 'http' ? 'webview' : 'app'

                    if (url_type === 'webview') {
                        // #ifdef H5
                        window.location.href = url
                        //#endif
                        //#ifndef H5
                        if (!this.webview) {
                            uni.showModal({
                                title: '提示',
                                content: '当前url是一个外部链接，需要定义一个承载webview的页面，目前并没有提供。'
                            })
                        } else {
                            uni[ opentype || 'navigateTo' ]({
                                url: ` ${this.webview}?url=${url}`
                            })
                        }
                        //    #endif
                    } else {
                        uni[ opentype || 'navigateTo' ]({
                            url
                        })
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @function units($val) {
        @return $val*2rpx;
    }

    view, button, scroll-view, text {
        box-sizing: border-box;
        line-height: 1;
    }

    .scroll-container {
        white-space: nowrap;
        display: flex;
        flex-wrap: wrap;

        &.is-fix {
            flex-direction: column;
        }
    }

    .menu-container {
        position: relative;

        .menu-item {
            background-color: transparent;
            width: 100%;
            height: 100%;
            padding: units(10);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;

            &::after {
                display: none;
            }

            &.click-feedback {
                &:active {
                    background-color: #f1f4f7 !important;
                    opacity: .7;
                }
            }
        }
    }

    .scroll-groove {
        width: 54px;
        height: 6px;
        padding: 2px;
        border-radius: 100vw;
        background-color: #f1f4f7;
        overflow: hidden;

        .scroll-bar {
            width: 10px;
            height: 2px;
            border-radius: 100vw;
            background-color: #017be7;
        }
    }

    .scroll-view {
        width: 100%;
    }

    .menu-icon {
        position: relative;
        overflow: hidden;

        &-container {
            height: 0;
            padding-bottom: 100%;
        }

        &-body {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            image, img {
                width: 100%;
                height: 100%;
            }
        }

        &-placeholder {
            background-color: #eee;
            color: #f1f4f7;
            font-size: 30%;
        }
    }

    // 菜单标题
    .menu-title {
        font-size: units(12);
        margin-top: units(5);
    }

    .scroll-bar-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: units(5);
    }
</style>
