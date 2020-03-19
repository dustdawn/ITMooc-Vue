import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home/page/home.vue'
import Welcome from '../components/home/page/welcome.vue'
import course_list from '../components/course/page/course_list.vue'
import course_add from '../components/course/page/course_add.vue'
import course_manage from '../components/course/page/course_manage.vue'

import course_baseinfo from '../components/course/page/course_manage/course_baseinfo.vue'
import course_picture from '../components/course/page/course_manage/course_picture.vue'
import course_plan from '../components/course/page/course_manage/course_plan.vue'
import course_pub from '../components/course/page/course_manage/course_pub.vue'
import course_summary from '../components/course/page/course_manage/course_summary.vue'
import course_teacher from '../components/course/page/course_manage/course_teacher.vue'
Vue.use(Router)

// export default new VueRouter({
const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      // 重定向到子路由，如果直接匹配子路由则加载父路由
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/course/list', name: '我的课程',component: course_list,hidden: false },
        { path: '/course/add/base', name: '新增课程',component: course_add,hidden: true },
        { path: '/course/manage/:courseid', name: '管理课程',component: course_manage,hidden: true ,
          children: [
            { path: '/course/manage/plan/:courseid', name: '课程计划',component: course_plan,hidden: false },
            { path: '/course/manage/baseinfo/:courseid', name: '基本信息',component: course_baseinfo,hidden: false },
            { path: '/course/manage/picture/:courseid', name: '课程图片',component: course_picture,hidden: false },
            { path: '/course/manage/teacher/:courseid', name: '教师信息',component: course_teacher,hidden: false},
            { path: '/course/manage/pub/:courseid', name: '发布课程',component: course_pub,hidden: false},
            { path: '/course/manage/summary/:courseid', name: '课程首页',component: course_summary,hidden: false }
          ]}
      ]
    }
  ]
})

export default router
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
