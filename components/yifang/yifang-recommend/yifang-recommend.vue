<template>
	<view>
		 <uni-list>
			 
			<uni-list-item title="热门阅读" :showArrow="false"></uni-list-item>
			
			<!-- 加载热门阅读组件 -->
			<hotRead></hotRead>
			 
			<uni-list-item title="更多阅读" :showArrow="false"></uni-list-item>#257FFF
			 
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
		
		<u-loadmore icon-color="#257FFF" style="margin-top: 50rpx;" :status="load_done ? 'nomore' : 'loading'" />
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
				loadingStatus: 'loading', // 更多阅读列表加载状态 nomore 为无更多
				frist_load_done: false, // 首页请求是否完成
				load_done: false, // 数据是否已经全部加载完成
			}
		},
		created() {
			this.getBookList() // 获取书籍列表
			
			// 监听首页上拉到底事件
			uni.$on('indexOnReachBottom', () => {
				this.frist_load_done && this.getBookList()
			})
		},
		methods: {
			// 获取书籍列表
			getBookList(){
				if(this.load_done)return
				getBookList({
					page: this.page++,
					size: this.size
				}, {
					custom: {
						loading: false
					}
				}).then(res => {
					if(res.data.length && !this.frist_load_done)this.frist_load_done = true
					
					if(res.data.length < this.size)this.load_done = true
					for (let itemIndex in res.data) {
						try{
							res.data[itemIndex]['book_cover_imgs'] = JSON.parse(res.data[itemIndex]['book_cover_imgs'])
						}catch (err){
							
						}
						this.more_read_list.push(res.data[itemIndex])
					}
				}).catch()
			},
			// 点击书籍详情
			bookDesc(book_id){
				// console.log(book_id)
				uni.navigateTo({url: '/pages/book/book-detail/book-detail?book_id=' + book_id})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
