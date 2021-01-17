/**
 * 进度相关的操作方法
 */
import {addSchedule} from '@/util/user_http/book-schedule.js'


/**
 * 保存阅读进度 先判断有无进度，如果有则不保存
 * 因为是首次保存，所有需要进行判断，因为如果在阅读当前章节时，就会进行保存
 * 当再次进入该章节时，又会将阅读进度覆盖
 * @param {Object} user_id 用户id
 * @param {Object} book_id 书籍id
 * @param {Object} chapter_id 章节id
 * @param {Object} schedule 进度
 */
export function saveSchedule(user_id, book_id, chapter_id, schedule) {
	book_id = parseInt(book_id)
	
	addSchedule({}, {data: {
		user_id: user_id,
		book_id: book_id,
		chapter_id: chapter_id,
		schedule: schedule,
	}, custom: {loading: false}}).then(res => {
		
	})
}