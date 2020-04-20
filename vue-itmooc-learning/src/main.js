// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'


import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
import 'videojs-contrib-hls/dist/videojs-contrib-hls'


import utilApi from './common/utils';
import * as systemApi from './base/api/system';

Vue.config.productionTip = false


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueVideoPlayer)


let sysConfig = require('@/../config/sysConfig')
let openAuthenticate = sysConfig.openAuthenticate
let openAuthorize = sysConfig.openAuthorize


router.beforeEach((to, from, next) => {
  if(openAuthenticate){
    //console.log("to",to)
    //console.log("from",from)
    //***********身份校验***************
    let activeUser
    let uid
    try{
      activeUser = utilApi.getActiveUser()
      uid = utilApi.getCookie("uid")
    }catch(e){
      alert(e)
    }

    if(activeUser && uid && uid == activeUser.uid) {
      next();
    }else if(to.path =='/login' || to.path =='/logout'){
      next();
    }else if(uid){

      //请求获取jwt
      systemApi.getjwt().then((res)=>{
        if(res.success){
          let jwt = res.jwt;
          let activeUser = utilApi.getUserInfoFromJwt(jwt)
          if(activeUser){
            utilApi.setUserSession("activeUser",JSON.stringify(activeUser))
          }
          next();
        }else{
          //跳转到统一登陆
          window.location = "http://ucenter.itmooc.com/#/login?returnUrl="+ Base64.encode(window.location)
        }
      })
    }else{
      //跳转到统一登陆
      window.location = "http://ucenter.itmooc.com/#/login?returnUrl="+ Base64.encode(window.location)
    }
  }else{
    next();
  }

});



import axios from 'axios'
import { Message } from 'element-ui';

// 添加请求拦截器，实现http请求添加Authorization头信息
axios.interceptors.request.use(function (config) {
  // 在发送请求向header添加jwt
  let jwt = utilApi.getJwt()
  if(jwt){
    config.headers['Authorization'] = 'Bearer '+jwt
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
// 响应拦截
axios.interceptors.response.use(data => {
  console.log("data=",data)
  if(data && data.data){
    if(data.data.code && data.data.code =='10001'){
      //需要登录
      // router.push({
      //   path: '/login',
      //   query: {returnUrl: Base64.encode(window.location)}
      // })
      window.location = "http://ucenter.itmooc.com/#/login?returnUrl="+ Base64.encode(window.location)
    }else if(data.data.code && data.data.code =='10002'){
      Message.error('您没有此操作的权限，请与客服联系！');
    }else if(data.data.code && data.data.code =='10003'){
      Message.error('认证被拒绝，请重新登录重试！');
    }
  }
  return data
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
