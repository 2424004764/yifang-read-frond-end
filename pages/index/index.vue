<template>
	
	<view class="body">
		<!-- 顶部搜索框 -->
		<!-- <yifang-top-search></yifang-top-search> -->
		
		<!-- 轮播图 -->
		<yifang-swiper></yifang-swiper>
		
		<!-- 菜单 -->
		<!-- <yifang-menu v-if="hackReset"></yifang-menu> -->
		
		<!-- 推荐 -->
		<yifang-recommend v-if="hackReset"></yifang-recommend>
	</view>
	
</template>

<script>
	import yifangTopSearch from '@/components/yifang/yifang-top-search/yifang-top-search.vue'
	import yifangSwiper from '@/components/yifang/yifang-swiper.vue'
	import yifangMenu from '@/components/yifang/yifang-menu/yifang-menu.vue'
	import yifangRecommend from '@/components/yifang/yifang-recommend/yifang-recommend.vue'
	
	export default {
		components: {yifangTopSearch, yifangSwiper, yifangMenu,
		yifangRecommend},
		data() {
			return {
				hackReset: true
			}
		},
		methods: {

		},
		onPullDownRefresh(option) {
			this.hackReset = false
			this.$nextTick(() => {
				this.hackReset = true
				uni.stopPullDownRefresh();
			})
		},
	}
</script>

<style scoped lang="scss">
</style>
