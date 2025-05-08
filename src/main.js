import {plugin, defaultConfig} from "@formkit/vue"

import "@formkit/themes/genesis"
import i18n from './locals/index'  // 引入
import {vuetifyPlugin} from "./vuetify/"
import Viewer from 'v-viewer';
import VueDatePicker from '@vuepic/vue-datepicker';
import {PerfectScrollbarPlugin} from 'vue3-perfect-scrollbar';
import Vue3Toastify from 'vue3-toastify';
import VResizeDrawer from "@wdns/vuetify-resize-drawer"

import "roboto-fontface/css/roboto/roboto-fontface.css"
import "./styles/index.scss"
import "./mock"

//  vue-datepicker 的样式 
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue3-perfect-scrollbar/style.css';
import "vue3-toastify/dist/index.css";
import mitt from './util/mitt';
import {formatDate, printTable} from './util/util';

import {createPinia} from 'pinia'

import {createApp} from "vue"
import App from "./App.vue"
// 指令
import {setupAuth} from './directives'
import router from "./router/"
import store from "./store"

const setupAll = async () => {
  const pinia = createPinia()
  const app = createApp(App)
  const emitter = mitt()

  // 从环境变量获取版本号
  const appVersion = import.meta.env.VITE_APP_VERSION || 'unknown';
  const buildTime = import.meta.env.VITE_APP_BUILD_TIME || 'unknown';

  app.use(pinia)

// Configure plugins
  app.use(vuetifyPlugin)
  app.use(PerfectScrollbarPlugin)
  app.use(Vue3Toastify, {
    autoClose: 900,
    autoHideDuration: 900,
    closeOnClick: false,
    position: "bottom-center"
  })
  app.use(router)
  app.use(store)
// formkit 组件挂载
  app.use(plugin, defaultConfig);
// 使用国际化
  app.use(i18n)
// directives 指令
  setupAuth(app)

// 添加全局事件总线
  app.config.globalProperties.$emitter = emitter
// 全局filter
  app.config.globalProperties.$filters = {
    formatDate: (value, format) => formatDate(value, format)
  }
// 全局打印通用方法
  app.config.globalProperties.$print = printTable;

  app.use(Viewer, {
    Options: {
      inline: true,
      button: true, //右上角按钮
      navbar: true, //底部缩略图
      title: true, //当前图片标题
      toolbar: true, //底部工具栏
      tooltip: true, //显示缩放百分比
      movable: true, //是否可以移动
      zoomable: true, //是否可以缩放
      rotatable: true, //是否可旋转
      scalable: true, //是否可翻转
      transition: true, //使用 CSS3 过度
      fullscreen: true, //播放时是否全屏
      keyboard: true, //是否支持键盘
      url: 'data-source'
    }
  });

  app.component("VResizeDrawer", VResizeDrawer)

  // Provide 版本号和构建时间
  app.provide('VUE_APP_VERSION', appVersion);
  app.provide('VUE_APP_BUILD_TIME', buildTime);
  console.log(`App Version: ${appVersion}, Build Time: ${buildTime}`);

  // 项目部署的区域
  app.provide('VUE_APP_REGION', 'Scunthorpe');

  // vuetify3  v-time-picker 组件尚未发布 ,不可用 , 暂用这个替换
  // https://vue3datepicker.com/installation/
  app.component('VueDatePicker', VueDatePicker);
  await router.isReady();
  app.mount('#app');
}

setupAll()
