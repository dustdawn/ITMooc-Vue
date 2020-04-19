import http from '@/base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.ApiUrlPre;

// 添加用户
export const office_list = () => {
  return http.requestQuickGet(apiUrl+'/ucenter/office/list')
}
