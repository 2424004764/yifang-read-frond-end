<template>
	<view class="body">
		<!-- 阅读器分四层 每层分别是： -->
		<!-- 用以承载书籍章节内容 第一层 -->
		<div class="read-layer layer"></div>
		
		<!-- 用来控制上一页、下一页、调出菜单的层  为第二层-->
		<div class="controller-layer layer"></div>
	
		<!-- 全屏层  用来弹出菜单后关闭菜单层的作用  为第三层 -->
		<div class="close-controller-layer layer"></div>
		
		<!-- 菜单层  返回、章节、设置都在这一层  为第四层 -->
		<div class="menu-layer layer"></div>
	
	</view>
</template>

<script>
	import {getBookDetailUtil} from '@/util/function/book/book.js'
	
	export default {
		name: "startRead",
		data() {
			return {
				book_id: null,
				bookDetail: null, // 书籍详情
			}
		},
		onLoad(options){
			this.book_id = options.book_id
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
		},
		mounted(){
			this.getBookDetail()
		},
	}
</script>

<style lang="scss" scoped>
.body{
	
}
</style>
