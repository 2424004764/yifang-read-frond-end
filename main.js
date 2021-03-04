import Vue from 'vue'
import App from './App'
import Config from '@/util/config.js'
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false
Vue.prototype.$yifangConfig = Config // 挂载全局配置

import Directives from './directives'
Vue.use(Directives) // 加载自定义指令 和：v-model v-show 一样的自定义指令

App.mpType = 'app'

const app = new Vue({
	...App
}).$mount()
