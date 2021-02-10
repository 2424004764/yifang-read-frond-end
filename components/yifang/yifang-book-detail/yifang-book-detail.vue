<template>
	<view class="body">
		<div class="bg">
			
			<!-- 书籍详情区 -->
			<div class="book-detail">
				<div class="bg-layer" :style="'background-image: url('+filter_img+')'"></div>
				
				<div class="img-content">
					<div class="book-img">
						<!-- 有图片 -->
						<image v-if="isLoadingSuccess && filter_img" 
						:src="filter_img"
						 mode="" @click="showImg(bookDetail.book_cover_imgs)"></image>
						<!-- 没有图片 -->
						<text v-if="isLoadingSuccess && !filter_img"></text>
					</div>
					<div class="book-desc" v-if="isLoadingSuccess">
						<div class="book_name">{{bookDetail.book_name}}</div>
						<div class="book_author">作者：{{bookDetail.author_detail.book_author}}</div>
						<div class="book_class">分类：{{bookDetail.class_detail.class_id_name}}</div>
						<div class="book_word_count">字数：{{bookDetail.book_word_count}}</div>
					</div>
					
				</div>
			</div>
			<!-- 书籍详情说明 -->
			<div class="book-detail_introduce near-img-area" v-if="isLoadingSuccess">
				作者详情介绍：
				<u-read-more ref="authorDetailMore" :toggle="true" show-height="300" v-if="bookDetail.author_detail.book_author_desc">
					<u-parse :html="bookDetail.author_detail.book_author_desc" @load="authorDetailLoaded"></u-parse>
				</u-read-more>
			</div>
			
			<u-gap height="8" bg-color="#F3F3F3"></u-gap>
			
			<div class="book-detail_introduce" v-if="isLoadingSuccess && bookDetail.book_detail.book_desc">
				书籍详情介绍：
				<u-read-more ref="bookDetailMore" :toggle="true" show-height="300" v-if="bookDetail.book_detail.book_desc">
					<u-parse :html="bookDetail.book_detail.book_desc" @load="bookDetailLoaded"></u-parse>
				</u-read-more>
			</div>
		</div>
		
		<!-- 底部固定栏  用来放立即阅读、加入书架等按钮 -->
		<view class="join " :style="{bottom: buttom_bottom + 'rpx'}">
			<view class="item no-join" @click="nowRead">立即阅读</view>
			
			<template v-if="!loadIsJoin">
				<view class="item"><u-loading mode="circle"></u-loading></view>
			</template>
			<template v-else>
				<view class="item no-join" @click="joinBookShelf" v-if="loadIsJoin && !isJoin">加入书架</view>
				<view class="item joined" @click="joinBookShelf" v-if="loadIsJoin && isJoin">已加入书架</view>
			</template>
		</view>
		
	</view>
</template>

