<template>
	<cover-view class="taowa">
		<cover-view class="search">
			<cover-view class="left">待定</cover-view>
			<cover-view class="box">
				<cover-view class="text">搜索</cover-view>
			</cover-view>
			<cover-view class="right">待定</cover-view>
		</cover-view>
	</cover-view>
</template>

<script>
	export default {
		name: 'yifangTopSearch',
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
$height: 90rpx;
.taowa{
	height: $height;
	width: 100%;
}
.search{
	// border: 1px solid red;
	z-index: 1000;
	overflow: hidden;
	height: $height;
	clear: both;
	position: fixed;
	width: 100%;
	background-color: #F9FAF9;
	cover-view{
		height: $height;
		line-height: $height;
		// border: 1px solid red;
		float: left;
	}
	.left{
		width: 20%;
	}
	.box{
		height: calc(100% - 12rpx);
		border: 2px solid #CF5D1B;
		border-radius: 20px;
		width: 58%;
		margin-top: 4rpx;
		overflow: hidden;
		.text{
			$text-line-height: 78rpx;
			height: $text-line-height;
			line-height: $text-line-height;
			// border: 1px solid red;
			float: right;
			margin-right: -4rpx;
			width: 150rpx;
			text-align: center;
			border-radius: 20px;
			background: linear-gradient(to left, #FF830B , #FF5501); 
			color: white;
		}
	}
	.right{
		float: right;
		width: 20%;
		text-align: right;
	}
}
</style>
