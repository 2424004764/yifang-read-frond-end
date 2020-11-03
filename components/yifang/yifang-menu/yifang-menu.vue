<template>
	<view class="menu">
		<ju-navigator-grid element-id="navigatorMenu" 
		:list="menu" height="170" :key="k" size="70"/>
	</view>
</template>

<script>
	// 该组件的更多用法:https://ext.dcloud.net.cn/plugin?id=1616
	import juNavigatorGrid from '@/components/ju-navigator-grid/ju-navigator-grid.vue'
	import {getClass} from '@/util/user_http/menu.js'
	export default {
		name: "yifangMenu",
		components: {juNavigatorGrid},
		data() {
			return {
				page: 1,
				size: 10,
				k: 0, // 确保菜单能加载成功
				menu:[
						// {title: "历史", url: '/pages/field/index', icon: "/static/logo.png"},
						// {title: "科学", url: 'https://baidu.com', icon: '/static/logo.png'},
						// {title: "工业", type: 'custom', icon: '/static/logo.png'},
						// {title: "农业", openType: 'share', icon: '/static/logo.png'},
						// {title: "社区", icon: '/static/logo.png'},
						// {title: "IT", openType: 'redirectTo', url: '/pages/field/index', icon: '/static/logo.png'},
						// {title: "少儿", icon: '/static/logo.png'},
						// {title: "健身", icon: '/static/logo.png'},
						// {title: "养生", icon: '/static/logo.png'},
						// {title: "保健", icon: '/static/logo.png'},
						// {title: "全部", icon: '/static/logo.png'},
				]
			};
		},
		created() {
			this.getClass()
		},
		methods:{
			getClass(){
				getClass({
					page: this.page,
					size: this.size
				}).then(res => {
					let menuTmp = []
					for (let menuIndex in res.data) {
						let menuChild = {
							title: res.data[menuIndex]['class_id_name'],
							icon:	res.data[menuIndex]['class_cover_img']
						}
						menuTmp.push(menuChild)
					}
					this.menu = menuTmp
					++this.k
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.menu{
	// border: 1px solid red;
}
</style>
