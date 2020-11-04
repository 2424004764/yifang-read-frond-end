<template>
	<view class="body">
		<div class="bg">
			<div class="book-detail">
				<div class="book-img">
					<!-- 有图片 -->
					<image v-if="isLoadingSuccess && bookDetail.book_cover_imgs.length" :src="bookDetail.book_cover_imgs[0]" mode=""></image>
					<!-- 没有图片 -->
					<text v-if="isLoadingSuccess && !bookDetail.book_cover_imgs.length"></text>
				</div>
				<div class="book-desc" v-if="isLoadingSuccess">
					<div class="book_name">{{bookDetail.book_name}}</div>
					<div class="book_author">作者：{{bookDetail.author_detail.book_author}}</div>
					<div class="book_class">分类：{{bookDetail.class_detail.class_id_name}}</div>
					<div class="book_word_count">字数：{{bookDetail.book_word_count}}</div>
				</div>
	
			</div>
			<!-- 书籍详情说明 -->
			<div class="book-detail_introduce" v-if="isLoadingSuccess">
				详情介绍：{{bookDetail.book_desc}}
			</div>
		</div>
		
		<!-- 底部固定栏  用来放立即阅读、加入书架等按钮 -->
		<div class="join" v-if="isLoadingSuccess">
			<div class="now-read" @click="nowRead">立即阅读</div>
		</div>
		
	</view>
</template>

<script>
	import {getBookDetail} from '@/util/user_http/book.js'
	
	export default{
		name: "yifangBookDetail",
		props: {
			book_id: {
				type: String
			}
		},
		data(){
			return {
				bookDetail: [], // 书籍详情
				isLoadingSuccess: false
			}
		},
		methods: {
			getBookDetail(){
				getBookDetail({
					book_id: this.book_id
				}).then(res => {
					// 处理书籍封面图
					try{
						res.data['book_cover_imgs'] = JSON.parse(res.data['book_cover_imgs'])
					}catch(err){
						res.data['book_cover_imgs'] = []
					}
					this.bookDetail = res.data
					// 设置页面标题
					uni.setNavigationBarTitle({
					    title: res.data.book_name
					})
					this.isLoadingSuccess = true
					console.log(res)
				})
			},
			nowRead(){
				console.log(this.book_id)
			}
		},
		created() {
		},
		mounted(){
			this.getBookDetail()
		},
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		// border: 1px solid red;
		border-bottom: 1px solid #FF5501;
		box-sizing: border-box;
		padding-top: 50rpx;
		overflow: hidden;
		.book-detail{
			// border: 1px solid red;
			margin-left: 50rpx;
			clear: both;
			overflow: hidden;
			.book-img{
				width: 170rpx;
				height: 220rpx;
				float: left;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.book-desc{
				float: left;
				// border: 1px solid red;
				margin-left: 50rpx;
				width: 60%;
				.book_name{
					font-size: 40rpx;
					font-weight: 900;
				}
				.book_author{
					margin-top: 20rpx;
				}
				.book_class, .book_word_count{
					margin-top: 10rpx;
				}
			}
		}
		.book-detail_introduce{
			margin: 20rpx 40rpx;
		}
	}
	.join{
		width: 100%;
		// height: 100rpx;
		padding: 30rpx 0rpx;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		border-top: 1px solid #FF5501;
		box-sizing: border-box;
		padding-left: 20rpx;
		.div{
			float: left;
		}
		.now-read{
			border: 1px solid red;
			display: inline-block;
			padding: 10rpx 35rpx;
			background-color: #FF5501;
			color: white;
			border-radius: 30rpx;
			text-align: center;
		}
	}
</style>
