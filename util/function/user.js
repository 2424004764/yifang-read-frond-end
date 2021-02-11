import {getLocalUserInfo, setLocalUserInfo} from '@/util/function/login.js'

/**
 * 更新用户的本地缓存信息  如头像、邮箱等
 * @param {Object} updateInfo 如 {sex: 1, user_nickname: '123'}
 */
export function updateUserLocalInfo(updateInfo){
	let userInfo = getLocalUserInfo()
	for (let field in updateInfo) {
		userInfo[field] = updateInfo[field]
	}
	
	setLocalUserInfo(userInfo)
}