import axios from '../api/http'
const base_url = '/book-schedule'

/**
 * 保存用户阅读某本书的阅读进度
 * @param {Object} params
 * @param {Object} options
 */
export function addSchedule(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'POST',
      url: `${base_url}/add-schedule`,
    })
}


/**
 * 获取用户阅读某本书的阅读进度
 * @param {Object} params
 * @param {Object} options
 */
export function getSchedule(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'GET',
      url: `${base_url}/get-schedule`,
    })
}
