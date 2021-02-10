<template>
	<view>
		<yifang-book-detail :book_id="book_id" v-if="hock"></yifang-book-detail>
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
			}
		},
		methods: {

		},
		onLoad(option) {
			// console.log(option)
			this.book_id = option.book_id
		},
		onShow() {
			// uni.$emit('bookDetailOnShow')
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
