let USERI_INFO_KEY = 'user-info'

/**
 * 设置登录态  在注册或者登录后
 * @param {Object} data 用户注册或登录的数据
 */
export function setLoginStatu(data, msg){
	let duration = 1000
	uni.showToast({
		mask: true,
		title: msg,
		duration: duration,
		icon: 'none'
	})
	uni.setStorageSync(USERI_INFO_KEY, data)
	setTimeout(function(){
		// console.log('reg settimeout')
		uni.switchTab({
		    url: '/pages/my/my'
		})
	}, duration)
}

/**
 * 是否登录
 */
export function isLogin(){
	let userInfo = uni.getStorageSync(USERI_INFO_KEY)
	if(userInfo && userInfo.hasOwnProperty('user_id')){
		return true
	}
	return false
}

/**
 * 获取本地用户信息
 */
export function getLocalUserInfo(){
	return uni.getStorageSync(USERI_INFO_KEY)
}