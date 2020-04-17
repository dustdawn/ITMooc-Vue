import http from '@/base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

// 获取用户列表
export const user_list = (page,size,params) => {
  let querys = querystring.stringify(params)
  return http.requestQuickGet(apiUrl+'/ucenter/user/list/'+page+'/'+size+'/?'+querys)
}
// 修改用户状态
export const user_edit_status = (id,status) => {
  return http.requestPut(apiUrl+'/ucenter/user/update/'+id+'/'+status)
}
// 添加用户
export const user_add = params => {
  return http.requestPost(apiUrl+'/ucenter/user/add',params)
}
// 查询用户
export const user_get= id => {
  return http.requestQuickGet(apiUrl+'/ucenter/user/get/'+ id)
}
//修改用户
export const user_update = (id, params) => {
  return http.requestPut(apiUrl+'/ucenter/user/update/'+ id, params)
}
//删除用户
export const user_delete = id => {
  return http.requestDelete(apiUrl+'/ucenter/user/delete/'+ id)
}
//获取所有角色
export const role_list = () => {
  return http.requestQuickGet(apiUrl+'/ucenter/role/list')
}
//获取当前用户角色
export const user_roles = id => {
  return http.requestQuickGet(apiUrl+'/ucenter/user/roleList/'+ id)
}
// 用户授权
export const assign_roles = (userId, roleIds) => {
  return http.requestPut(apiUrl+'/ucenter/user/assign/'+ userId + '/' + roleIds)
}
