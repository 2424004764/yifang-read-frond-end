<template>
	<view class="read-body" @click.stop>
		<!-- 设置项 -->
		<div class="s-item">
			<!-- 控制字体、大小 -->
			<div class="font-reduce font" @click="font_reduce">A-</div>
			<div class="font-size">{{user_font_size}}</div>
			<div class="font-enlarge font" @click="font_enlarge">A+</div>
		</div>
		
		<!-- 字体颜色 -->
		<div class="setting-item">
			<div class="title">字体颜色</div>
			<div class="bg-color">
				<div class="color-scolle">
					<div class="item" v-for="(item, index) in font_bg_list" :key="index"
					:style="{'background-color': item.color}"
					@click="font_color_change(item.color)"></div>
				</div>
			</div>
		</div>
		
		<!-- 字间距 -->
		<div class="setting-item">
			<div class="title">字间距</div>
			<view class="wrap">
				 <slider :value="letter_spacing" @changing="letterSpacingChanging"
				   show-value="true" step="2" max="50" />
			</view>
		</div>
		
		<!-- 行间距 -->
		<div class="setting-item">
			<div class="title">行间距</div>
			<view class="wrap">
				 <slider :value="line_height" @changing="lineHeightChanging"
				 @change="lineHeightChange"
				  show-value="true" step="2" min="50" />
			</view>
		</div>
		
		<!-- 左右空白间距 -->
		<div class="setting-item">
			<div class="title">左右空白间距</div>
			<view class="wrap">
				 <slider :value="padding_left_right" @changing="paddingLeftRightChanging"
				 @change="paddingLeftRightChange"
				  show-value="true" step="2" max="40" />
			</view>
		</div>
		
		<!-- 背景颜色 -->
		<div class="setting-item">
			<div class="title">背景颜色</div>
			<div class="bg-color">
				<div class="color-scolle">
					<div class="item" v-for="(item, index) in bg_list" :key="index"
					:style="{'background-color': item.color}"
					@click="bg_color_change(item.color)"></div>
				</div>
			</div>
		</div>
		
	</view>
</template>

