<script>
export default {
	onLaunch: function() {
		// console.log('App Launch');
		// #ifdef MP-WEIXIN
		// 只有小程序才触发自动更新 其他平台的可以再继续添加编译条件
		this.miniAutoUpdate()
		// #endif
	},
	onShow: function() {
		// console.log('App Show');
	},
	onHide: function() {
		// console.log('App Hide');
	},
	onError(err) {
		console.log('onError', err)
	},
	methods:{
		miniAutoUpdate(){
			// 检测更新
			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function (res) {
					console.log('onCheckForUpdate====', res)
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						console.log('res.hasUpdate====')
						updateManager.onUpdateReady(function () {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function (res) {
									console.log('success====', res)
									// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function () {
							// 新的版本下载失败
							wx.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			}
		}
	}
};
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/* 全局css */
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
img{
	width: 100%;
	height: 100%;
}
.bd-c-red{
	border: 1px solid red;
}
</style>
