<template>
	<view>
		<div class="my">
			<!-- 头像区域 -->
			<div class="block-area">
				<!-- 用户信息 -->
				<div class="userinfo">
					<div class="headimg" v-if="isLogin">
						<img :src="userinfo.user_headimg" alt="">
					</div>
					<div class="nikename-area" v-if="isLogin" @click="clickMyInfo">
						<p class="nickname">{{userinfo.user_nickname}}</p>
						<p class="uid-area">
							<text>个人信息</text>
							<!-- 一方书号：{{userinfo.user_id}} -->
						</p>
					</div>
					<!-- 未登录 -->
					<div class="noLogin" v-if="!isLogin">
						<p @click="toLoginPage">登录 / 注册</p>
						<p class="no-login-tip">
							注册后可将记录保存到云端
						</p>
					</div>
				</div>
				<!-- 用户成就 -->
				<!-- <div class="achievement" v-if="isLogin && achievements.length">
					<div class="box">
						<div class="item" v-for="(item, index) in achievements" 
						:key="index">{{item.title}}</div>
					</div>
					<div class="more">更多成就</div>
				</div> -->
			</div>

			<!-- 常用操作 -->
			<div class="block-area controller" v-if="controllers.length && isLogin">
				<div class="item" v-for="(item, index) in controllers" :key="index">
					<div @click="menuJump(item)">
						<div class="icon">
							<u-image width="76rpx" height="76rpx" :src="item.icon" alt=""></u-image>
						</div>
						<div class="title">{{item.title}}</div>
					</div>
				</div>
			</div>

			<!-- 菜单 -->
			<div class="block-area menu">
				<div class="item" v-if="isLogin">
					<div class="title" @click="feedback">意见反馈</div>
				</div>
				<div class="item" @click="toAboutPage">
					<div class="title">关于</div>
				</div>
			</div>

			<!-- 设置 -->
			<!-- <div class="block-area menu">
				<div class="item">
					<div class="title">设置</div>
				</div>
			</div> -->

			<!-- 退出 -->
			<div class="block-area signout" v-if="isLogin" @click="outIn">
				<div class="item">
					<div class="title">退出</div>
				</div>
			</div>

		</div>
	</view>
</template>

<script>
	import {
		isLogin,
		getLocalUserInfo
	} from '@/util/function/login.js'
	
	import {
		_menuJump
	} from '@/util/function/menuJump.js'
	
	export default {
		name: "my",
		data() {
			return {
				isLogin: false, // 是否登录
				userinfo: [],
				achievements: [{
						title: '初入一方'
					}, {
						title: '小学者'
					}, {
						title: '初入一方'
					},
					{
						title: '初入一方'
					}, {
						title: '初入一方'
					}, {
						title: '初入一方'
					},
				], // 成就列表
				controllers: [], // 常用操作
				menu_items: [{
					title: '阅读记录',
					icon: 'http://cdn.fologde.com/yifang-read/read-record.png', // 图标
					need_login: true, // 是否需要登录才能使用
					jumpType: 'navigateTo', // 跳转类型 如：navigateTo
					jumpPage: '/pages/my/menu/read-history', // 跳转的页面 绝对路径
				}], // 所有的菜单项
				Config: {}, // 全局配置
			}
		},
		onLoad() {
			this.init()
			// 加载常用操作
			this.loadControllers()
			this.Config = this.$yifangConfig
		},
		onShow() {
			this.init()
			// 加载常用操作
			this.loadControllers()
		},
		onShareAppMessage(res) {
			let title = this.Config.appName
			
			return {
				title: title+' 邀你一起知书',
				path: '/pages/index/index'
			}
		},
		methods: {
			// 点击了菜单
			menuJump(menuItem) {
				_menuJump(menuItem)
			},
			// 加载常用操作
			loadControllers() {
				this.controllers = [] // 重新计算需要显示的菜单项
				// 需要的菜单在这里加
				for (let index in this.menu_items) {
					// 需要菜单项需要登录  但是没有登录  则跳过
					if (this.menu_items[index].need_login && !this.isLogin) {
						continue
					}
					this.controllers.push(this.menu_items[index])
				}
			},
			// 反馈
			feedback() {
				uni.navigateTo({
					url: 'feedback'
				})
			},
			// 点击头像昵称区域  进度我的个人中心
			clickMyInfo() {
				uni.navigateTo({
					url: '/pages/my/my-info'
				})
			},
			// 初始化
			init() {
				this.isLogin = isLogin() ? true : false
				if (this.isLogin) {
					// 加载用户信息
					this.userinfo = getLocalUserInfo()
					// 加载成就
					if (this.userinfo.hasOwnProperty('achievements')) {
						this.achievements = this.userinfo.achievements
					} else {
						this.achievements = []
					}
				}
			},
			// 退出
			outIn() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '是否退出？',
					success: function(res) {
						if (res.confirm) {
							uni.clearStorageSync()
							that.init()
						}
					}
				});
			},
			// 去关于页
			toAboutPage() {
				uni.navigateTo({
					url: '/pages/about/about'
				})
			},
			// 去登录页
			toLoginPage() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/util/util.scss';

	.my {
		@extend .uni-bg-cr;
		height: 100vh;
		padding-top: 1%;
		box-sizing: border-box;

		.block-area {
			padding: 30rpx;
			box-sizing: border-box;
			background-color: white;
			width: 94%;
			margin-left: 3%;
			margin-top: 2%;
			border-radius: 26rpx;

			// 个人中心
			.userinfo {
				display: flex;
				justify-content: flex-start;
				// border: 1px solid red;
				background-color: white;

				.headimg {
					height: 140rpx;
					width: 140rpx;
					border-radius: 50%;
					overflow: hidden;
				}

				.nikename-area {
					margin-left: 5%;
					max-width: 75%;

					.nickname {
						min-height: 84rpx;
						font-weight: 700;
					}

					.uid-area {
						position: relative;
						width: 472rpx;
						text-align: right;

						text {
							margin-right: 30rpx;
						}

						&::after {
							position: absolute;
							right: 0px;
							top: 14rpx;
							width: 14rpx;
							height: 14rpx;
							@extend .after-arrow-icon;
						}
					}
				}

				.noLogin {
					.no-login-tip {
						font-size: 24rpx;
						margin-top: 15rpx;
					}
				}
			}

			// 成就
			.achievement {
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

				.box {
					overflow-x: scroll;
					height: 66rpx;

					.item {
						display: inline-block;
						padding: 6rpx 15rpx;
						background-color: $my-bg-cl;
						font-size: 24rpx;
						border-radius: 20rpx;
					}
				}

				.more {
					padding: 6rpx 15rpx;
					margin-left: 20rpx;
					font-size: 24rpx;
					border-left: 1px solid black;
					padding-top: 8rpx;

					&::after {
						width: 14rpx;
						height: 14rpx;
						@extend .after-arrow-icon;
					}
				}
			}
		}

		// 常用操作
		.controller {
			display: flex;
			flex-flow: row wrap;
			padding-top: 0px;

			.item {
				width: 161rpx;
				// border: 1px solid red;
				font-size: 26rpx;
				margin-top: 40rpx;
				box-sizing: border-box;

				.icon {
					width: 76rpx;
					height: 76rpx;
					margin: 0 auto;
					border-radius: 50%;
					overflow: hidden;
				}

				.title {
					padding-top: 20rpx;
					text-align: center;
				}
			}
		}

		// 菜单
		.menu {
			.item {
				font-size: 28rpx;
				position: relative;

				&::after {
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
		.signout {
			font-size: 24rpx;
			text-align: center;
		}
	}
</style>
