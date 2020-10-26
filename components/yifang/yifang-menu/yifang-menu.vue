<template>
	<view class="menu">
		<ju-navigator-grid element-id="navigatorMenu" 
		:list="menu" @press="onPress" height="170" size="70"/>
	</view>
</template>

<script>
	// 该组件的更多用法:https://ext.dcloud.net.cn/plugin?id=1616
	import juNavigatorGrid from '@/components/ju-navigator-grid/ju-navigator-grid.vue'
	export default {
		name: "yifangMenu",
		components: {juNavigatorGrid},
		data() {
			return {
				menu:[
						{title: "历史", url: '/pages/field/index', icon: "/static/logo.png"},
						{title: "科学", url: 'https://baidu.com', icon: '/static/logo.png'},
						{title: "工业", type: 'custom', icon: '/static/logo.png'},
						{title: "农业", openType: 'share', icon: '/static/logo.png'},
						{title: "社区", icon: '/static/logo.png'},
						{title: "IT", openType: 'redirectTo', url: '/pages/field/index', icon: '/static/logo.png'},
						{title: "少儿", icon: '/static/logo.png'},
						{title: "健身", icon: '/static/logo.png'},
						{title: "养生", icon: '/static/logo.png'},
						{title: "保健", icon: '/static/logo.png'}
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
.menu{
	// border: 1px solid red;
}
</style>
