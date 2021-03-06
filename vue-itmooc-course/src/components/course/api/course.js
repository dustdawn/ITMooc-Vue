import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

//查询课程列表
//我的课程列表
export const findCourseList = (page,size,params) => {
//使用工具类将json对象转成key/value
  let queries = querystring.stringify(params)
  return http.requestQuickGet(apiUrl+"/course/coursebase/list/"+page+"/"+size+"?"+queries)
}

//查询课程分类
export const category_findlist= () => {
  return http.requestQuickGet(apiUrl+'/course/category/list')
}
/*添加课程基础信息*/
export const addCourseBase = params => {
  return http.requestPost(apiUrl+'/course/coursebase/add',params)
}

/*查询课程信息*/
export const getCourseBaseById = courseId => {
  return http.requestQuickGet(apiUrl+'/course/coursebase/get/'+courseId)
}

/*更新课程信息*/
export const updateCourseBase = (id,params) => {
  return http.requestPut(apiUrl+'/course/coursebase/update/' +  id, params)
}

/*删除课程*/
export const delCourseBase = (id) => {
  return http.requestDelete(apiUrl+'/course/coursebase/delete/' +  id)
}

/*查询课程计划*/
export const findTeachplanList = courseid => {
  return http.requestQuickGet(apiUrl+'/course/teachplan/list/'+courseid)
}

/*查询课程计划*/
export const getTeachplanById = id => {
  return http.requestQuickGet(apiUrl+'/course/teachplan/get/'+id)
}

/*添加课程计划*/
export const addTeachplan = teachplan => {
  return http.requestPost(apiUrl+'/course/teachplan/add',teachplan)
}

/*修改课程计划*/
export const updateTeachplan = (id, params) => {
  return http.requestPut(apiUrl+'/course/teachplan/update/' + id,params)
}

/*删除课程计划*/
export const delTeachplan = id => {
  return http.requestDelete(apiUrl+'/course/teachplan/del/' + id)
}

//保存课程图片地址到课程数据库
export const addCoursePic= (courseId,pic) => {
  return http.requestPost(apiUrl+'/course/coursepic/add?courseId='+courseId+"&pic="+pic)
}


//查询课程图片
export const findCoursePicList = courseId => {
  return http.requestQuickGet(apiUrl+'/course/coursepic/list/'+courseId)
}

//删除课程图片
export const deleteCoursePic= courseId => {
  return http.requestDelete(apiUrl+'/course/coursepic/delete?courseId='+courseId)
}
/*预览课程*/
export const preview = id => {
  return http.requestPost(apiUrl+'/course/preview/'+id);
}
/*发布课程*/
export const publish = id => {
  return http.requestPost(apiUrl+'/course/publish/'+id);
}
//查询课程信息
export const findCourseView = courseId => {
  return http.requestQuickGet(apiUrl+'/course/courseview/'+courseId)
}

/*保存媒资信息*/
export const savemedia = teachplanMedia => {
  return http.requestPost(apiUrl+'/course/savemedia',teachplanMedia);
}

/*查询教师信息*/
export const getTeacherInfo = id => {
  return http.requestGet(apiUrl+'/course/teacher/'+ id);
}

/*查询组织信息*/
export const getOfficeInfo = officeId => {
  return http.requestGet(apiUrl+'/ucenter/office/get/'+ officeId);
}

