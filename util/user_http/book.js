import axios from '../api/http'
const base_url = '/book-book'


export function getBookList(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'GET',
      url: `${base_url}/get-book-list`,
    })
}

export function getBookDetail(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'GET',
      url: `${base_url}/get-book-detail-by-id`,
    })
}