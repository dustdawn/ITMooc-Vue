<template>
  <div>

    <h3>管理课程</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/course/list' }">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item>管理课程</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        text-color="#545c64"
        active-text-color="#000000"
       @select="handleSelect">
          <el-menu-item index="summary">组织信息</el-menu-item>
          <el-menu-item index="baseinfo">基本信息</el-menu-item>
          <el-menu-item index="picture">课程图片</el-menu-item>
          <el-menu-item index="plan">课程计划</el-menu-item>
          <el-menu-item index="teacher">教师信息</el-menu-item>
          <el-menu-item index="pub">课程发布</el-menu-item>
      </el-menu>
      <router-view class="main"></router-view>
    </el-card>



  </div>
</template>
<script>
  import * as courseApi from '../api/course';
  export default {
    data() {
      return {
        activeIndex:'2',
        courseid:''
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({ path: '/course/manage/'+ key + '/'+this.courseid})
      }
    },
    mounted(){

      //课程id
      this.courseid = this.$route.params.courseid

      //console.log("courseid=" + this.courseid)
      //跳转到课程基本信息
      this.$router.push({ path: '/course/manage/summary/'+this.courseid})
      //this.$router.push({ path: '/course/manage/baseinfo/'+this.courseid})

    }
  }
</script>

<style lang="less" scoped>
  .main {
    margin-top: 20px;
  }

</style>
