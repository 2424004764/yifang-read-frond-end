<template>
	<view>
		<div class="style1">
			<u-grid :col="4">
				<u-grid-item v-for="(item, index) in book_list" :key="index"
					 @click="bookDesc(item.book_id)"
					 >
					<u-image class="book_img" width="150rpx" height="200rpx" 
					:src="item.book_cover_imgs[0] ? item.book_cover_imgs[0] : 'http://cdn.fologde.com/6.png'" 
					mode="scaleToFill">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<view class="book_title">{{item.book_name}}</view>
				</u-grid-item>
			</u-grid>
		</div>
		
	</view>
</template>

<script>
	import {getBookList} from '@/util/user_http/book.js'
	
	export default {
		props: {
			// 可能用户登录之后进入首页  判断是否需要重新加载数据
			isNeedReLoadData: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				page: 1,
				size: 20,
				book_list: [], // 请求的书籍列表
			}
		},
		methods:{
			getBookList(){
				getBookList({
					page: this.page,
					size: this.size,
					is_hot: 1
				}, {
					custom: {
						loading: false
					}
				}).then(res => {
					for (let itemIndex in res.data) {
						try{
							res.data[itemIndex]['book_cover_imgs'] = JSON.parse(res.data[itemIndex]['book_cover_imgs'])
						}catch(e){
							
						}
					}
					this.book_list = res.data
				}).catch()
			},
			bookDesc(book_id){
				// console.log(book_id)
				uni.navigateTo({url: '/pages/book/book-detail/book-detail?book_id=' + book_id})
			}
		},
		created() {
			this.getBookList()
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/util/util.scss';
	
.style1{
	.book_img{
		img{
			width: 188rpx;
		}
	}
	.book_title{
		margin-top: 20rpx;
		height: 80rpx;
		width: 188rpx;
		text-align: left;
		padding: 0px 6rpx;
		
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}

</style>
