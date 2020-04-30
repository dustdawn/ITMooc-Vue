import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/home/page/home'
import Welcome from '@/components/home/page/welcome'

import user_list from '@/components/user/page/user_list'

import role_list from '@/components/permission/page/role_list'
import menu_list from '@/components/permission/page/menu_list'

import office_list from '@/components/office/page/office_list'

import page_list from '@/components/cms/page/page_list'
import page_add from '@/components/cms/page/page_add'
import page_edit from '@/components/cms/page/page_edit'
import page_html from '@/components/cms/page/page_html'

import banner from '@/components/cms/page/banner'
import course_hot from '@/components/cms/page/course_hot'
import course_java from '@/components/cms/page/course_java'
import course_c from '@/components/cms/page/course_c'


Vue.use(Router)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

// export default new VueRouter({
const router = new Router({
  routes: [
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      component: Home,
      // 重定向到子路由，如果直接匹配子路由则加载父路由
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/user/page/list', name: '用户列表',component: user_list,hidden: false },
        { path: '/permission/page/role', name: '角色列表',component: role_list,hidden: false },
        { path: '/permission/page/menu', name: '权限列表',component: menu_list,hidden: false },
        { path: '/office/page/list', name: '组织列表',component: office_list,hidden: false },

        { path: '/cms/page/list', name: '页面列表',component: page_list,hidden: false },
        { path: '/cms/page/add', name: '添加页面', component: page_add, hidden: true},
        { path: '/cms/page/edit/:pageId', name:'修改页面',component: page_edit,hidden:true},
        { path: '/cms/page/html/:pageId', name:'生成html',component: page_html,hidden:true},

        { path: '/cms/page/banner', name: '轮播图',component: banner,hidden: false },
        { path: '/cms/page/hot', name: '热门课程',component: course_hot,hidden: false },
        { path: '/cms/page/java', name: '热门课程',component: course_java,hidden: false },
        { path: '/cms/page/c', name: '热门课程',component: course_c,hidden: false }
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
