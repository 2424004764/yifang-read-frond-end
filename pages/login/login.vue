<template>
	<view class="bg">
		<div class="login">
			<div class="logo">
				<img src="http://cdn.fologde.com/6.png" alt="">
			</div>
			
			<div class="form">
				<form>
					<div class="yifang-account input-form">
						<div class="tip">书号</div>
						<input class="uni-input" name="input" 
						placeholder="一方书号"
						type="number"
						maxlength="11"
						placeholder-class="placeholder-class"/>
					</div>
					
					<div class="yifang-password input-form item">
						<div class="tip">密码</div>
						<input class="uni-input" name="input" 
						placeholder="密码"
						maxlength="30"
						:password="true"
						placeholder-class="placeholder-class"/>
					</div>
					
					<div class="login-button item">登录</div>
					
					<div class="tip item">
						<p>
							<text>忘记密码？</text>
							<text @click="toRegPage">|&nbsp;&nbsp;新用户注册</text>
						</p>
					</div>
				</form>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		name: 'login',
		data() {
			return {
				text_decode: true,
			};
		},
		methods: {
			// 去注册页面
			toRegPage(){
				uni.navigateTo({
					url: '/pages/reg/reg'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/util/util.scss';
.bg{
	@extend .uni-bg-cr;
	box-sizing: border-box;
	// margin-top: 20%;
	padding-top: 20%;
	height: 100vh;
	.login{
		@extend .uni-bg-cr;
		width: 92%;
		margin-left: 4%;
		padding: 30rpx 20rpx;
		background-color: white;
		box-sizing: border-box;
		position: relative;
		$input-height: 80rpx;
		.logo{
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			overflow: hidden;
			margin: 0 auto;
			position: absolute;
			top: -70rpx;
			left: 40%;
		}
		.form{
			margin-top: 100rpx;
			.input-form{
				display: flex;
				.tip{
					line-height: $input-height;
					width: 130rpx;
				}
			}
		}
		.item{
			margin-top: 40rpx;
		}
		.uni-input{
			background-color: #F6F7FB;
			height: $input-height;
			margin-left: 40rpx;
			width: 80%;
		}
		.login-button{
			margin-top: 90rpx;
			background-color: $main-color;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			border-radius: 20rpx;
			color: white;
		}
		.tip{
			text-align: center;
			font-size: 25rpx;
		}
	}
}
.placeholder-class{
	font-size: 24rpx;
}
</style>
