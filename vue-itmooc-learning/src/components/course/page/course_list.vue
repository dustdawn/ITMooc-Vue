<template>
  <div class="personal-cont">
    <div class="my-course">
      <div class="title">
        <div class="lab-title">全部课表</div>
      </div>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
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
        page:1,
        size: 20,
        courseList:[],
        courseMap:{},
        testMap:{
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },

    methods: {
      findCourseByIds(course_ids){
        //根据课程id取课程信息

        console.log(course_ids)
        systemApi.course_findByIds(course_ids).then((res)=>{

          console.log(res)
          this.courseMap = res;
        })
      }
    },
    created(){

      let params = {}

      courseApi.course_list(this.page,this.size,params).then((res)=>{
        console.log(res)
        if(res.success){
          this.courseList = res.queryResult.list;
          console.log(this.courseList)
          //查询 课程 信息
          let courseIds=[]
          this.courseList.forEach((item,index)=>{
              courseIds.push(item.courseId)
            }
          )
          this.findCourseByIds(courseIds.toString())

        }
      })
    },
    mounted() {




    }
  }

</script>

<style>
  @import './../../../../static/plugins/normalize-css/normalize.css';
  /*@import './../../../../static/plugins/bootstrap/dist/css/bootstrap.css';*/
  @import './../../../../static/css/page-learing-personal.css';

</style>
