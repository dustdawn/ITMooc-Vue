<template>
  <div>
    <h3>我的课程</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的课程</el-breadcrumb-item>

    </el-breadcrumb>

    <section style="height: 520px">
      <el-row>
        <!--新增课程-->
        <el-col :span="8" :offset=2 >
          <el-card :body-style="{ padding: '10px' }">
            <img src="/static/images/add.png" class="image" height="150px">
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

        <el-col :span="8" v-for="(course, index) in course1" :key="course.id" :offset="index > 0 ? 2 : 2">
          <el-card :body-style="{ padding: '10px' }">
            <img :src="course.pic!=null?imgUrl+course.pic:'/static/images/none.png'" class="image" height="150px">
            <div style="padding: 10px;">
              <span>{{course.name}}</span>
              <div class="bottom clearfix">
                <time class="time"><a href="javascript:;" class="time" @click="deleteCourse(course.id)">删除课程</a></time>
                <el-button type="text" class="button" @click="handleManage(course.id)">管理课程</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>
      <el-row>

        <el-col :span="8" v-for="(course, index) in course2" :key="course.id" :offset="index > 0 ? 2 : 2">
          <el-card :body-style="{ padding: '10px' }">
            <img :src="course.pic!=null?imgUrl+course.pic:'/static/images/none.png'" class="image" height="150px">
            <div style="padding: 10px;">
              <span>{{course.name}}</span>
              <div class="bottom clearfix">
                <time class="time"><a href="javascript:;" class="time" @click="deleteCourse(course.id)">删除课程</a></time>
                <el-button type="text" class="button" @click="handleManage(course.id)">管理课程</el-button>
              </div>
            </div>
          </el-card>
        </el-col>

      </el-row>


    </section>

    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size"
                     :total="total" :current-page="page"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </div>



</template>

<script>
  import * as courseApi from '../api/course';
  import utilApi from '../../../common/utils'
  let sysConfig = require('@/../config/sysConfig')
  export default {
    data() {
      return {
        user: {},
        page:1,
        size:7,
        total: 0,
        courses: [],
        course1:[],
        course2:[],
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
        this.course1 = []
        this.course2 = []
      },
      //获取课程列表
      getCourse() {
        let params = {
          officeId: this.user.officeId
        }
        console.log(this.user)
        courseApi.findCourseList(this.page,this.size,params).then((res) => {
          console.log(res);
          if(res.success){
            this.total = res.queryResult.total;
            this.courses = res.queryResult.list;
            for (let i = 0; i < this.courses.length; i++) {
                if (i<3) {
                  this.course1.push(this.courses[i])
                }else {
                  this.course2.push(this.courses[i])
                }
            }
            console.log(this.course1)
            console.log(this.course2)

          }

        });
      },
      handleManage: function (id) {
        //console.log(id)
        this.$router.push({ path: '/course/manage/'+id})
      },

      async deleteCourse(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
          '此操作将永久删除该课程, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)

        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }

        courseApi.delCourseBase(id).then(res => {
          if (!res.success) {
            return
            // return this.$message.error('删除课程失败！' + res.message)
          }
          this.$message.success('删除课程成功！')
          this.course1 = []
          this.course2 = []
          this.getCourse()
        })
      }

    },
    created(){
      let activeUser= utilApi.getActiveUser();

      if(activeUser){
        this.logined = true
        this.user = activeUser;
        //console.log(this.user)
      }

    },
    mounted() {
      //查询我的课程
      this.getCourse();
    }
  }
</script>

<style lang="less" scoped>
  .el-col-8{
    width:20%;
    padding-bottom: 20px;
  }
  .el-col-offset-2{
    margin-left:2%
  }
  .time {
    font-size: 13px;
    color: #999;
    text-decoration:none;
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
  .toolbar {
    bottom: 0;
  }
</style>
