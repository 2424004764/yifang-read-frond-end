import axios from '../api/http'
const base_url = '/book-chapter-content'


export function getChapterContent(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'GET',
      url: `${base_url}/get-chapter-content`,
    })
}
