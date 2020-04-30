import http from '@/base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.ApiUrlPre;

/*页面列表*/
export const page_list = (page,size,params) => {
  //params为json格式:查询条件站点id和别名
  //使用querystring将json对象转成key/value串
  let querys = querystring.stringify(params)
  return http.requestQuickGet(apiUrl+'/cms/page/list/'+page+'/'+size+'/?'+querys)
}
/*页面站点列表*/
export const site_list = () => {
  return http.requestQuickGet(apiUrl+'/cms/site/list');
}
/*页面模板列表*/
export const template_list = () => {
  return http.requestQuickGet(apiUrl+'/cms/template/list');
}
/*页面添加*/
export const page_add = params => {
  return http.requestPost(apiUrl+'/cms/page/add',params)
}
/*页面修改*/
export const page_edit = (id, params) => {
  return http.requestPut(apiUrl+'/cms/page/edit/'+id,params)
}
/*页面查询*/
export const page_get = id => {
  return http.requestQuickGet(apiUrl+'/cms/page/get/'+id)
}
/*页面删除*/
export const page_del = id => {
  return http.requestDelete(apiUrl+'/cms/page/del/'+id)
}
/*生成静态文件 */
export const page_generateHtml= (id, params) => {
  //let querys = querystring.stringify(params)
  //console.log(querys)
  return http.requestPost(apiUrl+'/cms/page/generateHtml/'+id, params)
}
/*取出静态文件 */
/*export const page_getHtml= id => {
  return http.requestQuickGet(apiUrl+'/cms/page/getHtml/'+id)
}*/
/*发布页面*/
export const page_postPage= id => {
  return http.requestPost(apiUrl+'/cms/page/postPage/'+id)
}


export const get_model= id => {
  return http.requestGet(apiUrl+'/cms/config/getModel/'+id)
}

