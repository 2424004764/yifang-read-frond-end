<template>
	<view class="body">
		<!-- 阅读器分三层 每层分别是： -->
		<!-- 用以承载书籍章节内容 仅做展示 第一层 -->
		<div class="read-layer layer">
			<text>
			如果使用 hasMany() 声明关联关系，则访问此关联属性 
			将返回相关的 Active Record 实例的数组； 如果使用 
			hasOne() 声明关联关系，访问此关联属性 将返回相关的 
			Active Record 实例，如果没有找到相关数据的话，则返回 null。
			
			当你第一次访问关联属性时，将执行 SQL 语句获取数据，
			如 上面的例子所示。如果再次访问相同的属性，将返回先前的
			结果，而不会重新执行 SQL 语句。要强制重新执行 SQL 语
			句，你应该先 unset 这个关联属性， 如：unset（$ cust
			omer-> orders）。
			</text>
		</div>
		
		<!-- 用来控制上一页、下一页、调出菜单的层  为第二层-->
		<div class="controller-layer layer">
			<!-- 上一页 -->
			<div class="prev-page page-controller"></div>
			<!-- 弹出菜单 -->
			<div class="prop-menu page-controller" @click="propController"></div>
			<!-- 下一页 -->
			<div class="next-page page-controller"></div>
		</div>
	
		<!-- 菜单层  返回、章节、设置都在这一层  为第三层 -->
		<div class="menu-layer layer" v-if="c_layer">
			<!-- 关闭第三层 -->
			<div class="close-c-layer" @click="closeCLayer"></div>
			<!-- 底部控制区  用于弹出章节、设置按钮 -->
			<div class="c-controller-layer">
				<div class="item" @click="showChapterList">章节</div>
				<div class="item">设置</div>
			</div>
			
		</div></div>
	
	</view>
</template>

<script>
	import {getBookDetailUtil} from '@/util/function/book/book.js'
	
	import yifangChapterList from '@/components/yifang/yifang-book-detail/yifang-book-detail.vue'
	export default {
		name: "startRead",
		components: {yifangChapterList},
		data() {
			return {
				book_id: null,
				bookDetail: null, // 书籍详情
				// 控制层级显示
				c_layer: false, // 对应第三层
			}
		},
		onLoad(options){
			this.book_id = options.book_id
			uni.getStorageInfo({
			    success: function (res) {
			        console.log(res);
			    }
			});
		},
		methods: {
			getBookDetail(){
				getBookDetailUtil(this.book_id).then(res => {
					this.bookDetail = res
					// 设置页面标题
					uni.setNavigationBarTitle({
					    title: res.book_name
					})
				})
			},
			// 弹出控制层
			propController(){
				console.log('开始弹出控制层')
				this.c_layer = true
			},
			// 关闭第三层
			closeCLayer(){
				this.c_layer = false
			},
			// 显示章节列表
			showChapterList(){
				
			}
		},
		mounted(){
			uni.setNavigationBarColor({
			    frontColor: '#000000',
			    backgroundColor: '#FFFAE8',
			})
		},
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
	}
	.controller-layer{
		z-index: 200;
		position: relative;
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
}
</style>
