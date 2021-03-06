import {getBookDetail} from '@/util/user_http/book.js'

/**
 * 公共的获取书籍详情的方法
 * @param {Object} book_id 书籍id
 */
export function getBookDetailUtil(book_id){
	if(!book_id){
		throw new Error("book_id 为空！")
	}
	return getBookDetail({
		book_id: book_id
	}, {
			custom: {loading: false}
		}).then(res => {
		// 处理书籍封面图
		try{
			res.data['book_cover_imgs'] = JSON.parse(res.data['book_cover_imgs'])
		}catch(err){
			// 图片为空
			res.data['book_cover_imgs'] = []
		}
		return Promise.resolve(res.data)
	}).catch(err => {
		return Promise.reject(err)
	})
}

/**
 * 获取第一章封面图
 * @param {string} CoverImgs 书籍封面图 可能多张
 */
export function calcBookCoverImgsGetFirst(CoverImgs){
	try{
		return JSON.parse(CoverImgs)[0]
	}catch(err){
		// 图片为空
		return ''
	}
}