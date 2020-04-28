<template>
<div>
  <p-head></p-head>

  <!-- 页面 -->
  <div class="container">
    <div class="personal-nav pull-left">
      <div class="nav nav-stacked text-left">
        <div class="title">个人中心</div>
        <div class="my-ico">
          <img src="/static/images/asset-myimg.jpg" alt="">
          <p>{{this.user.username}}</p>
        </div>
        <div class="item">

          <li class="home_li"><a href="#/" class="glyphicon glyphicon-th-list"> 我的课程</a></li>
          <li class="home_li"><a href="#/setting" class="glyphicon glyphicon-user"> 个人设置</a></li>
          <li class="home_li"><a href="javascript:;" @click="logout" class="glyphicon glyphicon-log-out"> 退出<i class="pull-right"></i></a></li>
        </div>
      </div>
    </div>
    <div class="personal-content pull-right">
      <router-view></router-view>
    </div>
  </div>

  <p-foot></p-foot>
</div>
</template>

<script>
  import PHead from '@/components/head.vue';
  import PFoot from '@/components/foot.vue';
  import courseList from '@/components/course/page/course_list.vue';
  import utilApi from '../../../common/utils';
//  import $ from  './../../../../static/plugins/jquery/dist/jquery.js'
//  import './../../../../static/plugins/bootstrap/dist/js/bootstrap.js'
  export default {
    components: {
      PHead,
      PFoot,
      courseList
    },
    data() {
      return {
        user: {}
      }
    },
    methods: {
      //退出登录
      logout: function () {
        this.$confirm('确认退出吗?', '提示', {
        }).then(() => {
          //跳转到统一登陆
          this.$router.push({ path: '/logout'})
        }).catch(() => {

        });
      }
    },
    created() {
      let activeUser= utilApi.getActiveUser();
      if(activeUser){
        this.logined = true
        this.user = activeUser;
        // console.log("this.user", this.user)
      }
    },
    mounted() {
      //跳转到我的课程
      //this.$router.push({ path: '/course'})

    }

  }
</script>

<style>
  @import './../../../../static/plugins/normalize-css/normalize.css';
  /*@import './../../../../static/plugins/bootstrap/dist/css/bootstrap.css';*/
  @import './../../../../static/css/page-learing-personal.css';

  .home_li {
    display: inline;
    line-height: 40px;
  }
  .pull-left {
    float: left !important;
    top: 0px;
  }
  .pull-right {
    float: right !important;
    height: 700px;
    padding-right: 0px;
  }
</style>
