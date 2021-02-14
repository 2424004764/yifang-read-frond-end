import axios from '../api/http'
const base_url = '/book-history'

/**
 * 添加阅读记录
 * @param {Object} params
 * @param {Object} options
 */
export function getReadHistory(params, options) {
	return axios.request(params, {
		...options,
		method: 'POST',
		url: `${base_url}/add-history`,
	})
}