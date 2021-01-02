<template>
	<view>
		 <uni-list>
			 
			<uni-list-item title="热门阅读" :showArrow="false"></uni-list-item>
			
			<hotRead></hotRead>
			 
			<uni-list-item title="更多阅读" :showArrow="false"></uni-list-item>
			 
			<div v-for="(item, index) in more_read_list" :key="index">
				<uni-list-chat :show-extra-icon="true"
					:avatar="item.book_cover_imgs ? item.book_cover_imgs[0] : ''"
					link=""
					:note="item.book_desc"
					:title="item.book_name" 
					clickable  @click="bookDesc(item.book_id)">
				</uni-list-chat>
			</div>
			 
		</uni-list>
	</view>
</template>

<script>
	// 更多关于列表的说明:https://ext.dcloud.net.cn/plugin?id=24
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniListChat from '@/components/uni-list-chat/uni-list-chat.vue'
	
	import {getBookList} from '@/util/user_http/book.js'
	
	import hotRead from '@/components/yifang/hot-read/hot-read.vue'
	
	export default {
		name: "yifangRecommend",
		components: {uniList, uniListItem, uniListChat, hotRead},
		data() {
			return {
				page: 1,
				size: 50,
				recommend: [], // 热门阅读
				more_read_list: [], // 更多阅读列表
			}
		},
		created() {
			this.getBookList()
		},
		methods: {
			getBookList(){
				getBookList({
					page: this.page,
					size: this.size
				}, {
					custom: {
						loading: false
					}
				}).then(res => {
					for (let itemIndex in res.data) {
						try{
							res.data[itemIndex]['book_cover_imgs'] = JSON.parse(res.data[itemIndex]['book_cover_imgs'])
						}catch{
							
						}
					}
					this.more_read_list = res.data
				}).catch()
			},
			bookDesc(book_id){
				// console.log(book_id)
				uni.navigateTo({url: '/pages/book/book-detail/book-detail?book_id=' + book_id})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
