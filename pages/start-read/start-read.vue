<template>
	<view class="body" ref="startReadBody">
		<!-- 阅读器分三层 每层分别是： -->
		<!-- 用以承载书籍章节内容 仅做展示 第一层 -->
		<div class="read-layer layer"  @click="globalClick"
		:style="{'background-color': background_color,
			'padding-left': settings.padding_left_right + 'rpx',
			'padding-right': settings.padding_left_right + 'rpx',
		}"
		>
			<scroll-view scroll-y="true" @scroll="readScroll" 
			class="scroll-Y" show-scrollbar="true"
			:scroll-top="scroll_top"
			@scrolltolower="onScrolltolower">
				<div class='chapter-content' v-if="chapter_content"
				:style="{'font-size': font_size + 'px', 
				color: font_color, 
				'letter-spacing': settings.letter_spacing + 'rpx',
				'line-height': settings.line_height + 'rpx'}">
					<rich-text :nodes="chapter_content"></rich-text>
				</div>
			</scroll-view>
		</div>
		
		<!-- 用来控制上一页、下一页、调出菜单的层  为第二层-->
		<div class="controller-layer layer" v-if="layer_2">
			<!-- 上一页 -->
			<div class="prev-page page-controller"
			@click="prevPage"></div>
			<!-- 弹出菜单 -->
			<div class="prop-menu page-controller" 
			:style="{'margin-left': propArea.propMenuLeft + 'px', 
			'margin-top': propArea.propMenuTop + 'px', 
			'width': propArea.propMenuWidth + 'px',
			'height': propArea.propMenuHeight + 'px'}"
			@click="propControllerLayer3" 
			id="propMenu"></div>
			<!-- 下一页 -->
			<div class="next-page page-controller"
			@click="nextPage"></div>
		</div>
	
		<!-- 菜单层  返回、章节、设置都在这一层  为第三层 -->
		<div class="menu-layer layer" v-show="layer_3"
		>
			<!-- 关闭第三层 -->
			<div class="close-c-layer" @click="closeLayer3"></div>
			<!-- 章节跳转 -->
			<div class="chapter-controller">
				<div class="prev-chapter" @click="prevChapter">上一章</div>
				<!-- 进度 -->
				<div class="chapter-progress">
					<progress :percent="percent" show-info stroke-width="3" />
				</div>
				<div class="next-chapter" @click="nextChapter">下一章</div>
			</div>
			<!-- 底部控制区  用于弹出章节、设置按钮 -->
			<div class="c-controller-layer" @click.stop>
				<!-- 点击章节获取设置时 显示第四层 -->
				<div class="item" @click="showChapterList">章节</div>
				<div class="item" @click="showSetting">设置</div>
			</div>
		</div>
		
		<!-- 还是要第四层  用来放章节列表和设置 -->
		<div class="more-controller-layer layer" 
		@click="closeLayer4" v-show="layer_4">
			<!-- 章节列表 -->
			<yifang-chapter-list v-show="layer_4_chapter_list" 
			:book_id="book_id"
			:chapter_id="chapter_id"
			v-on:getClickChapterId="onChapterId"
			ref="chapterList"></yifang-chapter-list>
			
			<!-- 设置 -->
			<yifang-read-setting v-show="layer_4_setting" 
			v-on:fontSize="onFontSizeChange"
			v-on:backgroundColor="onBackgroundColor"
			v-on:fontColorChange="onFontColorChange"
			v-on:userSetting="onUserSetting"
			v-on:doLoadChapterList="onLoadChapterList"
			></yifang-read-setting>
		</div>
	
	</view>
</template>

