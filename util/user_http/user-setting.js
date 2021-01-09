import axios from '../api/http'
const base_url = '/book-user-setting'

/**
 * 添加设置
 * @param {Object} params
 * @param {Object} options
 */
export function addSetting(params, options){
	return axios.request(params, {
	  ...options,
	  method: 'POST',
	  url: `${base_url}/add-setting`,
	})
}

/**
 * 获取设置
 * @param {Object} params
 * @param {Object} options
 */
export function getSetting(params, options){
	return axios.request(params, {
	  ...options,
	  method: 'POST',
	  url: `${base_url}/get-setting`,
	})
}