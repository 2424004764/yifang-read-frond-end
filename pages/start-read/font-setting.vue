<template>
	<view>
		<u-sticky>
			<div class="tabs">
				<u-tabs :list="list" :is-scroll="false" :current="current" @change="tabsChange" active-color="#fa3534">
				</u-tabs>
			</div>
		</u-sticky>

		<div class="font-list">

			<div class="loading" v-if="!font_data.length">
				<u-loading mode="circle" color="#2979ff" size="56"></u-loading>
			</div>

			<div class="item" v-for="(item, index) in font_data" :key="index" v-if="font_data.length">
				<div class="top">
					<u-image class="cover" :src="item.cover" mode="widthFix" :lazy-load="true" :fade="true"
						duration="450">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</div>

				<div class="buttom">
					<div class="font-name">{{item.name}}</div>
					<div class="btn">
						<u-button :custom-style="{border: '1px solid ' + font_statu_text[item.status].borderColor, 
						color: font_statu_text[item.status].textColor}" :ripple="true" size="medium">
							{{font_statu_text[item.status].text}}</u-button>
					</div>
				</div>
			</div>

			<u-gap height="100"></u-gap>

			<u-loadmore :status="loadingText" :icon="false" />
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '中文'
				}, {
					name: '英文'
				}],
				current: 0,
				font_data: [{
						cover: 'http://cdn.fologde.com/2021-04-05%5B10-44-24%5D1617590664.png',
						status: 0,
						name: '品如手写体',
						url: 'https://yifang-read-api.fologde.com/font/ch/品如手写体.ttf',
						type: 'ch',
					},
					{
						cover: 'https://cdn2.ziyouziti.com/uploads/20210221/44aa8291a44a3aeb6cbc551d639e2f31.png',
						status: 1,
						name: '霞鹜文楷',
						type: 'ch',
					},
					{
						cover: 'https://cdn2.ziyouziti.com/uploads/20210210/b4886f8be96c1098f08566c7ebe5b093.png',
						status: 2,
						name: '汇文明朝体',
						type: 'ch',
					},
					{
						cover: 'https://cdn2.ziyouziti.com/uploads/20210209/87a29642515aac062bbf736d534c5099.png',
						status: 0,
						name: '霞鹜漫黑',
						type: 'ch',
					},
					{
						cover: 'https://cdn2.ziyouziti.com/uploads/20201202/2e7e4ddab4c5703213cef58c2bd5bed0.png',
						status: 0,
						name: 'OZ焦糖下午茶',
						type: 'ch',
					},
					{
						cover: 'https://cdn2.ziyouziti.com/uploads/20200929/a56819743ac9865186737c5804187b79.png',
						status: 0,
						name: '仓耳舒圆体',
						type: 'ch',
					},
				], // 字体列表  cover:封面、status：状态、name：字体名、url：字体下载链接、type：ch中文 en英文
				// 项说明 0：未下载，显示下载并使用。1：已下载，未使用，显示使用。2：已下载，正在使用，显示当前字体
				font_statu_text: {
					0: {
						text: '下载并使用',
						borderColor: '#C98D94',
						textColor: '#C98D94',
					},
					1: {
						text: '使用',
						borderColor: '#9AC6A1',
						textColor: '#9AC6A1',
					},
					2: {
						text: '当前字体',
						borderColor: '#BABABA',
						textColor: '#BABABA',
					},
				}, // 字体列表status映射
				loadingText: 'loading'
			}
		},
		methods: {
			// tabs change
			tabsChange(index) {
				this.current = index
			}
		}
	}
</script>

<style>
	page {
		background-color: #E5E5E5;
	}
</style>

<style scoped lang="scss">
	.tabs {
		border: 1px solid #F0F5F1;
	}

	.font-list {
		.loading {
			width: 56rpx;
			margin: 0 auto;
			// border: 1px solid red;
			margin-top: 20%;
		}

		.item {
			width: 90%;
			margin-left: 5%;
			margin-top: 20rpx;
			// padding: 20rpx;
			box-sizing: border-box;
			// border-radius: 40rpx;
			border-top-right-radius: 40rpx;
			border-top-left-radius: 40rpx;
			border-bottom-left-radius: 16rpx;
			border-bottom-right-radius: 16rpx;

			background-color: white;
			box-shadow: 0px 30rpx 20rpx 6rpx #969398;
			overflow: hidden;

			.top {
				.cover {
					// flex-grow: 2;
					// width: 600rpx;
					// height: 314rpx;
				}
			}

			.buttom {
				display: flex;
				justify-content: space-between;
				padding-right: 4rpx;
				padding-bottom: 8rpx;

				.font-name {
					padding-left: 10rpx;

					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			// 选择出第一个元素以外的元素
			&:not(:first-child) {
				margin-top: 80rpx;
			}
		}
	}
</style>
