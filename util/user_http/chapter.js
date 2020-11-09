import axios from '../api/http'
const base_url = '/book-chapter'


export function getChapterList(params, options) {
    return axios.request(params, {
      ...options,
	  method: 'GET',
      url: `${base_url}/get-chapter-list`,
    })
}
