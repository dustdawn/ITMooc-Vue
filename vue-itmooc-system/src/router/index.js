import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/home/page/home'
import Welcome from '@/components/home/page/welcome'
import page_list from '@/components/cms/page/page_list'
import page_add from '@/components/cms/page/page_add'
import page_edit from '@/components/cms/page/page_edit'
import page_html from '@/components/cms/page/page_html'

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
    { path: '/', redirect: '/cms' },
    {
      path: '/cms',
      component: Home,
      // 重定向到子路由，如果直接匹配子路由则加载父路由
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/cms/page/list', name: '页面列表',component: page_list,hidden: false },
        { path: '/cms/page/add', name: '添加页面', component: page_add, hidden: true},
        { path: '/cms/page/edit/:pageId', name:'修改页面',component: page_edit,hidden:true},
        { path: '/cms/page/html/:pageId', name:'生成html',component: page_html,hidden:true}
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
