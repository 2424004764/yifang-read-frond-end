export function _menuJump(menuItem){
	switch(menuItem.jumpType){
		case 'navigateTo':
			uni.navigateTo({
			    url: menuItem.jumpPage
			})
			break
		default:
			break
	}
}