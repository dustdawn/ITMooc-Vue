<template>
  <div>

    <h3>添加课程</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/course/list' }">我的课程</el-breadcrumb-item>
      <el-breadcrumb-item>添加课程</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form :model="courseForm" label-width="80px" :rules="courseRules" ref="cForm">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="适用人群" prop="users">
          <el-input type="textarea" v-model="courseForm.users" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="categoryActive">
          <el-cascader
            v-model="categoryActive"
            :options="categoryList"
            :clearable="true"
            :props="props">
          </el-cascader>
        </el-form-item>
        <el-form-item label="课程等级" prop="grade">
          <b v-for="grade in gradeList">
            <el-radio v-model="courseForm.grade" :label="grade.sdId" >{{grade.sdName}}</el-radio>&nbsp;&nbsp;
          </b>
        </el-form-item>

        <el-form-item label="课程介绍" prop="description">
          <el-input type="textarea" v-model="courseForm.description" ></el-input>
        </el-form-item>

      </el-form>
      <el-button type="primary"  @click.native="save" >提交</el-button>

    </el-card>




  </div>
</template>
<script>

  import * as courseApi from '../api/course';
  import * as systemApi from '../../../base/api/system';
  import utilApi from '../../../common/utils'
  export default {

    data() {
      return {
        user:[],
        gradeList:[],
        props: {
          value: 'id',
          label:'label',
          children:'children',
          expandTrigger: 'hover'
        },
        categoryList: [],
        categoryActive:[],
        courseForm: {
          id:'',
          name: '',
          users: '',
          grade:'',
          mt:'',
          st:'',
          description: '',
          officeId:'',
          userId:''
        },
        courseRules: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          categoryActive: [
            {required: false, message: '请选择课程分类', trigger: 'blur'}
          ],
          grade: [
            {required: true, message: '请选择课程等级', trigger: 'blur'}
          ]


        }
      }
    },
    methods: {
      //新增课程提交
      save () {
        //处理课程分类
        // 选择课程分类存储到categoryActive
        console.log("categoryActive",this.categoryActive)

        this.$refs.cForm.validate(valid =>{
          console.log(valid)
          if (valid) {
            this.courseForm.officeId = this.user.officeId;
            this.courseForm.userId = this.user.userId;
            console.log("course" ,this.courseForm)

            this.courseForm.mt=  this.categoryActive[0]//大分类
            this.courseForm.st=  this.categoryActive[1]//小分类
            courseApi.addCourseBase(this.courseForm).then(res=>{
              if(res.success){
                this.$message.success("提交成功")
                //跳转到我的课程
                this.$router.push({ path: '/course/list'})
              }else{
                this.$message.error(res.message)
              }

            })
          }
        })

      },
      refresh_user:function(){
        let activeUser= utilApi.getActiveUser();

        if(activeUser){
          this.logined = true
          this.user = activeUser;
        }
      },
    },
    created(){
      this.refresh_user()
    },
    mounted(){
      // 查询课程分类
      courseApi.category_findlist().then(res=>{
        console.log("课程分类",res);
        this.categoryList = res.children;
      })

      //查询数据字典
      //查询课程等级
      systemApi.sys_getDictionary("200").then(res=>{
        this.gradeList = res.dvalue;
        console.log("课程等级",res)
      })



    }
  }
</script>

<style lang="less" scoped>


</style>
