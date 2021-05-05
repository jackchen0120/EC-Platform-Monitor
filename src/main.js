import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入字体文件
import './assets/font/iconfont.css'
// 引入全局的样式文件
import './assets/css/global.less'
import SocketService from '@/utils/socket_service'
// 对服务端进行websocket的连接
SocketService.Instance.connect()
// 将SocketService对象挂载到Vue的原型对象上
// 在别的组件中使用 this.$socket
Vue.prototype.$socket = SocketService.Instance;

// 请求基准路径的配置
axios.defaults.baseURL = '/api/'
// 将axios挂载到Vue的原型对象上
// 在别的组件中使用 this.$http
Vue.prototype.$http = axios

// 将全局的echarts对象挂载到Vue的原型对象上
// 在别的组件中使用 this.$echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