<script>
	import {getBookDetailUtil} from '@/util/function/book/book.js'
	import {getChapterContent} from '@/util/user_http/chapter-content.js'
	
	import yifangChapterList from '@/components/yifang/yifang-chapter-list/yifang-chapter-list.vue'
	import yifangReadSetting from '@/components/yifang/yifang-read-setting/yifang-read-setting.vue'
	
	import {saveSchedule} from '@/util/function/book-schedule.js'
	import {isLogin, getLocalUserInfo} from '@/util/function/login.js'
	
	export default {
		name: "startRead",
		components: {yifangChapterList, yifangReadSetting},
		data() {
			return {
				settings: {
					letter_spacing: 0, // 字间距
					line_height: 0, // 行间距
					padding_left_right: 0, // 阅读区域左右空白区域间距 单位rpx
				}, // 用户设置
				font_color: '', // 用户设置的颜色，如无则默认黑色
				book_id: null,
				bookDetail: null, // 书籍详情
				// 控制层级显示
				layer_2: true, // 对应第二层
				layer_3: false, // 对应第三层
				layer_4: false, // 对应第四层
				layer_4_chapter_list: false, // 第四层的章节列表
				layer_4_setting: false, // 第四层的设置
				
				globalClickUse: true, // 是否可以使用全局点击事件
				chapter_id: null, // 章节id
				font_size: null, // 字体大小 默认
				percent: 0, // 阅读进度
				background_color: null, // 背景颜色 默认
				chapter_content: '', // 章节内容
				systemInfo: null, // 系统信息
				propArea: {
					propMenuLeft: 0, // 控制层左边距
					propMenuTop: 0, // 控制层上边距
					propMenuWidth: 0, // 控制层宽度
					propMenuHeight: 0, // 控制层高度
					x1: 0, // 左上顶点坐标
					x2: 0, // 右上顶点坐标
					y1: 0, // 左下顶点坐标
					y2: 0, // 右下顶点坐标
				}, // 控制层区域 参数信息
				scroll_top: 0, // 该章节滚动的高度 从接口获取
				default_content: '该章节没有内容', // 如果章节没有内容时显示的文字
			}
		},
		onLoad(options){
			this.book_id = options.book_id
			this.getBookDetail()
		},
		methods: {
			// 阅读区域滚动到底部
			onScrolltolower(e){
				console.log(e)
			},
			// 监听到可以加载章节列表时（加载配置完成） 采取加载章节列表，才去加载章节内容
			onLoadChapterList(){
				this.$refs.chapterList._getChapterList()
			},
			// 监听到配置
			onUserSetting(settings){
				this.settings = Object.assign(this.settings, settings)
			},
			// 监听字体颜色改变
			onFontColorChange(color){
				// console.log(color)
				this.font_color = color
				// 更改状态栏字体颜色
				uni.setNavigationBarColor({
				    frontColor: this.font_color,
					backgroundColor: this.background_color,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				})
			},
			// 处理阅读进度
			calcReadSchedule(chapter){
				// console.log(chapter)
				try{
					let schedule = JSON.parse(chapter.schedule)
					// console.log(schedule.value)
					this.$nextTick(function(){
						this.scroll_top = schedule.value
					})
				}catch(e){
					this.$nextTick(function(){
						this.scroll_top = 0
					})
					this.scroll_top = 0
				}
			},
			// 阅读区域滚动
			readScroll(e){
				// console.log('readScroll', e)
				// 直接保存某一章节滚动的高度
				let scrollTop = e.detail.scrollTop
				this.scroll_top = scrollTop
				// console.log(scrollTop)
				let schedule = {
					type: 'scrollTop',
					value: scrollTop.toFixed(2)
				}
				let that = this
				
				this.$u.debounce(function(){
					that.$u.throttle(function(){
						that._saveSchedule(that.book_id, that.chapter_id, JSON.stringify(schedule), false)
					},
					 10, false)
				}, 1000)
				
			},
			// 点击上一章
			prevChapter(){
				let [currentChapterIndex, chapterLegth, nextChapter] = this.getCurrentChapterIndex(this.chapter_id, 'prev')
				// console.log('prevChaptera', currentChapterIndex, chapterLegth, nextChapter)
				if(0 == currentChapterIndex){
					uni.showToast({
						title: '已经是第一章',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.clickChapterAfter(currentChapterIndex, chapterLegth, nextChapter)
			},
			// 点击下一章
			nextChapter(){
				let [currentChapterIndex, chapterLegth, nextChapter] = this.getCurrentChapterIndex(this.chapter_id, 'next')
				// console.log('nextChaptera', currentChapterIndex, chapterLegth, nextChapter)
				if(currentChapterIndex > chapterLegth){
					uni.showToast({
						title: '已经是最后一章',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.clickChapterAfter(currentChapterIndex, chapterLegth, nextChapter)
			},
			// 点击上一章或下一章后 统一的操作
			clickChapterAfter(currentChapterIndex, chapterLegth, chapter){
				// console.log('clickChapterAftera', currentChapterIndex, chapterLegth, chapter)
				this.chapter_id = chapter.chapter_id
				// 保存进度
				this._saveSchedule(this.book_id, this.chapter_id, '0', true)
				uni.setNavigationBarTitle({
				    title: chapter.chapter_name
				}) // 设置页面标题为章节标题
				this.getChapterContent() // 获取章节详情内容
				// 计算进度
				this.calcPercent(currentChapterIndex, chapterLegth)
			},
			// 计算进度
			calcPercent(currentChapterIndex, chapterLegth){
				// console.log('calcPercenta', currentChapterIndex, chapterLegth)
				this.percent = parseInt((currentChapterIndex/chapterLegth) * 100)
			},
			// 点击上一章或下一章时  返回当前章节在章节列表中的索引以及总的章节数 和下一章的章节id
			// 返回的数据说明：分别是当前章节在章节列表中的索引、总章节数、下一章节的id
			// type 可为 prev、next 分别为上一章、下一章
			getCurrentChapterIndex(chapter_id, type){
				// 获取章节列表子组件的章节数据
				return this.$refs.chapterList.getCurrentChapterIndex(chapter_id, type)
			},
			// 监听颜色背景颜色变化
			onBackgroundColor(bg_color){
				this.background_color = bg_color
				uni.setNavigationBarColor({
				    frontColor: this.font_color,
				    backgroundColor: bg_color,
				    animation: {
				        duration: 400,
				        timingFunc: 'easeIn'
				    }
				})
			},
			// 监听用户设置的字体大小变化
			onFontSizeChange(font_size){
				// console.log(font_size)
				this.font_size = font_size
			},
			// 保存进度
			_saveSchedule(book_id, chapter_id, schedule, is_first){
				if(!isLogin())return;
				
				// 开始保存进度
				saveSchedule(getLocalUserInfo()['user_id'], book_id, chapter_id, schedule, is_first)
			},
			// 监听章节组件返回的章节id
			onChapterId(chapter){
				// console.log('onChapterIda', chapter)
				// 保存章节首次阅读信息
				let is_first = this.chapter_id != chapter.item.chapter_id ? true : false
				this._saveSchedule(this.book_id, chapter.item.chapter_id, '0', is_first)
				this.chapter_id = chapter.item.chapter_id
				uni.setNavigationBarTitle({
				    title: chapter.item.chapter_name
				})
				this.chapter_content = null
				this.layer_4 = false
				this.layer_3 = false
				this.openGlobalClickEvent()
				this.getChapterContent(chapter) // 获取章节详情
				this.calcPercent(chapter.index, chapter.chapterLegth) // 计算进度
			},
			// 获取书籍详情
			getBookDetail(){
				uni.showLoading({
					mask: true,
					title: "加载内容中..."
				})
				getBookDetailUtil(this.book_id).then(res => {
					this.bookDetail = res
					// 设置页面标题
					uni.setNavigationBarTitle({
					    title: res.book_name
					})
					uni.hideLoading()
				}).catch(() => {
					uni.hideLoading()
				})
			},
			// 弹出控制层 也就是第三层
			propControllerLayer3(){
				// console.log('开始弹出控制层')
				this.layer_3 = true
			},
			// 关闭第三层
			closeLayer3(){
				// console.log('关闭第三层')
				this.layer_3 = false
				this.layer_4_setting = false
				this.openGlobalClickEvent()
			},
			// 开启全局点击事件
			openGlobalClickEvent(){
				this.globalClickUse = false
				setTimeout((function(){
					// console.log('开启全局点击事件')
					this.globalClickUse = true
				}).bind(this), 200)
			},
			// 关闭第四层
			closeLayer4(e){
				// console.log(e)
				this.layer_4 = false
				this.closeLayer3()
			},
			// 显示第四层章节列表
			showChapterList(){
				// console.log('显示第四层的章节')
				this.closeLayer3()
				this.layer_4 = true
				this.layer_4_chapter_list = true
				// 滚动到当前章节
				// return this.$refs.chapterList.scrollToChapterId(this.chapter_id)
			},
			// 显示第四层设置
			showSetting(){
				// console.log('显示第四层的设置')
				this.closeLayer3()
				this.layer_4 = true
				this.layer_4_chapter_list = false
				this.layer_4_setting = true
			},
			// 上一页
			prevPage(){},
			// 下一页
			nextPage(){},
			// 获取章节详细内容
			getChapterContent(chapter){
				uni.showLoading({
					mask: true,
					title: "加载章节中..."
				})
				getChapterContent({
					chapter_id: this.chapter_id
				}).then(res => {
					// console.log('getChapterContent', res)
					if(!res.data){
						res.data[0].chapter_content = this.default_content
					}
					this.chapter_content = ''
					this.$nextTick(function(){
						this.chapter_content = res.data[0].chapter_content
						this.calcReadSchedule(chapter)// 处理阅读进度
					})
					// 为啥多写一句同样的代码  反正我没搞懂$nextTick的用法，目的达到了
					this.chapter_content = res.data[0].chapter_content
				}).then(() => {
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					this.chapter_content = this.default_content
					// console.log(err)
				})
			},
			initControllerArea(){
				// 计算点击的是否是屏幕中心区域位置
				// 需要先计算到四个顶点的位置
				let screenX = this.systemInfo.screenWidth, screenY = this.systemInfo.screenHeight
				this.propArea.x1 = parseFloat((screenX / 2.5).toFixed(2)) // 控制区域宽度
				this.propArea.propMenuLeft = 0.75 * this.propArea.x1
				this.propArea.propMenuWidth = this.propArea.x1
				this.propArea.x2 = parseFloat((this.propArea.x1 + (this.propArea.propMenuLeft)).toFixed(2)) // x1、x2坐标确定！
						
				let c_h = parseFloat((screenY * 0.4).toFixed(2))
				this.propArea.propMenuHeight = c_h
				this.propArea.y1 = parseFloat((c_h / 1.5).toFixed(2))
				this.propArea.propMenuTop = this.propArea.y1
				this.propArea.y2 = parseFloat((this.propArea.y1 + c_h).toFixed(2))
				// console.log('x1', this.propArea.x1, 'x2', this.propArea.x2, 'y1', this.propArea.y1, 'y2', this.propArea.y2)
			},
			// 计算是否点击了弹出控制区域
			calcIsClickControllerArea(event, that){
				if(!this.globalClickUse)return
				
				if( (event.offsetX >= this.propArea.x1) && (this.propArea.x2 >= event.offsetX)
				 && (event.offsetY >= this.propArea.y1) && (this.propArea.y2 >= event.offsetY)){
					 if(!this.layer_3){
						 this.propControllerLayer3()
						 this.globalClickUse = false
					 }
				 }
			},
			// 全局点击事件
			globalClick(event){
				if(!this.globalClickUse)return
				// console.log('全局事件', event)
				// 覆盖属性
				event.offsetX = event.detail.x
				event.offsetY = event.detail.y
				let that = this
				if(that.systemInfo){
					that.calcIsClickControllerArea(event, that)
				}else{
					that.getSystemInfo()
				}
			},
			// 获取系统信息
			getSystemInfo(){
				let that = this
				uni.getSystemInfo({
				    success: function (res) {
						that.systemInfo = res
						that.initControllerArea()
				    }
				})
			},
			// 重新加载
			reLoad(){
				uni.showModal({
				    title: '加载失败',
				    content: '是否重新加载？',
					cancelText: '返回上一页',
					confirmText: '重新加载',
				    success: function (res) {
				        if (res.confirm) {
				            this.getBookDetail()
				        } else if (res.cancel) {
				            uni.navigateTo()
				        }
				    }
				})
			}
		},
		mounted(){
			this.getSystemInfo()
		},
		watch:{
			scroll_top(val, old){
				if(!old)return
				// return
				let that = this
				// 保存用户字体颜色
				console.log(val)
				this.$u.debounce(() => {
					let e = {
						detail: {
							scrollTop: val
						}
					}
					that.readScroll(e)
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
.body{
	.layer{
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0rpx;
		box-sizing: border-box;
	}
	.read-layer{
		padding: 0rpx 40rpx;
		z-index: 100;
		background-color: #FFFAE8;
		.chapter-content{
			height: 100%;
			line-height: 70rpx;
			text-align: center;
		}
		.scroll-Y{
			// height: 90%;
			height: calc(100vh - 150rpx - env(safe-area-inset-bottom));
		}
	}
	.controller-layer{
		z-index: 200;
		position: relative;
		pointer-events: none;
		div{
			display: inline-block;
			box-sizing: border-box;
		}
		.page-controller{
			position: absolute;
			height: 92vh;
			width: 50%;
		}
		.prev-page{
			top: 0rpx;
			left: 0rpx;
			z-index: 201;
		}
		.next-page{
			top: 0rpx;
			right: 0rpx;
			z-index: 202;
		}
		.prop-menu{
			// border: 1px solid red;
			// width: 400rpx;
			// height: 400rpx;
			// margin-top: 50%;
			// margin-left: 24%;
			z-index: 203;
		}
	}
	.menu-layer{
		z-index: 300;
		background: rgba(0, 0, 0, 0);
		// opacity: 1;
		.close-c-layer{
			height: 80%;
			z-index: 303;
			opacity: 0.1;
		}
		.chapter-controller{
			position: fixed;
			width: 100%;
			left: 0rpx;
			bottom: 120rpx;
			background-color: #FEFAC4;
			padding: 30rpx;
			overflow: hidden;
			div{
				display: inline-block;
				float: left;
				width: 100rpx;
				text-align: center;
				height: 50rpx;
				line-height: 50rpx;
			}
			.chapter-progress{
				// float: right;
				// border: 1px solid red;
				padding: 0rpx 30rpx;
				width: 56%;
			}
		}
		.c-controller-layer{
			clear: both;
			z-index: 302;
			position: fixed;
			width: 100%;
			padding: 30rpx 0rpx;
			left: 0rpx;
			bottom: 0rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-evenly;
			background-color: #FEFAC4;
			.item{
				padding: 10rpx 50rpx;
				border: 1px solid #A3855F;
				border-radius: 20rpx;
			}
		}
	}
	.more-controller-layer{
		z-index: 400;
	}
}
</style>
