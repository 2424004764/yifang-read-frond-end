<template>
	<view class="page">
		<!-- 反馈输入区 -->
		<div class="feedback-area">
			<div class="feedback-input">
				<u-input placeholder="请输入你的反馈内容~，最多200个字" v-model="feedBackvalue" type="textarea" height="80" maxlength="200" />
			</div>
		</div>
		
		<!-- 提交按钮 -->
		<div class="submit">
			<u-button type="error" class="btn" ripple-bg-color="RGB(221,0,27)" :ripple="true" @click="confirm" :disabled="btn_disable">提交</u-button>
		</div>
	</view>
</template>

<script>
	import {
		isLogin,
		getLocalUserInfo
	} from '@/util/function/login.js'
	import {addFeedback} from '@/util/user_http/feedback.js'
	export default {
		data() {
			return {
				isLogin: false, // 是否登录
				userinfo: [],
				feedBackvalue: '', // 反馈内容
				btn_disable: true, // 提交按钮是否禁用
				Config: {}, // 全局配置
			}
		},
		onShow() {
			this.init()
		},
		mounted() {
			this.Config = this.$yifangConfig
		},
		
		onShareAppMessage(res) {
			let title = "意见反馈 - " + this.Config.appName
			
			return {
				title: title,
				path: '/pages/my/feedback'
			}
		},
		methods: {
			// 提交
			confirm(){
				this.init()
				if(!this.feedBackvalue)return;
				
				addFeedback({}, {
					data: {
						user_id: this.userinfo.user_id,
						feedback_content: this.feedBackvalue,
					}
				}).then(res => {
					if(0 == res.code){
						uni.showToast({
							title: "谢谢你的反馈！"
						})
						this.feedBackvalue = ''
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					}
				})
			},
			init() {
				this.isLogin = isLogin() ? true : false
				if(!this.isLogin){
					uni.switchTab({
						url: '/pages/my/my'
					})
					return
				}
				this.userinfo = getLocalUserInfo()
			}
		},
		watch: {
			feedBackvalue(n_v, o_l){
				if(!n_v){
					this.btn_disable = true
				}else{
					this.btn_disable = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/util/util.scss';
.page{
	padding: 20rpx;
	.feedback-area{
		margin-top: 20rpx;
		padding: 20rpx;
		// border: 1px solid red;
		background-color: #F2F5FA;
	}
}
.submit{
	margin-top: 60rpx;
	.btn{
		background-color: $main-color;
		margin-top: 20rpx;
	}
}
</style>
