import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import {getToken, removeToken} from '@/utils/auth'
import router from "@/router";
import errorCode from "@/utils/errorCode";
import modal from "@/utils/modal";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

export function upload(url, param, isAdmin = false, option) {
  let config;
  if (isAdmin) {
    config = {
      headers: {"Authorization": localStorage.getItem("adminToken"), "Content-Type": "multipart/form-data"},
      timeout: 60000
    };
  } else {
    config = {
      headers: {"Authorization": localStorage.getItem("userToken"), "Content-Type": "multipart/form-data"},
      timeout: 60000
    };
  }
  if (typeof option !== "undefined") {
    config.onUploadProgress = progressEvent => {
      if (progressEvent.total > 0) {
        progressEvent.percent = progressEvent.loaded / progressEvent.total * 100;
      }
      option.onProgress(progressEvent);
    };
  }

  return new Promise((resolve, reject) => {
    axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
  });
}

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = getToken()
    if (token){
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }else {
      if (!config.url.includes( 'login'))
        if (router.path !== '/login')
          router.push("/login")
    }
    if (config.method === 'get') {
      // config.paramsSerializer = function(params) {
      //   // return qs.stringify(params, { arrayFormat: 'repeat' })
      // }
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const code = res.code || 200;
    const msg = errorCode[code] || res.msg || errorCode['default']
    if (res.url === "/login"){
      return res
    }
    if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeToken()
        if (router.path !== "login")
          router.push( '/login');
      }).catch(() => {
      });
      modal.msgError('无效的会话，或者会话已过期，请重新登录。')
      return Promise.reject("error")
    } else if (code === 500) {
      Message({message: msg, type: 'error'})
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      Message({message: msg, type: 'warning'})
      return Promise.reject('error')
    } else if (code !== 200) {
      // modal.notify(msg)
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    let {message} = error;
    if (message === "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({message: message, type: 'error', duration: 5 * 1000})
    return Promise.reject(error)
  }
)

export default service
