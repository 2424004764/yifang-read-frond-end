<template>
	<view class="read-body" @click.stop>
		<!-- 设置项 -->
		<div class="s-item">
			<!-- 控制字体、大小 -->
			<div class="btn">
				<u-button throttle-time="50" shape="circle" class="font-reduce font" @click="font_reduce" :ripple="true"
				 :customStyle="uButtonCustomStyle" :style="[uButtonFontSizeCustomStyle]">A-</u-button>
			</div>
			<div class="font-size">{{user_font_size}}</div>
			<div class="btn">
				<u-button throttle-time="50" shape="circle" class="font-enlarge font" @click="font_enlarge" :ripple="true"
				  :customStyle="uButtonCustomStyle" :style="[uButtonFontSizeCustomStyle]">A+</u-button>
			</div>
		</div>

		<!-- 字体颜色 -->
		<!-- doto 各个增加、减少的按钮的事件还没写 -->
		<div class="setting-item">
			<div class="title">字体颜色</div>
			<div class="bg-color">
				<div class="color-scolle">
					<div class="item" v-for="(item, index) in font_bg_list" :key="index">
						<div class="btn">
							<u-button :style="{backgroundColor: item.color}" throttle-time="50" shape="circle" class="bg" :ripple="true"
							 @click="font_color_change(item.color)" :customStyle="uButtonCustomStyle">
							 <!-- #ifdef MP-WEIXIN -->
							 <div :style="{backgroundColor: item.color, padding: '80rpx'}"></div>
							 <!-- #endif -->
							 </u-button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 字间距 -->
		<div class="setting-item">
			<div class="title">字间距</div>
			<view class="wrap">
				<div class="reduce-btn" :style="{visibility: letter_spacing > 0 ? 'inherit' : 'collapse'}">
					<u-button throttle-time="50" shape="circle" class="btn" :ripple="true" @click="letterSpacingStep(false)"
					 :customStyle="uButtonCustomStyle">
						<u-icon name="minus" size="35"></u-icon>
					</u-button>
				</div>
				<div class="slider">
					<slider :value="letter_spacing" @changing="letterSpacingChanging" @change="letterSpacingChange" show-value="true"
					 :step="letter_spacing_step" :max="letter_spacing_max" />
				</div>
				<div class="add-btn" :style="{visibility: letter_spacing < letter_spacing_max ? 'inherit' : 'collapse'}">
					<u-button throttle-time="50" shape="circle" class="btn" :ripple="true" @click="letterSpacingStep(true)"
					 :customStyle="uButtonCustomStyle">
						<u-icon name="plus" size="35"></u-icon>
					</u-button>
				</div>
			</view>
		</div>

		<!-- 行间距 -->
		<div class="setting-item">
			<div class="title">行间距</div>
			<view class="wrap">
				<div class="reduce-btn">
					<u-button throttle-time="50" shape="circle" class="btn" :ripple="true" :customStyle="uButtonCustomStyle">
						<u-icon name="minus" size="35"></u-icon>
					</u-button>
				</div>
				<div class="slider">
					<slider :value="line_height" @changing="lineHeightChanging" @change="lineHeightChange" show-value="true" step="2"
					 min="50" />
				</div>
				<div class="add-btn">
					<u-button throttle-time="50" shape="circle" class="btn" :ripple="true" :customStyle="uButtonCustomStyle">
						<u-icon name="plus" size="35"></u-icon>
					</u-button>
				</div>
			</view>
		</div>

		<!-- 左右空白间距 -->
		<div class="setting-item">
			<div class="title">左右空白间距</div>
			<view class="wrap">
				<div class="reduce-btn">
					<u-button throttle-time="50" shape="circle" class="btn" :ripple="true" :customStyle="uButtonCustomStyle">
						<u-icon name="minus" size="35"></u-icon>
					</u-button>
				</div>
				<div class="slider">
					<slider :value="padding_left_right" @changing="paddingLeftRightChanging" @change="paddingLeftRightChange"
					 show-value="true" step="2" max="40" />
				</div>
				<div class="add-btn">
					<u-button throttle-time="50" shape="circle" class="btn" :ripple="true" :customStyle="uButtonCustomStyle">
						<u-icon name="plus" size="35"></u-icon>
					</u-button>
				</div>
			</view>
		</div>

		<!-- 背景颜色 -->
		<div class="setting-item">
			<div class="title">背景颜色</div>
			<div class="bg-color">
				<div class="color-scolle">
					<div class="item" v-for="(item, index) in bg_list" :key="index" :style="{'background-color': item.color}" @click="bg_color_change(item.color)"></div>
				</div>
			</div>
		</div>

	</view>
</template>

