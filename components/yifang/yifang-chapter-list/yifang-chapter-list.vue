<template>
	<view class="chapter-list-body">
		<div class="list">
			<div class="title">目录</div>
			<scroll-view class="items scroll-Y" scroll-y="true" :scroll-top="scroll_Top"
			@scroll="_scroll">
				<div v-for="(item, index) in chapter_list" :key="index">
					<div class="item" :class="{chapter_item_active: item.chapter_id == chapter_id, first_item: 0 == index}"
					:style="{height: chapter_height + 'px'}"
					@click="clickChapterItem(item, index)">
						{{item.chapter_name}}
					</div>
				</div>
			</scroll-view>
		</div>
	</view>
</template>

<script>
	import {getChapterList} from '@/util/user_http/chapter.js'
	import {getSchedule} from '@/util/user_http/book-schedule.js'
	
	import {isLogin, getLocalUserInfo} from '@/util/function/login.js'
	
	export default {
		name: "yifangChapterList",
		
		props: {
			book_id: {
				type: String|Number
			},
			chapter_id: {
				type: String|Number
			},
		},
		data() {
			return {
				page: 1,
				size: 500,
				chapter_list: [], // 章节列表
				current_chapter_id_index: 0, // 当前选择的章节在章节列表的索引
				scroll_Top: 0, // 滚动高度
				is_scroll: false, // 是否已经滚动过  如果已经感动定位过了，则下次无需在滚动
				systemInfo: {}, // 系统信息
				benchmark_height: 750, // 基准高度，动态计算每个机型章节列表item应该的高度
				chapter_height: 20, // 章节列表item 最大高度，可能章节又超两行，超则忽略
			}
		},
		methods: {
			// 统一反馈章节信息
			uniGetClickChapterId(item, index, schedule){
				this.$emit('getClickChapterId', {
					item: item,
					index: index,
					chapterLegth: this.chapter_list.length,
					schedule: schedule ? schedule : null
				})
			},
			// 章节列表滚动
			_scroll(e){
				// console.log(e)
				this.scroll_Top = e.detail.scrollTop
			},
			// 获取当前书籍的阅读进度
			getChpaterReadProgress(book_id){
				getSchedule({
					user_id: getLocalUserInfo()['user_id'],
					book_id: book_id
				}, {
					custom: {loading: false}
				}).then(res => {
					// console.log('getChpaterReadProgress', res)
					if(res.data){
						// 有保存记录 返回相应的章节
						for (let chapter_indedx in this.chapter_list) {
							if(this.chapter_list[chapter_indedx]['book_id'] == res.data['book_id']
							&& this.chapter_list[chapter_indedx]['chapter_id'] == res.data['chapter_id']){
								
								let item = this.chapter_list[chapter_indedx]
								let index = ++chapter_indedx
								let schedule = res.data.schedule
								this.uniGetClickChapterId(item, index, schedule)
							}
						}
					}else{
						this.getFirstChapterReturn()
					}
				})
			},
			// 获取第一个章节并返回到父组件
			getFirstChapterReturn(){
				let first_chapter = this.chapter_list[0]
				
				this.uniGetClickChapterId(first_chapter, 1)
			},
			// 获取章节
			_getChapterList(){
				// 需等待配置加载完毕  才开始加载章节
				getChapterList({
					page: this.page,
					size: this.size,
					book_id: this.book_id
				}, {
					custom: {loading: false}
				}).then(res => {
					this.chapter_list = res.data
					// 如果未登录 则返回书籍的第一个章节
					if(this.chapter_list.length){	
						if(!isLogin()){ // 未登录
							// 默认获取第一个章节的id
							this.getFirstChapterReturn()
						}else{ // 已登录 则加载保存的阅读的章节
							this.getChpaterReadProgress(this.book_id)
						}
					}
				})
			},
			// 滚动到指定章节
			scrollToChapterId(chapter_id){
				// todo 滚动到章节难实现  以后有时间再搞
				return;
				if(this.is_scroll)return;
				
				let chapter_real_height = 0
				for (let index in this.chapter_list) {
					if(this.chapter_id == this.chapter_list[index]['chapter_id']){
						chapter_real_height = (parseInt(index) + 1) * this.chapter_height
						break
					}
				}
				
				// console.log(chapter_real_height)
				this.$nextTick(() => {
					setTimeout(() => {
						this.scroll_Top = chapter_real_height
					}, 200)
				})
				this.is_scroll = true
			},
			// 点击章节列表时 返回
			clickChapterItem(item, index){
				
				this.uniGetClickChapterId(item, ++index, this.chapter_list.length)
			},
			// 获取当前点击的章节item
			getThisChapterList(){
				return this.chapter_list
			},
			// 点击上一章或下一章时  返回当前章节在章节列表中的索引以及总的章节数 和下一章的章节id
			// 返回的数据说明：分别是当前章节在章节列表中的索引、总章节数、下一章节的id
			// type 可为 prev、next 分别为上一章、下一章
			getCurrentChapterIndex(chapter_id, type){
				for (let chapterIndex in this.chapter_list) {
					if(chapter_id == this.chapter_list[chapterIndex].chapter_id){
						let nextChapterIndex = 0
						let c_i = parseInt(chapterIndex)
						let a_c_l = this.chapter_list.length
						switch(type){
							case 'prev':
								// 上一页
								if(c_i > 0){
									nextChapterIndex = --c_i
								}
								break
							case 'next':
								// 下一页
								if(c_i < a_c_l){
									chapterIndex = nextChapterIndex = ++c_i
									++chapterIndex
								}
								break
						}
						// console.log(c_i, a_c_l, chapterIndex, nextChapterIndex)
						return [parseInt(chapterIndex), a_c_l, this.chapter_list[nextChapterIndex]]
					}
				}
			}
		},
		created() {
			let that = this
			uni.getSystemInfo({
			    success: function (res) {
			        that.systemInfo = res
			    }
			})
		},
	}
</script>

<style lang="scss" scoped>
.chapter-list-body{
	.scroll-Y{
		height: calc(100vh - 150rpx - env(safe-area-inset-bottom));
	}
	background-color: white;
	$width: 610rpx;
	width: $width;
	// #ifdef H5
	 padding-bottom: 88rpx;
	// #endif
	// border: 1px solid red;
	height: 100%;
	box-sizing: border-box;
	// overflow-y: scroll;
	
	.list{
		overflow: hidden;
		padding-top: 70rpx;
		.title{
			height: 70rpx;
			background-color: #F5F5F5;
			line-height: 70rpx;
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			width: $width;
			text-indent: 1em;
		}
		.items{
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			.item{
				
				// border: 1px solid red;
				border-bottom: 1px solid #f5f5f5;
				padding: 20rpx 10rpx;
				text-indent: 1em;
				
				// 最多两行
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
				white-space: nowrap
			}
			.chapter_item_active{
				background-color: antiquewhite
			}
		}
	}
}
</style>
