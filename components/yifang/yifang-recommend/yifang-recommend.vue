<template>
	<view>
		 <uni-list>
			 
			<uni-list-item title="推荐阅读" :showArrow="false"></uni-list-item>
			 
		    <uni-list-chat :show-extra-icon="true" 
				avatar="http://cdn.fologde.com/7.png"
				link=""
				note="描述"
				title="三国志" ></uni-list-chat>
			 
		    <uni-list-chat :show-extra-icon="true" 
				avatar="http://cdn.fologde.com/7.png"
				note="描述"
				title="西游记" ></uni-list-chat>
				
			<uni-list-chat :show-extra-icon="true" 
				avatar="http://cdn.fologde.com/7.png"
				note="描述"
				title="钢铁试试怎样炼成的" ></uni-list-chat>
			<uni-list-chat :show-extra-icon="true" 
				avatar="http://cdn.fologde.com/7.png"
				note="描述"
				title="列表左侧带扩展图标" ></uni-list-chat>
			<uni-list-chat :show-extra-icon="true" 
				avatar="http://cdn.fologde.com/7.png"
				note="描述"
				title="列表左侧带扩展图标" ></uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
	// 跟多关于列表的说明:https://ext.dcloud.net.cn/plugin?id=24
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniListChat from '@/components/uni-list-chat/uni-list-chat.vue'
	
	export default {
		name: "yifangRecommend",
		components: {uniList, uniListItem, uniListChat},
		data() {
			return {
				
			}
		},
		created() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>

</style>
