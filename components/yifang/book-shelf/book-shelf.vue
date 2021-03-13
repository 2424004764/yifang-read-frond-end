<template>
	<view>

		<!-- 样式1 -->
		<div class="style1" v-if="use_style_num == 1">
			<u-grid :col="3">
				<u-grid-item v-for="(item, index) in book_list" :key="index" @click="book_click(item.book_id)"
					@longpress="logoTime">
					<u-image class="book_img" width="188rpx" height="252rpx"
						:src="item.detail.book_cover_imgs[0] ? item.detail.book_cover_imgs[0] : 'http://cdn.fologde.com/6.png'"
						mode="scaleToFill">
						<u-loading slot="loading"></u-loading>
					</u-image>
					<view class="book_title">{{item.detail.book_name}}</view>
					<view class="read_schedule">{{item.read_schedule}}</view>
				</u-grid-item>
			</u-grid>
		</div>
		
		
		<div class="loadmore">
			<u-loadmore :status="dataLoadDone ? 'nomore' : 'loading'" />
		</div>
		
	</view>
</template>

<script>
	import {
		getBookshelfList
	} from '@/util/user_http/book-shelf.js'

	import {
		getLocalUserInfo,
		isLogin
	} from '@/util/function/login.js'

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
				use_style_num: 1, // 使用的样式编号
				current_page: 1, // 当前页
				total: 0, // 书架列表总数
				
				current_request_done: false, // 当前API请求是否完成
				status: 'loading', // 加载状态 loading / nomore
				dataLoadDone: false, // 全部数据是否加载完成
			}
		},
		methods: {
			// 验证是否登录
			checkLogin() {
				// 如果没有数据
				if (!this.book_list.length && this.current_request_done) {
					// todo 这里有可能第一次接口还在请求中
					this.loadBookshelfList()
				} else {
					// 如果退出登录了 就将书架中的数据清空
					if (!isLogin()) {
						this.book_list = []
						this.page = 1
					}
				}
			},
			// 长按事件
			logoTime() {
				uni.showToast({
					title: '长按',
					duration: 2000
				});
			},
			// 点击书架中的书籍 去阅读书籍
			book_click(book_id) {
				uni.navigateTo({
					url: '/pages/start-read/start-read?book_id=' + book_id
				})
			},
			// 加载书架中书籍列表
			loadBookshelfList() {
				if (!isLogin() || this.dataLoadDone) return
				
				let that = this
				that.current_request_done = false
				getBookshelfList({
					user_id: getLocalUserInfo()['user_id'],
					page: this.page++,
					size: this.size,
				}, {
					custom: {loading: false}
				}).then(res => {
					// console.log('getBookshelfList', res)
					if (res.code == 0) {
						this.book_list
						let data = res.data.list
						if(!this.total)this.total = parseInt(res.data.total)
						for (let item in data) {
							try {
								data[item]['detail']['book_cover_imgs'] = JSON.parse(data[item]['detail'][
									'book_cover_imgs'
								])
							} catch (e) {
								//TODO handle the exception
							}
							this.book_list.push(data[item])
						}
						uni.stopPullDownRefresh()
						if(data.length < this.size){
							// 说明没有数据了
							this.status = 'nomore'
							this.dataLoadDone = true // 全部数据加载完成
						}
					}
				}).then(() => {
					that.current_request_done = true
				})
			}
		},
		created() {
			// 加载书籍书籍列表
			this.loadBookshelfList()
			// 监听父组件上拉到底事件
			uni.$on('ReachBottom', () => {
				this.loadBookshelfList()
			})
		},
		watch: {
			isNeedReLoadData(n, o) {
				// console.log('isNeedReLoadData')
				// 检查是否登录，登录后 是否需要重新加载书架列表
				this.checkLogin()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/util/util.scss';

	.style1 {
		.book_img {
			img {
				width: 188rpx;
			}
		}

		.book_title {
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

		.read_schedule {
			// border: 1px solid red;
			width: 188rpx;
			padding-left: 10rpx;
			color: #909399;
			text-align: right;
			margin-top: 10rpx;
		}
	}
	.page{
		padding: 40rpx 0rpx;
	}
</style>
