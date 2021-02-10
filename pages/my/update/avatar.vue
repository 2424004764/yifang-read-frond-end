<template>
	<view class="page">
		<!-- 已选择的头像 -->
		<u-sticky>
		<div class="selected">
			<u-grid :col="3" :border="false">
				<u-grid-item>
					<text>当前的头像</text> <br>
					<u-image width="120rpx" height="120rpx" :src="userinfo.user_headimg" @click="showImg(userinfo.user_headimg)"></u-image>
				</u-grid-item>
				
				<u-grid-item v-if="man_icon_select_index || woman_icon_select_index">
					<text>选择的头像</text> <br>
					<u-image width="120rpx" height="120rpx" :src="current_select_avatar_url" @click="showImg(current_select_avatar_url)"></u-image>
				</u-grid-item>
				
				<u-grid-item v-if="man_icon_select_index || woman_icon_select_index">
					<u-button type="primary" @click="saveAvatar">保存</u-button>
				</u-grid-item>
			</u-grid>
		</div>
		</u-sticky>
		
		<div class="avatar-select-area">
			<u-grid :col="5">
				<u-grid-item v-for="(item, index) in man_img" :key="index" class="select-area">
					<u-image @click="showImg(item.icon)" width="120rpx" height="120rpx" :src="item.icon"></u-image>
					<div class="select-item" @click="man_avatar_cilck(index)" :style="{opacity: item.is_select ? 1 : 0.2}"></div>
				</u-grid-item>
			</u-grid>
			
			<u-gap height="20" bg-color="#F6F7F9"></u-gap>
			
			<u-grid :col="5">
				<u-grid-item v-for="(item2, index2) in woman_img" :key="index2" class="select-area">
					<u-image @click="showImg(item2.icon)" width="120rpx" height="120rpx" :src="item2.icon"></u-image>
					<div class="select-item" @click="woman_avatar_cilck(index2)" :style="{opacity: item2.is_select ? 1 : 0.2}"></div>
				</u-grid-item>
			</u-grid>
		</div>
	</view>
</template>

<script>
	import {isLogin, getLocalUserInfo} from '@/util/function/login.js'
	export default {
		data() {
			return {
				src: "http://cdn.fologde.com/6.png",
				man_img: [], // 男性头像
				woman_img: [], // 女性头像
				img_format: "http://cdn.fologde.com/avatar%s.png", // 头像地址 格式化用
				
				man_icon_select_index: null, // 如果选中了男性头像，则这里是选中的男性头像图标序号
				woman_icon_select_index: null, // 如果选中了女性头像，则这里是选中的女性头像图标序号
				current_select_avatar_url: "", // 当前选择的图片url
				
				isLogin: false, // 是否登录
				userinfo: {}, // 用户信息
			}
		},
		onLoad() {
			this.initAvatar()
		},
		onShow(){
			this.init()
		},
		methods: {
			// 保存头像
			saveAvatar(){
				console.log(this.current_select_avatar_url)
			},
			init(){
				this.isLogin = isLogin() ? true : false
				if(!this.isLogin){
					uni.showModal({
						title: "提示",
						content: "还未登录~",
						
						cancelText: "去上一页",
						confirmText: "去登录页",
						success: (res) => {
							// console.log(res)
							if(res.confirm){
								// 点击确定
								uni.redirectTo({
								    url: '/pages/login/login'
								})
							}
							
							if(res.cancel){
								// 点击取消
								uni.navigateBack()
							}
						}
					})
					return
				}
				
				this.userinfo = getLocalUserInfo()
			},
			lickBefore(){
				if('number' == typeof(this.woman_icon_select_index)){
					this.woman_img[this.woman_icon_select_index].is_select = false
					this.woman_icon_select_index = null
				}
				if('number' == typeof(this.man_icon_select_index)){
					this.man_img[this.man_icon_select_index].is_select = false
					this.man_icon_select_index = null
				}
			},
			// 计算当前选中的头像url
			currentSelectAvatar(){
				this.current_select_avatar_url = this.man_icon_select_index ? this.man_img[this.man_icon_select_index].icon : this.woman_img[this.woman_icon_select_index].icon
			},
			// 点击某个女性头像图标
			woman_avatar_cilck(index){
				this.lickBefore()
				this.woman_img[index].is_select = true
				this.woman_icon_select_index = index
				this.currentSelectAvatar()
			},
			// 点击某个男性头像图标
			man_avatar_cilck(index){
				this.lickBefore()
				this.man_img[index].is_select = true
				this.man_icon_select_index = index
				this.currentSelectAvatar()
			},
			// 查看头像大图
			showImg(img_url){
				uni.previewImage({
					urls: [img_url]
				})
			},
			// 初始化可选择的头像列表
			initAvatar(){
				// 处理男性头像
				for(let i = 1; i <= 20; i++){
					this.man_img.push({
						'icon': this.img_format.replace(/%s/, i < 10 ? '0' + i : i),
						'is_select': false
					})
				}
				
				// 处理女性头像
				for(let i = 21; i <= 40; i++){
					this.woman_img.push({
						'icon': this.img_format.replace(/%s/, i),
						'is_select': false
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/util/util.scss';
	.page{
		position: relative;
		padding-bottom: 100rpx;
		.selected {
			display: flex;
			flex-flow: row nowrap;
			border-bottom: 1px solid #F4F6F8;
			background-color: white;
			.current-avatar{
			}
		}
		.avatar-select-area{
			position: relative;
			// top: 200rpx;
			.select-area{
				position: relative;
				overflow: hidden;
				z-index: 10;
				.select-item{
					position: absolute;
					right: -80rpx;
					bottom: -70rpx;
					width: 130rpx;
					height: 130rpx;
					transform: rotate(220deg);
					z-index: 100;
					background-color: $main-color;
				}
			}
		}
	}
</style>
