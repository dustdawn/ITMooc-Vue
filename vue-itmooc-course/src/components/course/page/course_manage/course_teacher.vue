<template>
  <div>
    <h3 class="welcome">{{name}}</h3>
    <el-card class="box-card">

      <div slot="header" class="clearfix">
        <span>简介</span>
      </div>
      <div class="intro">
        {{intro }}
      </div>
    </el-card>
  </div>
</template>
<script>
  import * as courseApi from '../../api/course';
  export default {

      data() {
        return {
          teacherId:'',
          name:'',
          intro:''
        }
      },
      created() {
        this.courseid = this.$route.params.courseid;
        courseApi.getCourseBaseById(this.courseid).then((res) => {
          //console.log("课程信息",res)
          this.teacherId = res.userId;
          courseApi.getTeacherInfo(this.teacherId).then(res => {
            console.log(res)
            this.name = res.name;
            this.intro = res.intro;
          })
        })


      }
    }
</script>

<style lang="less" scoped>
  .welcome {
    width: 150px;
    float: left;
    color: #475669;
  }
  .intro {
    color: #475669;
    text-color:"#545c64";
  }
</style>
