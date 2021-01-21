/**
 * 用户设置相关的公共方法  如保存用户设置
 */

	import {addSetting, getSetting} from '@/util/user_http/user-setting.js'
	import {isLogin, getLocalUserInfo} from '@/util/function/login.js'


let SETTINGS = {
	user_font_size: {
		num: 1, // 该配置对应的配置编号
		default: 18
	}, // 默认用户设置的字体大小  单位px
	background_color: {
		num: 2, // 该配置对应的配置编号
		default: '#F6F2EF'
	}, // 默认背景颜色
	user_font_color: {
		num: 3, // 该配置对应的配置编号
		default: '#000000'
	}, // 默认字体颜色
	letter_spacing: {
		num: 4, // 该配置对应的配置编号
		default: 2, // 默认值
	}, // 文字间距 单位rpx
	line_height: {
		num: 5, // 该配置对应的配置编号
		default: 50
	}, // 行间距 单位rpx
	padding_left_right: {
		num: 6, // 该配置对应的配置编号
		default: 40
	}, // 阅读区域左右空白区域间距 单位rpx
}

let SETTING_KEY = 'local_setting-'; // 设置的本地的键名前缀  如获取字体大小，则使用local_setting_font_size


/**
 * @param {Object} num 配置的编号
 */
function isInvalidSetting(num){
	for (let setting in SETTINGS) {
		if(num == SETTINGS[setting].num){
			return setting
		}
	}
	return false
}

/**
 * 保存一个配置到本地
 * @param {Object} name 配置的编号
 * @param {Object} value
 * @param {Bool} isSync 是否同步 默认异步
 */
function saveLocalSetting(num, value, isSync = false){
	
	// 鉴别无效配置
	let setting_name = isInvalidSetting(num)
	if(!setting_name)return;
	
	let key_name = SETTING_KEY + setting_name
	
	if(isSync){
		uni.setStorageSync(key_name, value)
	}else{
		uni.setStorage({
			key: key_name,
			data: value
		})
	}
}

/**
 * 从接口获取配置
 * @param {Object} nums 配置的编号，以逗号分隔
 * @param fn 回调函数，返回结果
 */
async function getApiSetting(nums, fn){
	await getSetting({
		user_id: getLocalUserInfo()['user_id'],
		name: nums,
	}, {custom: {loading: false}}).then(async res => {
		await fn(res)
	})
}

/**
 * 从本地获取一个配置
 * @param {Object} 配置的name
 * @param {Bool} isSync 是否同步
 */
function getLocalSetting(name, isSync = true){
	let key_name = SETTING_KEY + name
	
	if(isSync){
		return uni.getStorageSync(key_name)
	}else{
		// uni.getStorage(key_name)
	}
}

/**
 * 保存用户设置  先保存至本地  再通过接口保存
 * @param {Object} num 配置的编号
 * @param {Object} value 保存的值
 */
export function _addSetting(num, value){
	// 保存到本地
	if(false === saveLocalSetting(num, value))return;
	
	if(!isLogin())return;
	
	addSetting({}, {data: {
		user_id: getLocalUserInfo()['user_id'],
		name: num,
		value: value
	}, custom: {loading: false}}) // 不返回内容也可以  也不需要处理
}

/**
 * 获取设置  先从本地获取  没有再从接口获取
 * @param {Object} num 配置的编号
 */
export async function _getSetting(num){
	// 优化从本地获取配置
	if(!num)return;
	
	let nums = num.split(',') // 配置编号转成数组
	let data = {data:[]} // 要返回的数据
	let not_config_nums = [] // 没有的配置集合
	for (let num_index in nums) {
		// num_index = parseInt(num_index)
		let config_num = nums[num_index]
		let config_name = isInvalidSetting(config_num)
		let value = getLocalSetting(config_name)
		
		// 如果本地没有这个值 且已登录
		if(!value){
			// console.log('1 没有这个值', config_name)
			if(isLogin()){
				not_config_nums.push(config_num)
			}else{
				// 如果没有登录 则直接返回默认值即可
				value = SETTINGS[config_name]['default']
			}
		}else{
			data.data.push({
				name: parseInt(config_num),
				value: value
			})
		}
	}
	// 如果本地没有需要的配置 
	if(not_config_nums.length){
		// 说明已登录
		// console.log('2 not_config_nums', not_config_nums)
		await getApiSetting(not_config_nums.join(','), async function(res){
			// await console.log('3 getApiSetting', res.data)
			let _data = res.data
			for (let index in _data) {
				data.data.push({
					name: _data[index].name,
					value: _data[index].value
				})
				// 将设置保存到本地
				saveLocalSetting(_data[index].name, _data[index].value)
			}
		})
	}
	
	return Promise.resolve(data)
}