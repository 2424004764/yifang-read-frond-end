<template>
	
	<view class="body">
		<!-- 顶部搜索框 -->
		<top-search></top-search>
		
		<!-- 轮播图 -->
		<yifang-swiper></yifang-swiper>
		
		<view class="container">
			<!-- 书籍列表 -->
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
			<div class="book_list">1121134</div>
		</view>
	</view>
	
</template>

<script>
	import topSearch from '@/components/yifang/top-search/top-search.vue'
	import yifangSwiper from '@/components/yifang/yifang-swiper.vue'
	export default {
		components: {topSearch, yifangSwiper},
		data() {
			return {
			}
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
.book_list{
	height: 60px;
	// border: 1px solid red;
}
</style>
