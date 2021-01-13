// 1. 先导入axios对象
import axios from "axios";

import store from "@/store/index";

//2. 创建axios的实例
const Server = axios.create({
  baseURL:'https://www.liulongbin.top:8888/api/private/v1/',
  timeout: 5000, //超时5s
});

//3. 定义一个请求拦截器
Server.interceptors.request.use((config) => {
  //在request拦截器中  展示进度条
  // NProgress.start()

  config.headers.Authorization = sessionStorage.getItem("token");
  //console.log(config);

  store.commit("changeLoading", true) //修改Loading的值

  return config;
}, (error) => {
  return Promise.reject(error)
});

//4.response拦截器
Server.interceptors.response.use((response) => {
  //在response拦截器中  隐藏进度条
  // NProgress.done()

 // console.log(response.data);
//   判断如果接口的状态为200的话，返回data数据即可
  if(response.status == 200){
      // store.commit("changeLoading",false)//修改Loading的值
      return response.data;
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

//5. 抛出实例
export default Server;
