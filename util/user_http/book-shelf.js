import axios from '../api/http'
const base_url = '/book-bookshelf'

/**
 * 加入书架
 * @param {Object} params
 * @param {Object} options
 */
export function joinBookshelf(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'POST',
      url: `${base_url}/join-bookshelf`,
    })
}

/**
 * 是否加入书架
 * @param {Object} params
 * @param {Object} options
 */
export function isJoinBookshelf(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'get',
      url: `${base_url}/is-join-book-shelf`,
    })
}

/**
 * 获取加入到书架的书籍列表
 * @param {Object} params
 * @param {Object} options
 */
export function getBookshelfList(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'get',
      url: `${base_url}/get-list`,
    })
}

/**
 * 获取加入到书架的书籍列表
 * 直接一条通过SQL获取按阅读时间倒序的书籍列表
 * @param {Object} params
 * @param {Object} options
 */
export function getBookshelfListV2(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'get',
      url: `${base_url}/get-list-v2`,
    })
}