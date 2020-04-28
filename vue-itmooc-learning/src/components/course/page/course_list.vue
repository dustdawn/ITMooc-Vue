<template>
  <div class="personal-content">
    <el-card style="height: 700px">

      <div class="only-setting">
        <div class="title">
          <div class="lab-title">全部课表</div>
        </div>
      </div>

      <el-table
        :data="courseList"
        style="width: 100%;height: 550px"
        @row-click=clickRow>
        <el-table-column
          prop="name"
          label="课程名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="users"
          label="课程针对人群"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="课程介绍"
        >
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[1, 2, 5, 10]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import * as courseApi from '../api/course'
  import * as systemApi from '@/base/api/system'
  import utilApi from '../../../common/utils';
  export default {
    components: {},
    data() {
      return {
        user: {},
        page:1,
        size: 5,
        courseList:[],
        total:0

      }
    },

    methods: {
      getCourseList() {
        let params = {
          userId: this.user.userid
        }
        //console.log(params)

        courseApi.course_list(this.page,this.size,params).then((res)=>{
          //console.log(res)
          if(res.success){
            this.courseList = res.queryResult.list;
            // console.log(this.courseList)
            //查询 课程 信息
            let courseIds=[]
            this.courseList.forEach((item,index)=>{
                courseIds.push(item.courseId)
              }
            )
            var params = {
              courseIds: courseIds.toString()
            }
            this.findCourseByIds(this.page,this.size,params);
          }
        })
      },
      findCourseByIds(page,size,params){
        //根据课程id取课程信息

        systemApi.course_findByIds(page,size,params).then((res)=>{
          if (res.success) {
            this.courseList = res.queryResult.list;
            this.total = res.queryResult.total;
            console.log(this.courseList)
          }
        })
      },
      // 获得当前用户
      refresh_user:function(){
        let activeUser= utilApi.getActiveUser();
        if(activeUser){
          this.logined = true
          this.user = activeUser;
          // console.log("this.user", this.user)
        }
      },

      clickRow(e) {
        console.log(e)

        window.open("http://www.itmooc.com/course/detail/" +  e.id + ".html","_blank");
      },

      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.size = newSize
        this.getCourseList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.page = newPage
        this.getCourseList()
      }
    },
    created(){
      this.refresh_user()
      this.getCourseList()
    },
    mounted() {




    }
  }

</script>

<style>
  @import './../../../../static/plugins/normalize-css/normalize.css';
  /*@import './../../../../static/plugins/bootstrap/dist/css/bootstrap.css';*/
  @import './../../../../static/css/page-learing-personal.css';
  @import './../../../../static/css/page-learing-personal-mail.css';


</style>
