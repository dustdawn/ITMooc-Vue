import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/page/home.vue'
import course_list from '@/components/course/page/course_list.vue'
import personal_setting from '@/components/course/page/personal_setting.vue'
import learning_video from '@/components/course/page/learning_video.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        { path: '/', name: '课程列表',component: course_list,hidden: false },
        { path: '/setting', name: '个人设置',component: personal_setting,hidden: false }
      ]
    },
    {
      path: '/learning/:courseId/:chapter',
      component: learning_video,
      name: '录播视频学习',
      hidden: false,
      iconCls: 'el-icon-document'
    }
  ]
})
