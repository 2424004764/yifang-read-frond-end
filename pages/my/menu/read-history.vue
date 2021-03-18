<template>
	<view>
		<!-- 骨架屏 -->
		<view class="u-skeleton" v-if="skeleton_loading">
			<view class="item u-border-bottom" v-for="item in skeleton_data_list" :key="item">
				<view class="u-skeleton-circle image"></view>
				<view class="title-wrap u-skeleton-rect" style="width: 560rpx;">
				</view>
			</view>
		</view>

		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.book_id" @click="click"
		 @content-click="toBookDetail" :options="options">
			<view class="item u-border-bottom">
				<image class="image" mode="aspectFill" :src="item.images" />
				<view class="title-wrap">
					<text class="title u-line-2">{{item.title}}</text>
					<text class="schedule u-line-2">阅读进度：{{item.schedule}}</text>
				</view>
			</view>
		</u-swipe-action>

		<u-loadmore :status="status" v-if="loading_is_done" />
		<u-skeleton :loading="skeleton_loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import {
		isLogin,
		getLocalUserInfo
	} from '@/util/function/login.js'
	import {
		getHistoryList,
		delHistory
	} from '@/util/user_http/book_history.js'
	import {
		calcBookCoverImgsGetFirst
	} from '@/util/function/book/book.js'
	export default {
		data() {
			return {
				isLogin: false, // 是否登录
				page: 1,
				size: 10,
				list_count: 0, // 列表长度 只加载一次
				list: [], // 阅读历史列表
				skeleton_data_list: [], // 骨架屏模拟数据列表
				options: [
					// {
					// 	text: '收藏',
					// 	style: {
					// 		backgroundColor: '#007aff'
					// 	}
					// }, // 更多滑动项 可在这里添加
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				status: 'loading', // 加载更多的组件状态
				loading_is_done: false, // 请求是否加载完成
				skeleton_loading: true, // 是否显示骨架屏
			}
		},
		onShow() {
			this.init()
		},
		onLoad() {
			this._onLoad()
		},
		// 监听下拉刷新
		onPullDownRefresh() {
			this.skeleton_loading = true
			this.loading_is_done = false
			this.list = []
			this._onLoad()
		},
		// 下拉到底
		onReachBottom() {
			++this.page
			this.getList()
		},
		methods: {
			// 自动加载一页数据
			// 要控制不能加载太多数据
			delAfterLoadData() {
				// 如果列表长度大于或等于 每页允许的数据量的两倍  则不加载
				if (this.list.length >= (this.size * 2)) {
					return
				}
				if (this.list.length < (this.size * 2)) {
					++this.page
					this.getList()
				}
			},
			// 删除记录
			delHistory(history_id, list_index) {
				delHistory({}, {
					data: {
						history_id: history_id
					}
				}).then(res => {
					if (res.code == 0) {
						this.list.splice(list_index, 1)
						// 删除成功后 自动加载一页数据
						this.delAfterLoadData()
						// 动态计算标题
						this.loadTitle(--this.list_count)
					}
				})
			},
			// 页面开始处理列表和骨架屏
			_onLoad() {
				this.page = 1
				this.initSkeleton() // 初始化骨架屏
				this.getList()
			},
			// 初始化骨架屏
			initSkeleton() {
				this.skeleton_data_list = [0, 1, 2, 3, 4, 5]
			},
			// 去书籍详情页
			toBookDetail(item) {
				uni.navigateTo({
					url: '/pages/book/book-detail/book-detail?book_id=' + this.list[item].book_id
				})
			},
			/**
			 * @param {Object} index 列表索引
			 * @param {Object} btn_index 按钮索引
			 */
			click(index, btn_index) {
				this.delHistory(this.list[index].history_id, index)
			},
			// 首次加载列表完成
			listFirstLoadDone() {
				this.loading_is_done = true
				this.skeleton_loading = false
				uni.stopPullDownRefresh()
			},
			// 加载列表
			loadList(list) {
				if (!list.length || list.length < this.size) {
					this.status = 'nomore'
					// return
				}
				for (let index in list) {
					let images = calcBookCoverImgsGetFirst(list[index].book_cover_imgs)
					this.list.push({
						title: list[index].book_name,
						schedule: list[index].schedule,
						images: images,
						book_id: list[index].book_id,
						history_id: list[index].history_id,
					})
				}
			},
			// 设置标题
			// todo 开始动态计算数据总量 删除之后
			loadTitle(count) {
				count = parseInt(count)
				let _title = ''
				if (!count) {
					_title = '没有阅读记录'
				} else {
					_title = `读过${count}本书`
				}
				this.list_count = count
				uni.setNavigationBarTitle({
					title: _title
				})
			},
			// 获取阅读记录列表
			getList() {
				this.init()
				if (this.status == 'nomore') { // 没数据了 不加载了
					return
				}
				getHistoryList({
					user_id: getLocalUserInfo()['user_id'],
					page: this.page,
					size: this.size,
				}, {
					custom: {
						loading: false
					}
				}).then(res => {
					this.loadTitle(res.data.count) // 设置标题
					this.loadList(res.data.list) // 加载列表
					this.listFirstLoadDone() // 首次加载列表完成
				})
			},
			init() {
				this.isLogin = isLogin() ? true : false
				if (!this.isLogin) {
					uni.reLaunch({
						url: '../my'
					})

					return
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		padding: 20rpx;
		text{
			width: 74vw;
			// border: 1px solid red;
		}
	}

	.image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 150rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}

	.title {
		text-align: left;
		font-size: 28rpx;
		margin-top: 10rpx;
	}

	.schedule {
		font-size: 24rpx;
		margin-top: 20rpx;
		color: $u-content-color;
	}
</style>
