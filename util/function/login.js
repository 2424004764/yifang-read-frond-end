let USERI_INFO_KEY = 'user-info'

/**
 * 注册之后的操作
 * @param {Object} data 用户注册的数据
 */
export function afterRegister(data){
	uni.setStorageSync(USERI_INFO_KEY, data)
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