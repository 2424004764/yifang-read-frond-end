import axios from '../api/http'
const base_url = '/book-feedback'


export function addFeedback(params, options) {
	return axios.request(params, {
		...options,
		method: 'POST',
		url: `${base_url}/add-feedback`,
	})
}
