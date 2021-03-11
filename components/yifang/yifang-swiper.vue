<template>
	<view class="swiper1">
		<swiper class="swiper" :indicator-dots="indicatorDots" 
		:autoplay="autoplay" :interval="interval" :duration="duration"
		:circular="true" :previous-margin="previous_margin" :next-margin="previous_margin"
		:indicator-color="indicator_color" :indicator-active-color="indicator_active_color"
		>
			<swiper-item v-for="(item, key) in swiperData" :key="key">
				<image mode="scaleToFill" class="swiper-images"
					:src="item.url" @click="toBookDetail(item.book_id)"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {getSwiperImages} from '@/util/user_http/system-setting.js'
	
	export default {
		name: 'yifangSwiper',
		data() {
			return {
				indicatorDots: true, // 是否显示面板指示点
				autoplay: true, // 是否自动切换
				interval: 3000, // 自动切换时间间隔 毫秒
				duration: 500, // 滑动动画时长
				previous_margin: "50rpx", // 前边距，可用于露出前一项的一小部分
				indicator_color: 'RGB(255,255,255)', // 指示点颜色
				indicator_active_color: '#FF5501', // 当前选中的指示点颜色
				
				swiperData: [], // 轮播图
			}
		},
		created(){
			this._getSwiperImages()
		},
		methods:{
			// 跳转书籍详情
			toBookDetail(book_id){
				// console.log(book_id)
				uni.navigateTo({url: '/pages/book/book-detail/book-detail?book_id=' + book_id})
			},
			// 获取首页轮播图
			_getSwiperImages(){
				getSwiperImages({}, {
					custom: {
						loading: false
					},
				}).then(res => {
					try{
						this.swiperData = JSON.parse(res.data.config_value)
					}catch(err){
						
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.swiper1{
	z-index: 10;
	// border: 1px solid red;
	width: 96%;
	margin: 2% 2%;
	.swiper-images{
		width: 100%;
		height: 100%;
	}
}
</style>
