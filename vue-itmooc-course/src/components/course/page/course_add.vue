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
            expand-trigger="hover"
            :options="categoryList"
            v-model="categoryActive"
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
  export default {

    data() {
      return {
        gradeList:[],
        props: {
          value: 'id',
          label:'name',
          children:'children'
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
          description: ''
        },
        courseRules: {
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          /*categoryActive: [
            {required: true, message: '请选择课程分类', trigger: 'blur'}
          ],*/
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
        console.log(this.categoryActive)
        this.courseForm.mt=  this.categoryActive[0]//大分类
        this.courseForm.st=  this.categoryActive[1]//小分类
        this.$refs.cForm.validate(valid =>{
          console.log(valid)
          if (valid) {
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

      }
    },
    created(){

    },
    mounted(){
      // 查询课程分类
      courseApi.category_findlist().then(res=>{
        console.log(res);
        this.categoryList = res.children;


      })

      //查询数据字典
      //查询课程等级
      systemApi.sys_getDictionary("200").then(res=>{
        this.gradeList = res.dvalue;
      })
      //查询学习模式
      systemApi.sys_getDictionary("201").then(res=>{

        this.studymodelList = res.dvalue;
      })

    }
  }
</script>

<style lang="less" scoped>


</style>
