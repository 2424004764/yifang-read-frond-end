<template>
	<view class="chapter-list-body">
		<div class="list">
			<div class="title">目录</div>
			<div class="items">
				<div v-for="(item, index) in chapter_list" :key="index">
					<div class="item"  :class="{chapter_item_active: item.chapter_id == chapter_id}"
					@click="clickChapterItem(item, index)">
						{{item.chapter_name}}
					</div>
				</div>
			</div>
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
			}
		},
		methods: {
			// 获取当前书籍的阅读进度
			getChpaterReadProgress(book_id){
				getSchedule({
					user_id: getLocalUserInfo()['user_id'],
					book_id: book_id
				}).then(res => {
					// console.log('getChpaterReadProgress', res)
					if(res.data){
						// 有保存记录 返回相应的章节
						for (let chapter_indedx in this.chapter_list) {
							if(this.chapter_list[chapter_indedx]['book_id'] == res.data['book_id']
							&& this.chapter_list[chapter_indedx]['chapter_id'] == res.data['chapter_id']){
								// console.log(this.chapter_list[chapter_indedx])
								
								this.$emit('getClickChapterId', {item: this.chapter_list[chapter_indedx], index: ++chapter_indedx,
								chapterLegth: this.chapter_list.length, schedule: res.data.schedule})
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
				this.$emit('getClickChapterId', {item: first_chapter, index: 1,
				chapterLegth: this.chapter_list.length})
			},
			// 获取章节
			getChapterList(){
				getChapterList({
					page: this.page,
					size: this.size,
					book_id: this.book_id
				}).then(res => {
					this.chapter_list = res.data
					// 如果未登录 则返回书籍的第一个章节
					if(this.chapter_list.length){
						if(!isLogin()){ // 未登录
							// 默认获取第一个章节的id
							this.getFirstChapterReturn()
						}else{ // 已登录
							this.getChpaterReadProgress(this.book_id)
						}
					}
				})
			},
			// 点击章节列表时 返回
			clickChapterItem(item, index){
				this.$emit('getClickChapterId', {item: item, index: ++index, 
				chapterLegth: this.chapter_list.length})
			},
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
		},
		mounted() {
			// 加载该书籍的章节信息
			this.getChapterList()
		}
	}
</script>

<style lang="scss" scoped>
.chapter-list-body{
	background-color: white;
	$width: 610rpx;
	width: $width;
	// #ifdef H5
	 padding-bottom: 88rpx;
	// #endif
	// border: 1px solid red;
	height: 100%;
	box-sizing: border-box;
	overflow-y: scroll;
	
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
			}
			.chapter_item_active{
				background-color: antiquewhite
			}
		}
	}
}
</style>