<script>
	import {_addSetting, _getSetting} from '@/util/function/user-setting.js'
	import {isLogin, getLocalUserInfo} from '@/util/function/login.js'
	
	import YifangChapterList from '@/components/yifang/yifang-chapter-list/yifang-chapter-list.vue'
	
	export default {
		name: "yifnagReadSetting",
		data() {
			return {
				t1: null, // 定时器
				t2: null, // 定时器
				letter_spacing: 2, // 文字间距 单位rpx
				line_height: 50, // 行间距 单位rpx
				padding_left_right: 40, // 阅读区域左右空白区域间距 单位rpx
				user_font_size: 18, // 默认用户设置的字体大小  单位px
				background_color: '#F6F2EF', // 默认背景颜色
				user_font_color: '#000000', // 默认字体颜色
				bg_list: [
					{'color': '#F6F2EF'}, {'color': '#FFFAE8'}, {'color': '#F4E7BD'},
					{'color': '#CFA656'}, {'color': '#EADACA'}, {'color': '#E0EDCA'},
					{'color': '#FBE5DA'},
				], // 背景颜色列表
				font_bg_list: [
					{'color': '#000000'}, {'color': '#ffffff'}
				], // 字体颜色列表
			}
		},
		mounted() {
			// 默认反馈
			// 字体反馈
			this.$emit('fontSize', this.user_font_size)
			// 颜色反馈
			this.$emit('backgroundColor', this.background_color)
			// 默认字体颜色反馈
			this.$emit('fontColorChange', this.user_font_color)
			// 统一返回配置 以后有新配置了 用这样统一返回
			this.uniReturnSettings()
			// 获取配置
			this.getSetting()
		},
		methods:{
			// 左右空白间距改变 完成一次拖动后触发的事件
			paddingLeftRightChange(e){
				let that = this
				if(that.t1){
					clearInterval(that.t1)
				}
				
				// 保存左右空白间距改变
				that.t1 = setTimeout((() => {
					that.saveSetting(6, that.padding_left_right)
				}).bind(this), 1000)
			},
			// 左右空白间距改变 拖动过程中触发的事件
			paddingLeftRightChanging(e){
				this.padding_left_right = e.detail.value
				this.uniReturnSettings()
			},
			// 行间距改变 完成一次拖动后触发的事件
			lineHeightChange(e){
				let that = this
				if(that.t2){
					clearInterval(that.t2)
				}
				
				// 保存左右空白间距改变
				that.t2 = setTimeout(() => {
					that.saveSetting(5, that.line_height)
				}, 1000)
			},
			// 行间距改变 拖动过程中触发的事件
			lineHeightChanging(e){
				// console.log(e.detail)
				this.line_height = e.detail.value
				this.uniReturnSettings()
			},
			// 文字间距改变 拖动过程中触发的事件
			letterSpacingChanging(e){
				// console.log(e.detail)
				
				this.letter_spacing = e.detail.value
				this.uniReturnSettings()
				
				let that = this
				// 保存用户字体颜色
				this.$u.debounce(function(){
					that.saveSetting(4, that.letter_spacing)
				}, 1000)
			},
			// 统一返回配置
			uniReturnSettings(){
				this.$emit('userSetting', {
					letter_spacing: this.letter_spacing, // 文字间距
					line_height: this.line_height, // 行间距
					padding_left_right: this.padding_left_right, // 左右的空白区域
				})
			},
			// 点击字体颜色 字体颜色改变
			font_color_change(color){
				this.user_font_color = color
				this.$emit('fontColorChange', this.user_font_color)
				
				let that = this
				// 保存用户字体颜色
				this.$u.debounce(function(){
					that.saveSetting(3, that.user_font_color)
				}, 1000)
			},
			// 获取用户设置
			getSetting(){
				if(!isLogin())return;
				
				let settings_index = '1,2,3,4,5,6'
				_getSetting(getLocalUserInfo()['user_id'], settings_index).then(res => {
					// console.log(res)
					for (let name in res.data) {
						let value = res.data[name].value
						switch(res.data[name].name){
							case 1: // 字体大小
								value = parseInt(value)
								this.user_font_size = value
								this.$emit('fontSize', value)
								break;
							case 2:// 背景颜色
								this.background_color = value
								this.$emit('backgroundColor', value)
								// 将用户设置的颜色放到最前面
								for (let colorIndex in this.bg_list) {
									if(value == this.bg_list[colorIndex].color){
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
					// 目的  要加载另一个组件的方法，且要保证另一个组件的mounted钩子执行
					this.$emit('doLoadChapterList')
				})
			},
			// 保存用户的配置
			saveSetting(name, value){
				if(!isLogin())return;
				
				_addSetting(getLocalUserInfo()['user_id'], name, value)
			},
			// 背景颜色改变
			bg_color_change(bg_color){
				this.background_color = bg_color
				this.$emit('backgroundColor', this.background_color)
				
				let that = this
				this.$u.debounce(function(){
					that.saveSetting(2, that.background_color)
				}, 1000)
			},
			// 点击字体变小
			font_reduce(){
				--this.user_font_size
				this.$emit('fontSize', this.user_font_size)
				
				let that = this
				this.$u.debounce(function(){
					that.saveSetting(1, that.user_font_size)
				}, 1000)
			},
			// 点击字体变大
			font_enlarge(){
				++this.user_font_size
				this.$emit('fontSize', this.user_font_size)
				
				let that = this
				this.$u.debounce(function(){
					that.saveSetting(1, that.user_font_size)
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
.read-body{
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
	background-color: #FEFAC4;
	.setting-item{
		.title{
			margin-top: 20rpx;
		}
	}
	.s-item{
		// border: 1px solid red;
		overflow: auto;
		margin-top: 20rpx;
		div{
			float: left;
			height: 60rpx;
			line-height: 60rpx;
		}
		.font{
			border: 1px solid #A3855F;
			border-radius: 37rpx;
			padding: 0rpx 60rpx;
		}
		.font-size{
			margin: 0rpx 20rpx 0rpx 20rpx;
		}
		&::before{
			content: '';
			display: inline-block;
			clear: both;
		}
	}
	.bg-color{
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
		.color-scolle{
			overflow-x: auto;
			white-space: nowrap;
			padding: 0rpx 0rpx 15rpx 0rpx;
		}
		.item{
			width: 130rpx;
			height: 60rpx;
			border: none;
			border-radius: 37rpx;
			display: inline-block;
		}
		.item:not(:first-child){
			margin-left: 3%;
		}
	}
	.wrap{
		height: 40rpx;
		width: 95%;
		margin: 0 auto;
		margin-top: 20rpx;
	}
}
</style>
