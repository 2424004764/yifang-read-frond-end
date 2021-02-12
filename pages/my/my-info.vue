<template>
	<view class="page">

		<u-cell-group>
			<u-cell-item title="头像" arrow-direction="right" @click="toAvatar">
				<u-avatar :src="userinfo.user_headimg" :show-sex="sex_icon ? true : false" :sex-icon="sex_icon" :sex-bg-color="sex_icon_bgcl"></u-avatar>
			</u-cell-item>
			<u-cell-item title="昵称" @click="editFidlds('user_nickname')">
				{{userinfo.user_nickname}}
			</u-cell-item>
			<u-cell-item title="一方书号" :arrow="false" hover-class="none">
				{{userinfo.user_id}}
			</u-cell-item>
			<u-cell-item title="绑定邮箱" hover-class="none" @click="editFidlds('bind_email')">
				{{userinfo.bind_email}}
			</u-cell-item>
			<u-cell-item title="生日" @click="birthday_select">
				{{userinfo.birthday}}
				<u-calendar v-model="show_birthday_select" :mode="mode" @change="birthdayChange"></u-calendar>
			</u-cell-item>
			<u-cell-item title="性别" @click="show_sex_select = true">
				{{sex_text}}
				<u-select :default-value="[userinfo.sex]" v-model="show_sex_select" :list="list" @confirm="sexConfirm"></u-select>
			</u-cell-item>
			<u-cell-item title="注册时间" :arrow="false" hover-class="none">
				{{userinfo.create_on}}
			</u-cell-item>
		</u-cell-group>

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
				isLogin: false, // 是否登录
				userinfo: [], // 用户信息
				sex_text: '', 
				sex_icon: '', // 性别图标
				list: [
					{
						value: '0',
						label: '保密'
					},
					{
						value: '1',
						label: '男'
					},
					{
						value: '2',
						label: '女'
					}
				],
				sex_icon_bgcl: '', // 性别图标颜色
				
				show_birthday_select: false,
				show_sex_select: false,
				mode: 'date',
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			// 性别选择
			sexConfirm(e){
				let _sex = e[0].value
				if(_sex == this.userinfo.sex)return;
				let updateData = {
					sex: _sex,
				}
				this.updateUserInfo(updateData)
			},
			updateUserInfo(updateData){
				updateUserInfo({}, {
					data: {
						user_id: this.userinfo.user_id,
						...updateData,
					}
				}).then(res => {
					this.$refs.uToast.show({
						title: '修改成功！',
						type: 'success',
					})
					// 更新用户本地缓存的信息
					updateUserLocalInfo(updateData)
					// 更新当前vue用户变量的值
					this.init()
				})
			},
			// 生日选择change
			birthdayChange(e){
				let updateData = {
					birthday: e.result,
				}
				this.updateUserInfo(updateData)
			},
			// 选择日历
			birthday_select(){
				this.show_birthday_select = true
			},
			// 统一的修改字段的页面 可控制可以修改那些字段
			editFidlds(field_name) {
				uni.navigateTo({
					url: "./update/uni-fields?fields=" + field_name,
				})
			},
			// 去修改头像页面
			toAvatar() {
				uni.navigateTo({
					url: "update/avatar"
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

				this.loadUserInfo()
			},
			// 处理用户信息
			loadUserInfo() {
				// 从本地缓存加载用户信息 因为展示用户信息的组件需要的字段类型不一致  所以需要做一下转换
				let _temInfo = getLocalUserInfo()
				_temInfo.user_id = _temInfo.user_id + ""
				// 处理用户性别
				let _temSex = '' // 性别图标
				let _temSexCl = '' // 性别图标颜色
				let _sex_text = ''
				_temInfo.sex = parseInt(_temInfo.sex)
				switch (_temInfo.sex) {
					case 0:
						_temSex = 'question' // 疑问号
						_temSexCl = 'error'
						_sex_text = '保密'
						break
					case 1:
						_temSex = 'man'
						_temSexCl = 'primary'
						_sex_text = '男'
						break
					case 2:
						_temSex = 'woman'
						_temSexCl = 'error'
						_sex_text = '女'
						break
					default:

						break
				}
				this.sex_text = _sex_text
				this.sex_icon = _temSex
				this.sex_icon_bgcl = _temSexCl
				_temInfo.create_on = _temInfo.create_on.substr(0, 11)

				this.userinfo = _temInfo
			},
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #ededed;
	}

	.user-box {
		background-color: #fff;
	}

	.list-item {
		// border: 1px solid red;
		padding: 30rpx 10rpx;
		border-top: 1px solid #C0C0C0;
	}
</style>