<script>
	import {
		_addSetting,
		_getSetting
	} from '@/util/function/user-setting.js'
	import {
		isLogin,
		getLocalUserInfo
	} from '@/util/function/login.js'

	export default {
		name: "yifnagReadSetting",
		data() {
			return {
				t1: null, // 定时器
				t2: null, // 定时器
				t3: null, // 定时器
				t4: null, // 定时器
				t5: null, // 定时器
				t6: null, // 定时器
				t7: null, // 定时器

				letter_spacing: 2, // 文字间距 单位rpx
				letter_spacing_step: 2, // 文字step 步进值
				letter_spacing_max: 100, // 文字最大值

				line_height: 50, // 行间距 单位rpx
				padding_left_right: 40, // 阅读区域左右空白区域间距 单位rpx
				user_font_size: 18, // 默认用户设置的字体大小  单位px
				background_color: '#F6F2EF', // 默认背景颜色
				user_font_color: '#000000', // 默认字体颜色

				bg_list: [{
						'color': '#F6F2EF'
					}, {
						'color': '#FFFAE8'
					}, {
						'color': '#F4E7BD'
					},
					{
						'color': '#CFA656'
					}, {
						'color': '#EADACA'
					}, {
						'color': '#E0EDCA'
					},
					{
						'color': '#FBE5DA'
					},
				], // 背景颜色列表
				font_bg_list: [{
					'color': '#000000'
				}, {
					'color': '#ffffff'
				}], // 字体颜色列表

				uButtonCustomStyle: {
					// #ifdef MP-WEIXIN
					height: "60rpx",
					backgroundColor: "#FEFAC4",
					// #endif
				}, // u-btn 自定义样式
				
				uButtonFontSizeCustomStyle: {
					// #ifdef MP-WEIXIN
					padding: "0",
					// #endif
				}, // 修改字体大小的自定义样式
			}
		},
		mounted() {
			// 默认反馈
			// 颜色反馈
			this.$emit('backgroundColor', this.background_color)
			// 默认字体颜色反馈
			this.$emit('fontColorChange', this.user_font_color)
			// 统一返回配置 以后有新配置了 用这样统一返回
			this.uniReturnSettings()
			// 获取配置
			this.getSetting()
		},
		computed: {
			
		},
		methods: {
			// 左右空白间距改变 完成一次拖动后触发的事件
			paddingLeftRightChange(e) {
				let that = this
				if (that.t1) {
					clearInterval(that.t1)
				}

				// 保存左右空白间距改变
				that.t1 = setTimeout(() => {
					that.saveSetting(6, that.padding_left_right)
				}, 1000)
			},
			// 左右空白间距改变 拖动过程中触发的事件
			paddingLeftRightChanging(e) {
				this.padding_left_right = e.detail.value
				this.uniReturnSettings()
			},
			// 行间距改变 完成一次拖动后触发的事件
			lineHeightChange(e) {
				let that = this
				if (that.t2) {
					clearInterval(that.t2)
				}

				// 保存左右空白间距改变
				that.t2 = setTimeout(() => {
					that.saveSetting(5, that.line_height)
				}, 1000)
			},
			// 行间距改变 拖动过程中触发的事件
			lineHeightChanging(e) {
				// console.log(e.detail)
				this.line_height = e.detail.value
				this.uniReturnSettings()
			},
			// 点击减少或增加的按钮
			letterSpacingStep(is_add, letterSpacing = 0) {
				if (is_add) {
					letterSpacing = this.letter_spacing + this.letter_spacing_step
				} else {
					letterSpacing = this.letter_spacing - this.letter_spacing_step
				}
				if (letterSpacing < 0 || (this.letter_spacing > this.letter_spacing_max && is_add)) return;
				let e = {
					detail: {
						value: letterSpacing
					}
				}
				this.letterSpacingChange(e)
				this.letterSpacingChanging(e)
			},
			// 文字间距改变 拖动完成触发的事件
			letterSpacingChange(e) {
				this.letter_spacing = e.detail.value

				let that = this
				if (that.t3) {
					clearInterval(that.t3)
				}
				// 保存用户字体颜色

				that.t3 = setTimeout((() => {
					that.saveSetting(4, that.letter_spacing)
				}).bind(this), 1000)
			},
			// 文字间距改变 拖动过程中触发的事件
			letterSpacingChanging(e) {
				// console.log(e.detail)

				this.letter_spacing = e.detail.value
				this.uniReturnSettings()
			},
			// 统一返回配置
			uniReturnSettings() {
				this.$emit('userSetting', {
					letter_spacing: this.letter_spacing, // 文字间距
					line_height: this.line_height, // 行间距
					padding_left_right: this.padding_left_right, // 左右的空白区域
					font_size: this.user_font_size, // 字体大小
				})
			},
			// 点击字体颜色 字体颜色改变
			font_color_change(color) {
				this.user_font_color = color
				this.$emit('fontColorChange', this.user_font_color)

				let that = this
				// 保存用户字体颜色
				this.$u.debounce(function() {
					that.saveSetting(3, that.user_font_color)
				}, 1000)
			},
			// 获取用户设置 优先本地缓存
			getSetting() {

				let settings_index = '1,2,3,4,5,6'
				_getSetting(settings_index).then(res => {
					// console.log('20 _getSetting', res)
					for (let name in res.data) {
						let value = res.data[name].value
						switch (res.data[name].name) {
							case 1: // 字体大小
								value = parseInt(value)
								this.user_font_size = value
								this.$emit('fontSize', value)
								break;
							case 2: // 背景颜色
								this.background_color = value
								this.$emit('backgroundColor', value)
								// 将用户设置的颜色放到最前面
								for (let colorIndex in this.bg_list) {
									if (value == this.bg_list[colorIndex].color) {
										// console.log(value)
										let tmp = this.bg_list[colorIndex]
										this.bg_list.splice(colorIndex, 1)
										this.bg_list.unshift(tmp)
									}
								}
								break;
							case 3: // 字体颜色
								this.user_font_color = value
								this.$emit('fontColorChange', this.user_font_color)
								break
							case 4: // 字间距
								this.letter_spacing = value
							case 5: // 行间距
								this.line_height = value
							case 6: // 左右空白区域
								this.padding_left_right = value
								this.uniReturnSettings()
								break

						}
					}
					// 加载完配置后 再获取章节。获取完章节后，会自动再获取章节内容
					this.$emit('doLoadChapterList')
				})
			},
			// 保存用户的配置
			saveSetting(name, value) {

				_addSetting(name, value)
			},
			// 背景颜色改变
			bg_color_change(bg_color) {
				this.background_color = bg_color
				this.$emit('backgroundColor', this.background_color)

				let that = this
				this.$u.debounce(function() {
					that.saveSetting(2, that.background_color)
				}, 1000)
			},
			// 点击字体变小
			font_reduce() {
				--this.user_font_size
				this.uniReturnSettings()

				let that = this
				this.$u.debounce(function() {
					console.log(that.user_font_size)
					that.saveSetting(1, that.user_font_size)
				}, 1000)
			},
			// 点击字体变大
			font_enlarge() {
				++this.user_font_size
				this.uniReturnSettings()

				let that = this
				this.$u.debounce(function() {
					console.log(that.user_font_size)
					that.saveSetting(1, that.user_font_size)
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$background-color: #FEFAC4;
	$btn-height: 60rpx;

	.read-body {
		// border: 1px solid red;
		box-sizing: border-box;
		position: absolute;
		bottom: 0rpx;
		// #ifdef H5
		bottom: 88rpx;
		// #endif
		left: 0rpx;
		width: 100%;
		padding: 40rpx;
		background-color: $background-color;

		.setting-item {
			padding-bottom: 20rpx;

			.title {
				margin-top: 20rpx;
			}

			.wrap {
				display: flex;
				flex-flow: row nowarp;

				.reduce-btn,
				.add-btn {
					// border: 1px solid red;
					margin-top: 8rpx;
					flex: 1;

					.btn {
						height: $btn-height;
						background-color: $background-color;
						line-height: $btn-height;
					}
				}

				.slider {
					// border: 1px solid red;
					margin-left: 16rpx;
					flex: 8;
				}
			}
		}

		.s-item {
			// border: 1px solid red;
			// overflow: auto;
			margin-top: 20rpx;
			padding-bottom: 20rpx;
			display: flex;

			.font {
				height: $btn-height;
				border-radius: 37rpx;
				padding: 0rpx 50rpx;
				background-color: $background-color;
				// border: 1px solid red;
			}

			.font-size {
				height: $btn-height;
				line-height: $btn-height;
				text-align: center;
				width: 70rpx;
				// border: 1px solid red;
				margin: 0rpx 20rpx 0rpx 20rpx;
			}

			&::before {
				content: '';
				display: inline-block;
				clear: both;
			}
		}

		.bg-color {
			// 加高度是为了遮盖横向滚动条
			height: 70rpx;
			// #ifdef H5
			height: 68rpx;
			// #endif
			overflow: hidden;
			clear: both;
			// height: 60rpx;
			margin-top: 10rpx;

			// overflow-x: auto;
			.color-scolle {
				overflow-x: auto;
				white-space: nowrap;
				padding: 0rpx 0rpx 15rpx 0rpx;
			}

			.item {
				width: 130rpx;
				height: 60rpx;
				border: none;
				border-radius: 37rpx;
				display: inline-block;
			}

			.item:not(:first-child) {
				margin-left: 3%;
			}

			.btn {
				.bg {
					height: 64rpx;
					background-color: $background-color;
					border: none;
				}
			}
		}

		.wrap {
			height: 40rpx;
			width: 95%;
			margin: 0 auto;
			margin-top: 20rpx;
		}
	}
</style>
