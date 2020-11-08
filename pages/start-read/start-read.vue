<template>
	<view class="body">
		<!-- 阅读器分三层 每层分别是： -->
		<!-- 用以承载书籍章节内容 仅做展示 第一层 -->
		<div class="read-layer layer">
			<div class='chapter-content'>
				{{chapter_content}}
			</div>
		</div>
		
		<!-- 用来控制上一页、下一页、调出菜单的层  为第二层-->
		<div class="controller-layer layer" v-if="layer_2">
			<!-- 上一页 -->
			<div class="prev-page page-controller"
			@click="prevPage"></div>
			<!-- 弹出菜单 -->
			<div class="prop-menu page-controller" 
			@click="propControllerLayer3" 
			id="propMenu"></div>
			<!-- 下一页 -->
			<div class="next-page page-controller"
			@click="nextPage"></div>
		</div>
	
		<!-- 菜单层  返回、章节、设置都在这一层  为第三层 -->
		<div class="menu-layer layer" v-show="layer_3">
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
			<yifang-chapter-list :book_id="book_id"></yifang-chapter-list>
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
				chapter_id: 123, // 测试用的章节id
				chapter_content: '', // 章节内容
				systemInfo: null, // 系统信息
			}
		},
		onLoad(options){
			this.book_id = options.book_id
			this.getBookDetail()
		},
		methods: {
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
				console.log('开始弹出控制层')
				this.layer_3 = true
			},
			// 关闭第三层
			closeLayer3(){
				this.layer_3 = false
			},
			// 关闭第四层
			closeLayer4(e){
				console.log(e)
				// this.layer_4 = false
			},
			// 显示第四层章节列表
			showChapterList(){
				console.log('显示第四层的章节')
				this.layer_4 = true
			},
			// 显示第四层设置
			showSetting(){
				console.log('显示第四层的设置')
				this.layer_4 = true
			},
			// 上一页
			prevPage(){},
			// 下一页
			nextPage(){},
			// 获取章节详细内容
			getChapterContent(){
				let chapter_id = this.chapter_id
				getChapterContent({
					chapter_id: chapter_id
				}).then(res => {
					// console.log('chapter-content', res)
					this.chapter_content = res.data[0].chapter_content
				}).catch(err => {
					console.log(err)
				})
			},
			// 计算是否点击了弹出控制区域
			calcIsClickControllerArea(event){
				// offsetX、offsetY 分别表示点击的x、y轴
				// console.log(e.offsetX)
				// console.log(e.offsetY)
				console.log(event)
				// 计算点击的是否是屏幕中心区域位置
				// 需要先计算到四个顶点的位置
				let x1 = 0, x2 = 0, y1 = 0, y2 = 0; // 从左至右 分别对应上面两个顶点和下面两个底点
				
				// 获取中心区域元素的坐标信息
				const query = uni.createSelectorQuery().in(this);
				query.selectViewport('#propMenu').boundingClientRect(data => {
				  // console.log(data)
				}).exec();
			}
		},
		mounted(){
			uni.setNavigationBarColor({
			    frontColor: '#000000',
			    backgroundColor: '#FFFAE8',
			})
			// 计算点击的位置
			let that = this
			document.getElementsByTagName('body')[0].onclick = function (event) {
				if(that.systemInfo){
					that.calcIsClickControllerArea(event)
				}else{
					uni.getSystemInfo({
					    success: function (res) {
							that.systemInfo = res
							that.calcIsClickControllerArea(event)
					    }
					})
				}
			}
		},
		destroyed() {
			document.getElementsByTagName('body')[0].onclick = null
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
		padding: 40rpx;
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
			width: 400rpx;
			height: 400rpx;
			margin-top: 50%;
			margin-left: 24%;
			z-index: 203;
		}
	}
	.menu-layer{
		z-index: 300;
		background-color: #FFFEFA;
		opacity: 0.6;
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
