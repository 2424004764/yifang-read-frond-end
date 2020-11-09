<template>
	<view class="chapter-list-body">
		<div class="list">
			<div class="title">目录</div>
			<div class="items">
				<div class="item" v-for="(item, index) in chapter_list" :key="index"
				@click="clickChapterItem(item.chapter_id)">
					{{item.chapter_name}}
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {getChapterList} from '@/util/user_http/chapter.js'
	
	export default {
		name: "yifangChapterList",
		
		props: {
			book_id: {
				type: String|Number
			}
		},
		data() {
			return {
				page: 1,
				size: 50,
				chapter_list: [], // 章节列表
			}
		},
		methods: {
			// 获取章节
			getChapterList(){
				getChapterList({
					page: this.page,
					size: this.size,
					book_id: this.book_id
				}).then(res => {
					this.chapter_list = res.data
				})
			},
			clickChapterItem(chapter_id){
				this.$emit('getClickChapterId', chapter_id)
				// console.log(chapter_id)
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
	border: 1px solid red;
	height: 100%;
	// padding-bottom: 88rpx;
	box-sizing: border-box;
	overflow-y: scroll;
	// position: absolute;
	
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
		}
	}
}
</style>
