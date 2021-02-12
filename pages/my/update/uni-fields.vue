<template>
	<view class="wrap">

		<u-form :model="redundancy_from" ref="uForm" :label-width="150" label-align="left">
			<u-form-item label="昵称" v-if="form.user_nickname.is_show" prop="user_nickname">
				<u-input v-model="redundancy_from.user_nickname" placeholder="请输入昵称"
				 maxlength="20" />
			</u-form-item>

			<u-form-item label="绑定邮箱" v-if="form.bind_email.is_show" prop="bind_email">
				<u-input v-model="redundancy_from.bind_email" placeholder="请输入邮箱" 
				 maxlength="100"/>
			</u-form-item>
		</u-form>

		<u-button type="primary" shape="square" style="margin-top: 100rpx;" class="btn"
		:loading="btn_loading" @click="update" :disabled="btn_disabled" 
		:ripple="true" >修改</u-button>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		isLogin,
		getLocalUserInfo
	} from '@/util/function/login.js'
	import {
		updateUserInfo
	} from '@/util/user_http/user.js'
	import {updateUserLocalInfo} from '@/util/function/user.js'
	export default {
		data() {
			return {
				userinfo: [], // 用户信息
				form: {
					user_nickname: {
						is_show: false,
						name: '昵称',
					},
					bind_email: {
						is_show: false,
						name: '绑定邮箱',
					},
					birthday: {
						is_show: false,
						name: '生日',
					},
				},
				redundancy_from: {
					user_nickname: '',
					bind_email: '',
					birthday: '',
				}, // 冗余一份数据  用来做效验用 form里有的值这里都要有
				isLogin: false, // 是否登录
				btn_loading: false, // 修改按钮是否loading
				btn_disabled: true, // 按钮是否可用
				
				rules: {
					user_nickname: [
						{ 
							required: true, 
							message: '昵称不能为空', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						}
					],
					bind_email: [
						{ 
							required: true, 
							message: '邮箱为空或格式错误', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
							type: 'email'
						}
					],
				}
			}
		},
		onLoad(option) {
			this.init()
			this.initFromItem(option)
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 冗余的表单值change
			redundancy_from_value_change(field_name){
				// 如果改的值和之前的值内容相同
				if(this.redundancy_from[field_name] != this.userinfo[field_name]){
					// 可以点击修改按钮
					this.btn_disabled = false
				}else{
					this.btn_disabled = true
				}
				
				// 如果改的值为空
				if(!this.redundancy_from[field_name]){
					this.btn_disabled = true
				}
			},
			// 更新用户信息
			updateUserInfo(){
				let updateData = {}
				for (let field in this.form) {
					if(this.form[field].is_show){
						updateData[field] = this.redundancy_from[field]
					}
				}
				updateUserInfo({}, {
					data: {
						user_id: this.userinfo.user_id,
						...updateData,
					}
				}).then(res => {
					this.btn_loading = false
					this.btn_disabled = true
					this.$refs.uToast.show({
						title: '修改成功！',
						type: 'success',
					})
				}).then(() => {
					// 更新用户本地缓存的信息
					updateUserLocalInfo(updateData)
					// 更新当前vue用户变量的值
					this.init()
				}).catch(err => {
					console.log(err)
				})
			},
			// 初始化表单值
			initFromItem(option) {
				// 初始化参数 和表单项
				let fields = option.fields.split(",")
				let _title = ''
				for (let field in fields) {
					this.form[fields[field]].is_show = true
					// 冗余数据处理
					this.redundancy_from[fields[field]] = this.userinfo[fields[field]]

					if (fields.length == 1) {
						_title = '修改' + this.form[fields[field]].name
					}
				}
				if (fields.length > 1) {
					_title = "修改信息"
				}

				uni.setNavigationBarTitle({
					title: _title
				})
			},
			// 修改用户信息
			update() {
				this.init()
				this.btn_loading = true
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.updateUserInfo()
					} else {
						this.btn_loading = false
					}
				})
			},
			init() {
				this.isLogin = isLogin() ? true : false
				if (!this.isLogin) {
					uni.showModal({
						title: "提示",
						content: "还未登录~",

						cancelText: "去上一页",
						confirmText: "去登录页",
						success: (res) => {
							console.log(res)
							if (res.confirm) {
								// 点击确定
								uni.redirectTo({
									url: '/pages/login/login'
								})
							}

							if (res.cancel) {
								// 点击取消
								uni.navigateBack()
							}
						}
					})
					return
				}

				this.userinfo = getLocalUserInfo()
			}
		},
		watch: {
			// 昵称改变
			'redundancy_from.user_nickname': function(n_v, o_v){
				this.redundancy_from_value_change('user_nickname')
			},
			// 绑定邮箱改变
			'redundancy_from.bind_email': function(n_v, o_v){
				this.redundancy_from_value_change('bind_email')
			},
		}
	}
</script>

<style lang="scss">
	@import '@/util/util.scss';
	.wrap {
		padding: 30rpx;
	}
	.btn{
		background-color: $main-color;
	}
	.u-wave-ripple{
		background-color: '#F5580B' !important;
	}
</style>
