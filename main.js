import Vue from 'vue'
import App from './App'
import Config from '@/util/config.js'

Vue.config.productionTip = false
Vue.prototype.$yifangConfig = Config // 挂载全局配置

App.mpType = 'app'

const app = new Vue({
	...App
}).$mount()
