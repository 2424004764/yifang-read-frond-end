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
	import {
		isLogin,
		getLocalUserInfo
	} from '@/util/function/login.js'
	
	export default {
		components: {yifangTopSearch, yifangSwiper, yifangMenu,
		yifangRecommend},
		data() {
			return {
				hackReset: true,
				isLogin: false, // 是否登录
			}
		},
		onShow() {
			this.initUser()
		},
		methods: {
			// 初始化用户信息
			initUser(){
				this.isLogin = isLogin() ? true : false
			}
		},
		// 首页上拉到底事件
		onReachBottom(){
			// 那个页面或者组件想监听这个事件的 监听该事件即可
			uni.$emit('indexOnReachBottom')
		},
		// 下拉刷新事件
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
