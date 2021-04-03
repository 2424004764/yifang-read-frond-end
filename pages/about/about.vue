<template>
	<view class="about">
		<div class="item icon">
			<image src="/static/logo.png" alt="" mode="aspectFit">
		</div>
		<div class="item appName"><b>{{Config.appName}}</b></div>
		<div class="item version">Version {{Config.version}}</div>
		<!-- <div class="item version">开发此软件的目的：让天下没有收费的书，承若书籍永久免费，如果没有你搜索的书籍，请提交反馈！</div> -->
		
		<div class="footer">
			<p>Github 开源地址：<text class="copy" @click="copyGitUrl">点击复制</text></p>
			<p>{{Config.appName}} 版权所有</p>
			<p>All Right Reserved.</p>
		</div>
	</view>
</template>

<script>
	import {copy} from '@/util/util.js'
	
	export default {
		data() {
			return {
				Config: {}, // 全局配置
			}
		},
		created() {
			this.Config = this.$yifangConfig
		},
		onShareAppMessage(res) {
			let title = "关于 " + this.Config.appName
			
			return {
				title: title,
				path: '/pages/about/about'
			}
		},
		methods: {
			// 拷贝git仓库地址
			copyGitUrl(){
				// console.log(this.Config.gitUrl)
				copy(this.Config.gitUrl)
			}
		},
	}
</script>

<style lang="scss" scoped>
.about{
	display: flex;
	flex-flow: row wrap;
	.item{
		width: 100%;
		align-self: center;
		margin-top: 20rpx;
		text-align: center;
	}
	.icon{
		width: 160rpx;
		height: 160rpx;
		margin: 0 auto;
		margin-top: 100rpx;
		border-radius: 10px;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.appName{
		margin-top: 80rpx;
		font-size: 44rpx;
	}
	.footer{
		position: fixed;
		left: 0px;
		bottom: 10px;
		width: 100%;
		box-sizing: border-box;
		p{
			text-align: center;
		}
		.copy{
			color: blue;
		}
	}
}
</style>
