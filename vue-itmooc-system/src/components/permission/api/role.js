import http from '@/base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

// 获取菜单列表
export const role_list = () => {
  return http.requestQuickGet(apiUrl+'/ucenter/role/list')
}
// 获取菜单树形列表
export const menu_node = () => {
  return http.requestQuickGet(apiUrl+'/ucenter/menu/node')
}
// 添加角色
export const role_add = params => {
  return http.requestPost(apiUrl+'/ucenter/role/add',params)
}
// 查询角色
export const role_get= id => {
  return http.requestQuickGet(apiUrl+'/ucenter/role/get/'+ id)
}
//修改角色
export const role_update = (id, params) => {
  return http.requestPut(apiUrl+'/ucenter/role/update/'+ id, params)
}
//删除角色
export const role_delete = id => {
  return http.requestDelete(apiUrl+'/ucenter/role/delete/'+ id)
}
// 角色授权
export const assign_right = (roleId, menuIds) => {
  return http.requestPut(apiUrl+'/ucenter/role/assign/'+ roleId + '/' + menuIds)
}
// 角色取消授权
export const revoke_right = (roleId, menuId) => {
  return http.requestPut(apiUrl+'/ucenter/role/revoke/'+ roleId + '/' + menuId)
}
