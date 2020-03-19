<template>
  <div>
    <h3>我的课程</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的课程</el-breadcrumb-item>

    </el-breadcrumb>

    <section>
      <el-row >
        <!--新增课程-->
        <el-col :span="8"  :offset=2 >
          <el-card :body-style="{ padding: '10px' }">
            <img src="/static/images/add.png" class="image" height="200px">
            <div style="padding: 10px;">
              <span>课程名称</span>
              <div class="bottom clearfix">
                <time class="time"></time>
                <router-link class="mui-tab-item" :to="{path:'/course/add/base'}">
                  <el-button type="text" class="button" >新增课程</el-button>
                </router-link>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8" v-for="(course, index) in courses" :key="course.id" :offset="index > 0 ? 2 : 2">
          <el-card :body-style="{ padding: '10px' }">
            <img :src="course.pic!=null?imgUrl+course.pic:'/static/images/none.png'" class="image" height="200px">
            <div style="padding: 10px;">
              <span>{{course.name}}</span>
              <div class="bottom clearfix">
                <time class="time"></time>
                <el-button type="text" class="button" @click="handleManage(course.id)">管理课程</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

        <!--分页-->
        <el-col :span="24" class="toolbar">
          <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size"
                         :total="total" :current-page="page"
                         style="float:right;">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
  </div>



</template>

<script>
  import * as courseApi from '../api/course';
  let sysConfig = require('@/../config/sysConfig')
  export default {
    data() {
      return {
        page:1,
        size:7,
        total: 0,
        courses: [],
        sels: [],//列表选中列
        imgUrl:sysConfig.imgUrl
      }
    },
    methods: {
      //分页方法
      handleCurrentChange(val) {
        console.log("当前页为：" + val);
        this.page = val;
        this.getCourse();
      },
      //获取课程列表
      getCourse() {
        courseApi.findCourseList(this.page,this.size,{}).then((res) => {
          console.log(res);
          if(res.success){
            this.total = res.queryResult.total;
            this.courses = res.queryResult.list;
          }

        });
      },
      handleManage: function (id) {
        console.log(id)
        this.$router.push({ path: '/course/manage/'+id})
      }

    },
    created(){


    },
    mounted() {
      //查询我的课程
      this.getCourse();
    }
  }
</script>

<style lang="less" scoped>
  .el-col-8{
    width:20%
  }
  .el-col-offset-2{
    margin-left:2%
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

</style>
