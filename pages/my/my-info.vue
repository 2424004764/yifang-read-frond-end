<template>
	<view class="page">
		<u-card :full="true" :show-head="false" :show-foot="false">
			<view class="" slot="body">
				<u-section :show-line="false" title="头像" :arrow="false">
					<view slot="right">
						<!-- <navigator url="update/avatar"> -->
							<u-avatar :src="userinfo.user_headimg" :show-sex="sex_icon ? true : false" :sex-icon="sex_icon" :sex-bg-color="sex_icon_bgcl" @click="toAvatar"></u-avatar>
						<!-- </navigator> -->
					</view>
				</u-section>
				
				<u-section :show-line="false" class="list-item" title="昵称" :sub-title="userinfo.user_nickname" :arrow="false"></u-section>
				
				<u-section :show-line="false" class="list-item" title="一方书号" :sub-title="userinfo.user_id" :arrow="false"></u-section>
				
				<u-section :show-line="false" class="list-item" title="绑定邮箱" :sub-title="userinfo.bind_email" :arrow="false"></u-section>
				
				<u-section :show-line="false" class="list-item" title="生日" :sub-title="userinfo.birthday" :arrow="false"></u-section>
				
				<u-section :show-line="false" class="list-item" title="注册时间" :sub-title="userinfo.create_on" :arrow="false"></u-section>
			</view>
		</u-card>
	</view>
</template>

<script>
	import {isLogin, getLocalUserInfo} from '@/util/function/login.js'
	export default {
		data() {
			return {
				isLogin: false, // 是否登录
				userinfo: [], // 用户信息
				sex_icon: '', // 性别图标
				sex_icon_bgcl: '', // 性别图标颜色
			}
		},
		onShow(){
			this.init()
		},
		methods: {
			// 去修改头像页面
			toAvatar(){
				uni.navigateTo({
					url: "update/avatar"
				})
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
							console.log(res)
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
				
				this.loadUserInfo()
			},
			// 处理用户信息
			loadUserInfo(){
				// 从本地缓存加载用户信息 因为展示用户信息的组件需要的字段类型不一致  所以需要做一下转换
				let _temInfo = getLocalUserInfo()
				_temInfo.user_id = _temInfo.user_id + ""
				// 处理用户性别
				let _temSex = '' // 性别图标
				let _temSexCl = '' // 性别图标颜色
				switch(_temInfo.sex){
					case 0:
						_temSex = 'question' // 疑问号
						_temSexCl = 'error'
						break
					case 1:
						_temSex = 'man'
						_temSexCl = 'primary'
						break
					case 2:
						_temSex = 'woman'
						_temSexCl = 'error'
						break
					default:
						
						break
				}
				this.sex_icon = _temSex
				this.sex_icon_bgcl = _temSexCl
				
				this.userinfo = _temInfo
			},
		}
	}
</script>

<style scoped lang="scss">
.list-item{
	// border: 1px solid red;
	padding: 30rpx 10rpx;
	border-top: 1px solid #C0C0C0;
}
</style>
