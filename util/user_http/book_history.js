import axios from '../api/http'
const base_url = '/book-history'

/**
 * 添加阅读记录
 * @param {Object} params
 * @param {Object} options
 */
export function addReadHistory(params, options) {
	return axios.request(params, {
		...options,
		method: 'POST',
		url: `${base_url}/add-history`,
	})
}

/**
 * 获取阅读历史
 * @param {Object} params
 * @param {Object} options
 */
export function getHistoryList(params, options){
	return axios.request(params, {
		...options,
		method: 'GET',
		url: `${base_url}/get-history-list`,
	})
}

/**
 * 删除阅读历史
 * @param {Object} params
 * @param {Object} options
 */
export function delHistory(params, options){
	return axios.request(params, {
		...options,
		method: 'POST',
		url: `${base_url}/del-history`,
	})
}