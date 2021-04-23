/**
 * 进度相关的操作方法
 */
import {addSchedule, getSchedule} from '@/util/user_http/book-schedule.js'
import {isLogin, getLocalUserInfo} from '@/util/function/login.js'


// 保存到本地存储的键名
// 存储到本地的数据尽量简化
const SCHEDULE_KEY = "schedule-local"

// 保存到本地的进度的简化数据结构
let save_structure ={
	u: null, // 用户id
	b: null, // 书籍id
	c: null, // 章节id
	v: null, // 进度值
}

/**
 * 保存进度至本地
 * @param {Object} user_id
 * @param {Object} book_id
 * @param {Object} chapter_id
 * @param {Object} schedule_value
 */
export function saveToLocal(user_id, book_id, chapter_id, schedule_value){
	// console.log(schedule_value)
	save_structure.u = user_id
	save_structure.b = book_id
	save_structure.c = chapter_id
	save_structure.v = JSON.parse(schedule_value).value
	
	let value = JSON.stringify(save_structure)
	uni.setStorage({
	    key: SCHEDULE_KEY + book_id,
	    data: value,
	})
}

/**
 * 保存阅读进度 先判断有无进度，如果有则不保存
 * 因为是首次保存，所有需要进行判断，因为如果在阅读当前章节时，就会进行保存
 * 当再次进入该章节时，又会将阅读进度覆盖
 * 会同步保存至本地和云端
 * @param {Object} user_id 用户id
 * @param {Object} book_id 书籍id
 * @param {Object} chapter_id 章节id
 * @param {Object} schedule 进度
 */
export function saveSchedule(user_id, book_id, chapter_id, schedule) {
	book_id = parseInt(book_id)
	let schedule_obj = JSON.parse(schedule)
	
	// 保存进度至本地
	// 如果本地有当前书籍的章节的阅读进度  且进度未改变  则不保存
	let local_schedule = uni.getStorageSync(SCHEDULE_KEY+book_id) // 必有值
	try{
		let local_schedule_obj = JSON.parse(local_schedule)
		if(schedule_obj.value == local_schedule_obj.v &&
		book_id == local_schedule_obj.b &&
		chapter_id == local_schedule_obj.c)return;
	}catch(e){
		//TODO handle the exception
	}
	saveToLocal(user_id ? user_id : '', book_id, chapter_id, schedule)
	
	if(!isLogin())return;
	
	addSchedule({}, {data: {
		user_id: user_id,
		book_id: book_id,
		chapter_id: chapter_id,
		schedule: schedule,
	}, custom: {loading: false}}).then(res => {
		
	})
}


/**
 * 获取进度信息
 * @param {Object} params 参数
 * @param {Object} options 选项
 */
export function getScheduleInfo(params, options, fn){
	// 优先从本地获取
	let local_schedule = uni.getStorageSync(SCHEDULE_KEY+params.book_id)
	if(local_schedule){
		local_schedule = JSON.parse(local_schedule)
		// 本地有进度的保存记录
		fn( Promise.resolve({
			data: {
				user_id: local_schedule.u,
				book_id: local_schedule.b,
				chapter_id: local_schedule.c,
				schedule: `{"type": "scrollTop", "value": ${local_schedule.v}}`,
			}
		}) )
		return
	}
	
	// 本地没有记录
	if(!isLogin()){
		fn( Promise.resolve({
			data: null
		}) )
		return
	};
	
	params.user_id = getLocalUserInfo()['user_id']
	getSchedule(params, options).then(res => {
		if(res.data){
			let data = res.data
			// 数据库存在记录
			// 先异步保存至本地  再返回
			saveToLocal(data.user_id, data.book_id, data.chapter_id, data.schedule)
			// 返回
			fn( Promise.resolve(res) )
		}else{
			fn( Promise.resolve({
				data: null
			}) )
		}
	})
}