<script>
	import {getBookDetailUtil} from '@/util/function/book/book.js'
	import {loginTip, getLocalUserInfo, isLogin} from '@/util/function/login.js'
	import {isJoinBookshelf, joinBookshelf} from '@/util/user_http/book-shelf.js'
	
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
				isLoadingSuccess: false, // 是否书籍详情加载完毕
				loadIsJoin: false, // 加载加入书架请求是否完毕
				isJoin: null, // 是否加入书架
				buttom_bottom: 0, // 底部操作区距离
				filter_img: '', // 用于书籍详情的背景模糊图
			}
		},
		methods: {
			// 处理背景图片
			handleBgImg(){
				// 如果书籍的封面图
				if(this.bookDetail.book_cover_imgs.length){
					this.filter_img = this.bookDetail.book_cover_imgs[0]
				}else{
					// 设置默认背景图  以及模糊图
					this.filter_img = 'http://cdn.fologde.com/bk_100101791_r_601_m6.jpg'
				}
			},
			bookDetailLoaded() {
				this.$refs.bookDetailMore.init();
			},
			authorDetailLoaded() {
				this.$refs.authorDetailMore.init();
			},
			// 点击书籍封面图
			showImg(book_cover_imgs){
				
				// MP 就是各家的小程序 如支付宝、微信、百度等小程序平台
				// 不需要处理点击事件
				// #ifdef MP
				let itemList = ['发送给朋友', '保存图片', '收藏']
				// #endif
				
				// H5 端
				// #ifdef H5
				let itemList = ['保存图片']
				// #endif
				
				// APP 端
				// #ifdef APP-PLUS
				let itemList = ['保存图片']
				// #endif
				
				uni.previewImage({
					urls: book_cover_imgs,
					current: 0,
					indicator: 'default',
					loop: true,
					longPressActions: {
						itemList: itemList,
						success: function(data) {
							let buttonIndex = data.tapIndex // 按钮的索引
							let imageIndex = data.index // 点击的图片索引
							console.log('选中了第' + (buttonIndex) + '个按钮,第' + (imageIndex) + '张图片');
							// #ifdef APP-PLUS
							if(0 == buttonIndex){
								console.log(book_cover_imgs[imageIndex])
								uni.saveImageToPhotosAlbum({
									filePath: book_cover_imgs[imageIndex],
									success: function () {
										uni.showToast({
											title: '保存成功',
											duration: 600
										})
										// console.log('save success');
									}
								})
							}
							// #endif
						},
						fail: function(err) {
							// console.log(err)
							// uni.showToast({
							// 	title: '操作失败~',
							// 	duration: 600
							// })
						}
					}
				})
			},
			// 是否加入书架
			isJoinBookshelf(book_id){
				// 未登录
				if(!isLogin()){
					this.isJoin = false
					this.loadIsJoin = true
					uni.stopPullDownRefresh()
					return
				}
				isJoinBookshelf({
					user_id: getLocalUserInfo()['user_id'],
					book_id: book_id
				}).then(res => {
					// console.log('isJoinBookshelf', res)
					if(0 == res.code){
						this.loadIsJoin = true
						this.isJoin = res.data.is_join
					}
					uni.stopPullDownRefresh()
				})
			},
			// 加入书籍
			joinBookShelf(){
				// 判断是否登录
				if(loginTip()){
					// 已登录
					joinBookshelf({
						user_id: getLocalUserInfo()['user_id'],
						book_id: this.book_id
					}).then(res => {
						// console.log('joinBookshelf', res)
						this.isJoinBookshelf(this.book_id)
					})
				}
			},
			// 书籍详情
			getBookDetail(book_id){
				// uni.showLoading({
				// 	mask: true,
				// 	title: "详情加载中..."
				// })
				// console.log(this.book_id)
				getBookDetailUtil(book_id).then(res => {
					// console.log(res)
					this.bookDetail = res
					// 设置页面标题
					// uni.setNavigationBarTitle({
					//     title: res.book_name
					// })
					this.isLoadingSuccess = true
					uni.hideLoading()
				}).then(() => {
					// 处理背景图片
					this.handleBgImg()
				}).catch(() => {
					uni.hideLoading()
				})
			},
			// 点击立即阅读
			nowRead(){
				// #ifdef APP-PLUS
				let a = plus.navigator.getStatusbarHeight()
				// console.log(a)
				this.buttom_bottom = 96 + a
				// #endif
				uni.navigateTo({
				    url: '/pages/start-read/start-read?book_id=' + this.book_id
				})
			}
		},
		created() {
		},
		mounted(){
			// prop 数据加载完毕
			this.getBookDetail(this.book_id) // 获取书籍详情
			this.isJoinBookshelf(this.book_id) // 是否加入书架
			let that = this
			uni.$on('bookDetailOnShow', function(){
				// #ifdef APP-PLUS
				setTimeout(function(){
					console.log(plus.navigator.isFullscreen()) // 获取状态栏高度
					that.buttom_bottom = 140
				}, 1000)
				// #endif
			})
		},
		watch:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.bg{
		width: 100%;
		// border: 1px solid red;
		// border-bottom: 1px solid #FF5501;
		box-sizing: border-box;
		padding-bottom: 120px;
		.book-detail{
			position: relative;
			clear: both;
			overflow: hidden;
			padding: 40rpx;
			padding-bottom: 70rpx;
			width: 100%;
			box-sizing: border-box;
			
			.bg-layer{
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				background-position: center;
				background-size: 100%;
				filter: blur(40rpx);
				height: 400rpx;
			}
			.img-content{
				position: relative;
				top: 0px;
				left: 0px;
				width: 100%;
				// border: 1px solid red;
				overflow: hidden;
				.book-img{
					width: 170rpx;
					height: 220rpx;
					float: left;
					// border: 1px solid red;
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
					color: white;
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
		}
		.book-detail_introduce{
			padding: 20rpx 40rpx;
		}
		.near-img-area{
			border-radius: 40rpx;
			position: relative;
			margin-top: -40rpx;
			background-color: white;
		}
	}
	.join{
		width: 100%;
		// height: 100rpx;
		padding: 30rpx 0rpx;
		position: fixed;
		// bottom: 1rpx;
		left: 0rpx;
		border-top: 1px solid #F2F2F2;
		background-color: white;
		.div{
			float: left;
		}
		.item{
			// border: 1px solid red;
			height: 66rpx;
			display: inline-block;
			padding: 10rpx 35rpx;
			border-radius: 30rpx;
			text-align: center;
			margin-left: 20rpx;
		}
		.no-join{
			background-color: #FF5501;
			color: white;
		}
		.joined{
			background-color: #F5F5F5;
		}
	}
</style>
