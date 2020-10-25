<template>
	<view class="swiper1">
		<swiper class="swiper" :indicator-dots="indicatorDots" 
		:autoplay="autoplay" :interval="interval" :duration="duration"
		:circular="true" :previous-margin="previous_margin" :next-margin="previous_margin">
			<swiper-item>
				<view class="">
					<cover-image class="controls-play img" @click="play" 
					src="http://cdn.fologde.com/6.png"></cover-image>
				</view>
			</swiper-item>
			<swiper-item>
				<cover-image class="controls-play img" @click="play"
				src="http://cdn.fologde.com/7.png"></cover-image>
			</swiper-item>
			<swiper-item>
				<cover-image class="controls-play img" @click="play"
				src="http://cdn.fologde.com/4.png"></cover-image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: 'swiper',
		data() {
			return {
				background: ['red', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				previous_margin: "50rpx"
			};
		}
	}
</script>

<style lang="scss" scoped>
.swiper1{
	z-index: 10;
	// border: 1px solid red;
	width: 96%;
	margin: 2% 2%;
}
</style>
