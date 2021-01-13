import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/global.css"

// 引入axios组件
import axios from "./utils/request"
Vue.prototype.$axios = axios;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入Echarts
import echarts from "echarts"
Vue.prototype.$echarts = echarts
import treeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',treeTable)

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' //进口方式
import 'quill/dist/quill.snow.css' //雪主题
import 'quill/dist/quill.bubble.css' //用于气泡主题
Vue.use(VueQuillEditor, /* { default global options } */)

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to即将访问的路径
  //from代表从那个路径跳转
  //next是一个函数 表示放行
  if(to.path === "/login") return next();

  //当对应的user_token值发生改变时跳转页面
  const tokenStr = window.sessionStorage.getItem("token")

  if(!tokenStr) return next("/login")

  next()
})

Vue.config.productionTip = false

// 全局过滤器
Vue.filter("timefn", (dateTimeStamp) => {
  let result = null;
  dateTimeStamp = new Date(dateTimeStamp).getTime()
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var year = month * 12
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  var yearC = diffValue / year
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (yearC >= 1) {
    result = "" + parseInt(yearC) + "年前";
  } else if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
