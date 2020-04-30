<template>
  <div>

    <h3>添加页面</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>CMS</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/cms/page/list' }">页面列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加页面</el-breadcrumb-item>
    </el-breadcrumb>


    <el-form   :model="pageForm" label-width="80px" :rules="pageFormRules" ref="pageForm" >
      <el-form-item label="所属站点" prop="siteId">
        <el-select v-model="pageForm.siteId" placeholder="请选择站点">
          <el-option
            v-for="item in siteList"
            :key="item.siteId"
            :label="item.siteName"
            :value="item.siteId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择模版" prop="templateId">
        <el-select v-model="pageForm.templateId" placeholder="请选择" @change="templateChange(pageForm.templateId)">
          <el-option
            v-for="item in templateList"
            :key="item.templateId"
            :label="item.templateName"
            :value="item.templateId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面名称" prop="pageName">
        <el-input v-model="pageForm.pageName" auto-complete="off" ></el-input>
      </el-form-item>

      <el-form-item label="别名" prop="pageAliase">
        <el-input v-model="pageForm.pageAliase" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="访问路径" prop="pageWebPath">
        <el-input v-model="pageForm.pageWebPath" auto-complete="off" ></el-input>
      </el-form-item>

      <el-form-item label="物理路径" prop="pagePhysicalPath">
        <el-input v-model="pageForm.pagePhysicalPath" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="数据Url" prop="dataUrl">
        <el-input v-model="pageForm.dataUrl" auto-complete="off" ></el-input>
      </el-form-item>


      <el-form-item label="创建时间">
        <el-date-picker type="datetime" placeholder="创建时间" v-model="pageForm.pageCreateTime"></el-date-picker>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="go_back">返回</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </div>
</template>
<script>
  import * as cmsApi from '../api/cms'
  export default{
    data(){
      return {
        //模版列表
        templateList:[],
        addLoading: false,//加载效果标记
        //新增界面数据
        pageForm: {
          siteId:'',
          templateId:'',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          dataUrl:'',
          pagePhysicalPath:'',

          pageCreateTime: new Date()
        },
        pageFormRules: {
          siteId:[
            {required: true, message: '请选择站点', trigger: 'blur'}
          ],
          templateId:[
            {required: true, message: '请选择模版', trigger: 'blur'}
          ],
          pageName: [
            {required: true, message: '请输入页面名称', trigger: 'blur'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问路径', trigger: 'blur'}
          ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径', trigger: 'blur'}
          ]
        },
        siteList:[],
        goback_params: {
          page: this.$route.query.page,
          siteId:this.$route.query.siteId,
        }
      }
    },
    methods:{
      go_back(){
        this.$router.push({
          path: '/cms/page/list', query: {
            page: this.$route.query.page,//取出当前路由的id
            siteId:this.$route.query.siteId
          }
        })
      },
      addSubmit(){
        //表单的ref属性为pageForm
        //this.$refs.['pageForm'].validate
        this.$refs.pageForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //data中界面数据pageForm
              cmsApi.page_add(this.pageForm).then((res) => {
                  console.log(res);
                if(res.success){
                  this.addLoading = false;
                  //NProgress.done();
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  //this.$message.success("提交成功");
                  this.$refs['pageForm'].resetFields();
                  //跳转页面列表
                  this.$router.push({ path: '/cms/page/list'})
                }else if(res.message){
                  this.addLoading = false;
                  this.$message.error(res.message);
                }else{
                  this.addLoading = false;
                  this.$message.error('提交失败');
                }
              });
            });
          }
        });
      },
      templateChange(id) {
        if (id == '5ea69b2bb20fe673b60463c0') {
          this.pageForm.pageName = 'index_banner.html';
          this.pageForm.pageWebPath = '/banner/';
          this.pageForm.pagePhysicalPath = '/banner/';
          this.pageForm.dataUrl = 'http://localhost:31100/cms/config/getModel/5e982b2155d6b309a9db48e4';
        }else if (id == '5ea6b453b20fe673b604640f') {
          this.pageForm.pageName = 'hot_course.html';
          this.pageForm.pageWebPath = '/banner/';
          this.pageForm.pagePhysicalPath = '/banner/';
          this.pageForm.dataUrl = 'http://localhost:31100/cms/config/getModel/5ea7898eb20fe673b6046419';
        }else if (id == '5ea7a8f8b20fe673b6046445') {
          this.pageForm.pageName = 'java_course.html';
          this.pageForm.pageWebPath = '/banner/';
          this.pageForm.pagePhysicalPath = '/banner/';
          this.pageForm.dataUrl = 'http://localhost:31100/cms/config/getModel/5ea78d23b20fe673b604641e';
        }else if (id == '5ea7a8ffb20fe673b6046446') {
          this.pageForm.pageName = 'c_course.html';
          this.pageForm.pageWebPath = '/banner/';
          this.pageForm.pagePhysicalPath = '/banner/';
          this.pageForm.dataUrl = 'http://localhost:31100/cms/config/getModel/5ea78d2fb20fe673b604641f';
        }
      }
    },
    created: function () {
      cmsApi.site_list().then((res)=>{
        console.log("站点列表",res);
        this.siteList = res.queryResult.list;
      })
      cmsApi.template_list().then((res)=>{
        console.log("模板列表",res);
        this.templateList = res.queryResult.list;

      })
    },
    mounted:function(){


    }
  }
</script>
<style>

</style>
