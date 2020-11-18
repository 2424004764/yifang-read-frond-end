<template>
	<view>
		<div class="my">
			<!-- 头像区域 -->
			<div class="block-area">
				<!-- 用户信息 -->
				<div class="userinfo">
					<div class="headimg" v-if="isLogin">
						<img src="http://cdn.fologde.com/6.png" alt="">
					</div>
					<div class="nikename" v-if="isLogin">
						昵称：测试测试测试测试测试测试
						测试测试测试测试
					</div>
					<!-- 未登录 -->
					<div class="noLogin" v-if="!isLogin">登录/注册</div>
				</div>
				<!-- 用户成就 -->
				<div class="achievement" v-if="isLogin">
					<div class="box">
						<div class="item" v-for="(item, index) in achievements" 
						:key="index">{{item.title}}</div>
					</div>
					<div class="more">更多成就</div>
				</div>
			</div>
			
			<!-- 常用操作 -->
			<div class="block-area controller">
				<div class="item" v-for="(item, index) in controllers"
				:key="index">
					<div class="icon"><img :src="item.icon" alt=""></div>
					<div class="title">{{item.title}}</div>
				</div>
			</div>
			
			<!-- 菜单 -->
			<div class="block-area menu">
				<div class="item">
					<div class="title">帮助与反馈</div>
				</div>
				<div class="item">
					<div class="title">关于</div>
				</div>
			</div>
			
			<!-- 设置 -->
			<div class="block-area menu">
				<div class="item">
					<div class="title">设置</div>
				</div>
			</div>
			
			<!-- 退出 -->
			<div class="block-area signout">
				<div class="item">
					<div class="title">退出</div>
				</div>
			</div>
			
		</div>
	</view>
</template>

<script>
	export default {
		name: "my",
		data() {
			return {
				isLogin: true, // 是否登录
				achievements: [
					{title: '初入一方'}, {title: '小学者'}, {title: '初入一方'},
					{title: '初入一方'}, {title: '初入一方'}, {title: '初入一方'},
				], // 成就列表
				controllers: [
					{title: '浏览记录', icon: 'http://cdn.fologde.com/6.png'}, 
					{title: '收藏', icon: 'http://cdn.fologde.com/6.png'},
					{title: '收藏', icon: 'http://cdn.fologde.com/6.png'},
					{title: '收藏', icon: 'http://cdn.fologde.com/6.png'},
					{title: '收藏', icon: 'http://cdn.fologde.com/6.png'},
					{title: '收藏', icon: 'http://cdn.fologde.com/6.png'},
				], // 常用操作
			};
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/util/util.scss';
	
.my{
	$my-bg-cl:  #F4F4F0;
	background-color: $my-bg-cl;
	height: 100vh;
	padding-top: 1%;
	.block-area{
		padding: 30rpx;
		box-sizing: border-box;
		// border: 1px solid red;
		background-color: white;
		width: 94%;
		margin-left: 3%;
		margin-top: 2%;
		border-radius: 26rpx;
		// 个人中心
		.userinfo{
			display: flex;
			justify-content: flex-start;
			// border: 1px solid red;
			background-color: white;
			.headimg{
				height: 120rpx;
				width: 120rpx;
				border-radius: 50%;
				overflow: hidden;
			}
			.nikename{
				margin-left: 5%;
				max-width: 75%;
			}
			.noLogin{
				
			}
		}
		// 成就
		.achievement{
			margin-top: 20rpx;
			box-sizing: border-box;
			padding: 10rpx;
			padding-bottom: 0rpx;
			white-space: nowrap;
			overflow: hidden;
			display: flex;
			justify-content: flex-start;
			height: 60rpx;
			overflow: hidden;
			.box{
				overflow-x: scroll;
				height: 66rpx;
				.item{
					display: inline-block;
					padding: 6rpx 15rpx;
					background-color: $my-bg-cl;
					font-size: 24rpx;
					border-radius: 20rpx;
				}
			}
			.more{
				padding: 6rpx 15rpx;
				margin-left: 20rpx;
				font-size: 24rpx;
				border-left: 1px solid black;
				padding-top: 8rpx;
				&::after{
					width: 14rpx;
					height: 14rpx;
					@extend .after-arrow-icon;
				}
			}
		}
	}
	// 常用操作
	.controller{
		display: flex;
		flex-flow: row wrap;
		padding-top: 0px;
		.item{
			width: 156rpx;
			// border: 1px solid red;
			font-size: 26rpx;
			margin-top: 40rpx;
			.icon{
				width: 76rpx;
				height: 76rpx;
				margin: 0 auto;
				border-radius: 50%;
				overflow: hidden;
			}
			.title{
				padding-top: 20rpx;
				text-align: center;
			}
		}
	}
	// 菜单
	.menu{
		.item{
			font-size: 28rpx;
			position: relative;
			&::after{
				position: absolute;
				right: 0rpx;
				top: 10rpx;
				width: 16rpx;
				height: 16rpx;
				@extend .after-arrow-icon;
			}
			&:not(:first-child) {
				margin-top: 30rpx;
			}
		}
	}
	// 退出
	.signout{
		font-size: 24rpx;
		text-align: center;
	}
}
</style>
