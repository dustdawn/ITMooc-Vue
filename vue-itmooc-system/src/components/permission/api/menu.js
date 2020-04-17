import http from '@/base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

// 获取菜单列表
export const menu_list = () => {
  return http.requestQuickGet(apiUrl+'/ucenter/menu/list')
}

