<template>
	<view class="body" ref="startReadBody" @click="globalClick">
		<!-- 阅读器分三层 每层分别是： -->
		<!-- 用以承载书籍章节内容 仅做展示 第一层 -->
		<div class="read-layer layer">
			<div class='chapter-content' v-if="chapter_content">
				<!-- {{chapter_content}} -->
				123
			</div>
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
		@click="layer_3_click">
			<!-- 关闭第三层 -->
			<div class="close-c-layer" @click="closeLayer3"></div>
			<!-- 底部控制区  用于弹出章节、设置按钮 -->
			<div class="c-controller-layer">
				<!-- 点击章节获取设置时 显示第四层 -->
				<div class="item" @click="showChapterList">章节</div>
				<div class="item" @click="showSetting">设置</div>
			</div>
			<!-- 为章节列表腾出位置 -->
			<div class="chapter-list"></div>
		</div>
		
		<!-- 还是要第四层  用来放章节列表和设置 -->
		<div class="more-controller-layer layer" 
		@click="closeLayer4" v-show="layer_4">
			<yifang-chapter-list :book_id="book_id" v-on:getClickChapterId="onChapterId"></yifang-chapter-list>
		</div>
	
	</view>
</template>

<script>
	import {getBookDetailUtil} from '@/util/function/book/book.js'
	
	import yifangChapterList from '@/components/yifang/yifang-chapter-list/yifang-chapter-list.vue'
	import {getChapterContent} from '@/util/user_http/chapter-content.js'
	export default {
		name: "startRead",
		components: {yifangChapterList},
		data() {
			return {
				book_id: null,
				bookDetail: null, // 书籍详情
				// 控制层级显示
				layer_2: true, // 对应第二层
				layer_3: false, // 对应第三层
				layer_4: false, // 对应第四层
				globalClickUse: true, // 是否可以使用全局点击事件
				chapter_id: 123, // 测试用的章节id
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
			}
		},
		onLoad(options){
			this.book_id = options.book_id
			this.getBookDetail()
		},
		methods: {
			// 监听章节组件返回的章节id
			onChapterId(chapter_id){
				this.chapter_id = chapter_id
				this.chapter_content = null
				this.layer_4 = false
				this.layer_3 = false
				this.openGlobalClickEvent()
				this.getChapterContent()
			},
			// 获取书籍详情
			getBookDetail(){
				getBookDetailUtil(this.book_id).then(res => {
					this.bookDetail = res
					// 设置页面标题
					uni.setNavigationBarTitle({
					    title: res.book_name
					})
				}).then(() => {
					this.getChapterContent() // 获取章节详细内容
				})
			},
			// 弹出控制层 也就是第三层
			propControllerLayer3(){
				// console.log('开始弹出控制层')
				this.layer_3 = true
			},
			// 关闭第三层
			closeLayer3(){
				console.log('关闭第三层')
				this.layer_3 = false
				this.openGlobalClickEvent()
			},
			// 开启全局点击事件
			openGlobalClickEvent(){
				this.globalClickUse = false
				setTimeout((function(){
					console.log('开启全局点击事件')
					this.globalClickUse = true
				}).bind(this), 200)
			},
			// 关闭第四层
			closeLayer4(e){
				// console.log(e)
				// this.layer_4 = false
			},
			// 第三层点击
			layer_3_click(){
				
			},
			// 显示第四层章节列表
			showChapterList(){
				// console.log('显示第四层的章节')
				this.layer_4 = true
			},
			// 显示第四层设置
			showSetting(){
				// console.log('显示第四层的设置')
				this.layer_4 = true
			},
			// 上一页
			prevPage(){},
			// 下一页
			nextPage(){},
			// 获取章节详细内容
			getChapterContent(){
				uni.showLoading({
					mask: true,
					title: "加载章节中..."
				})
				getChapterContent({
					chapter_id: this.chapter_id
				}).then(res => {
					// console.log('chapter-content', res)
					this.chapter_content = res.data[0].chapter_content
					uni.hideLoading()
				}).catch(err => {
					console.log(err)
				})
			},
			initControllerArea(){
				// 计算点击的是否是屏幕中心区域位置
				// 需要先计算到四个顶点的位置
				// let x1 = 70, x2 = 272, y1 = 168, y2 = 368; // 从左至右 分别对应上面两个顶点和下面两个底点
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
				console.log('x1', this.propArea.x1, 'x2', this.propArea.x2, 'y1', this.propArea.y1, 'y2', this.propArea.y2)
			},
			// 计算是否点击了弹出控制区域
			// 此时 that.systemInfo 系统信息
			calcIsClickControllerArea(event){
				if(!this.globalClickUse)return
				// offsetX、offsetY 分别表示点击的x、y轴
				// console.log('offsetX', event.offsetX)
				// console.log('offsetY', event.offsetY)
				
				
				if( (event.offsetX >= this.propArea.x1) && (this.propArea.x2 >= event.offsetX)
				 && (event.offsetY >= this.propArea.y1) && (this.propArea.y2 >= event.offsetY)){
					 // console.log('this.layer_3', this.layer_3)
					 if(!this.layer_3){
						 this.propControllerLayer3()
					 }
				 }
			},
			globalClick(event){
				// console.log(event)
				// 覆盖属性
				event.offsetX = event.detail.x
				event.offsetY = event.detail.y
				let that = this
				if(that.systemInfo){
					that.calcIsClickControllerArea(event)
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
			}
		},
		mounted(){
			uni.setNavigationBarColor({
			    frontColor: '#000000',
			    backgroundColor: '#FFFAE8',
			})
			this.getSystemInfo()
		},
		computed:{
		},
		destroyed() {
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
		padding: 0rpx 40rpx 40rpx 40rpx;
		z-index: 100;
		background-color: #FFFAE8;
		.chapter-content{
			overflow-y: scroll;
			height: 95%;
			line-height: 70rpx;
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
			border: 1px solid red;
			// width: 400rpx;
			// height: 400rpx;
			// margin-top: 50%;
			// margin-left: 24%;
			z-index: 203;
		}
	}
	.menu-layer{
		z-index: 300;
		background-color: #FFFEFA;
		opacity: 0.9;
		.close-c-layer{
			height: 80%;
			z-index: 303;
		}
		.c-controller-layer{
			z-index: 302;
			position: fixed;
			width: 100%;
			padding: 40rpx 0rpx;
			border-top: 1px solid red;
			left: 0rpx;
			bottom: 0rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-evenly;
			background-color: #FFFAE8;
			.item{
				padding: 10rpx 20rpx;
				border: 1px solid #FF5501;
				border-radius: 20rpx;
			}
		}
	}
	.more-controller-layer{
		z-index: 400;
	}
}
</style>
