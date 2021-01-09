/**
 * 用户设置相关的公共方法  如保存用户设置
 */

import {addSetting, getSetting} from '@/util/user_http/user-setting.js'

/**
 * 保存用户设置
 * @param {Object} user_id 用户id
 * @param {Object} name 保存的名称
 * @param {Object} value 保存的值
 */
export function _addSetting(user_id, name, value){
	
	addSetting({}, {data: {
		user_id: user_id,
		name: name,
		value: value
	}, custom: {loading: false}})
}

/**
 * 获取设置
 * @param {Object} user_id
 * @param {Object} name
 */
export function _getSetting(user_id, name){
	
	return getSetting({
		user_id: user_id,
		name: name,
	}, {custom: {loading: false}})
}