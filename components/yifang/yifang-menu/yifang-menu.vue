<template>
	
</template>

<script>
	import {getClass} from '@/util/user_http/menu.js'
	export default {
		name: "yifangMenu",
		components: {juNavigatorGrid},
		data() {
			return {
				page: 1,
				size: 15,
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
					// 在菜单中插入全部按钮  点击按钮可跳转全部菜单页
					menuTmp.push({
						title: "全部",
					})
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
