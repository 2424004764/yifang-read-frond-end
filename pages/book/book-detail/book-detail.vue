<template>
	<view>
		<yifang-book-detail :book_id="book_id" v-if="hock" v-on:book-detail="onBookDetail"></yifang-book-detail>
	</view>
</template>

<script>
	import yifangBookDetail from '@/components/yifang/yifang-book-detail/yifang-book-detail.vue'

	export default {
		name: "bookDetail",
		components: {
			yifangBookDetail
		},
		data() {
			return {
				book_id: null, // 传过来的book_id
				hock: true,
				book_detail: {}, // 书籍详情
				Config: {}, // 全局配置
			}
		},
		methods: {
			// 监听到子组件返回的书籍详情数据
			onBookDetail(book_detail){
				//#ifdef MP-WEIXIN
				uni.showShareMenu()
				//#endif
				this.book_detail = book_detail
			},
		},
		onShareAppMessage(res) {
			let title = "《"+ this.book_detail.book_name +"》 - " + this.Config.appName
			
			return {
				title: title,
				path: '/pages/book/book-detail/book-detail?book_id=' + this.book_detail.book_id
			}
		},
		onLoad(option) {
			// 先隐藏分享  等页面数据加载完才可以分享  不然书籍书籍没加载完成就分享会有问题
			//#ifdef MP-WEIXIN
			uni.hideShareMenu()
			//#endif
			// console.log(option)
			this.book_id = option.book_id
		},
		onShow() {
			this.Config = this.$yifangConfig
		},
		// 书籍详情页面下拉刷新
		onPullDownRefresh(){
			this.hock = false
			this.$nextTick(() => {
				this.hock = true
			})
		},
	}
</script>

<style lang="scss" scoped>
</style>
