import axios from '../api/http'
const base_url = '/book-system-config'

/**
 * 获取小程序首页轮播图
 * @param {Object} params
 * @param {Object} options
 */
export function getSwiperImages(params, options) {
	return axios.request(params, {
		...options,
		method: 'GET',
		url: `${base_url}/get-swiper-images`,
	})
}