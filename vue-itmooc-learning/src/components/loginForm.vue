<template>
  <div>

    <el-row class="container" style="width: 480px;padding-top: 50px;padding-bottom: 200px">
      <div id="body">
        <div class="g-center login-page" @keyup.enter="login">
          <el-tabs v-model="activeName" >
            <el-tab-pane label="用户登陆" name="login">
              <el-form :model="loginForm" label-width="80px" :rules="loginRules" ref="loginForm" class="login-form">
                <el-form-item label="账号" prop="username">
                  <el-input v-model="loginForm.username" auto-complete="off" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="loginForm.password" auto-complete="off"  show-password></el-input>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary"  @click.native="login" :loading="editLoading">登陆</el-button>
                  <el-button type="primary"  @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="用户注册" name="register">
              <el-form :model="logonForm" label-width="80px" :rules="logonFormRules" ref="logonForm" class="login-form">
                <el-form-item label="账号" prop="username">
                  <el-input v-model="logonForm.username" ></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="logonForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="logonForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="logonForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="logonForm.mobile"></el-input>
                </el-form-item>
                <el-form-item >
                  <el-button type="primary"  @click.native="logon" :loading="editLoading">注册</el-button>
                  <el-button type="primary"  @click="resetForm('logonForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>

    </div>

    </el-row>


  </div>
</template>
<script>

import utilApi from '../common/utils';
import * as loginApi from '../base/api/login';

import Vue from 'vue'
export default {
	components:{

	},
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      LoginFormVisible:false,
      activeName: 'login',
      editLoading: false,
      loginForm: {
        username:'',
        password: ''
      },
      loginRules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },

      logonForm: {
        username: '',
        name: '',
        password: '',
        email: '',
        mobile: '',
      },
      logonFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      user:{
        userid:'',
        username: '',
      },
      logined:false,
      returnUrl:''
    }
  },
  methods: {
    login: function () {

        this.$refs.loginForm.validate((valid) => {
          if (valid) {

              this.editLoading = true;

              let para = Object.assign({}, this.loginForm);

              loginApi.login(para).then((res) => {
                this.editLoading = false;
                if(res.success){
                  this.$message.success('登陆成功');
                  //刷新 当前页面
                 // alert(this.returnUrl)
                  //console.log(this.returnUrl)
                  if(this.returnUrl!='undefined' && this.returnUrl!=''
                                                   && !this.returnUrl.includes("/logout")
                                                   && !this.returnUrl.includes("/login")){

                    window.location.href = this.returnUrl;
                  }else{
                    //跳转到首页
                    window.location.href = 'http://www.itmooc.com/'
                  }

                }else{
                    if(res.message){
                      this.$message.error(res.message);
                    }else{
                      this.$message.error('登陆失败');
                    }
                }
              },
                (res) => {
                  this.editLoading = false;
                });


          }
        });

    },

    logon:function() {
      this.$refs.logonForm.validate(async valid => {
        if (!valid) return

        loginApi.logon(this.logonForm).then(res => {
          console.log(res)
          if (!res.success) {
            return this.$message.error("注册失败！" + res.message);
          }
          this.$message.success("注册成功");
        })
      })
    },
    resetForm:function(formName){
      // console.log(this.$refs[formName])
      this.$refs[formName].resetFields();
    },

    refresh_user:function(){
      let activeUser= utilApi.getActiveUser();

      if(activeUser){
        this.logined = true
        this.user = activeUser;
        //console.log(this.user.username)
      }else{
        this.showlogin()
      }
    },
    showlogin:function(){
       this.LoginFormVisible = true;
    }
  },
  created() {
    // var this_ = this;
    //bus.$on('childa-message', this.showlogin(this_));


  },
  mounted() {

    this.refresh_user()
//    Vue.prototype.loginwin = this;
    if( this.$route.query &&  this.$route.query.returnUrl){

      let returnUrl =  Base64.decode(this.$route.query.returnUrl)
      //alert(returnUrl)
      this.returnUrl = returnUrl;
      console.log(this.returnUrl)
      //alert(this.returnUrl)
    }
    /*bus.$on('childa-message', function(data) {
      console.log("aaaaaaaaaaaaa"+data)
      alert(this.LoginFormVisible)
      this.LoginFormVisible = true
      alert(this.LoginFormVisible)
    });*/



  }
}
</script>
<style scoped>
  .login-form{width: 400px;margin:5% auto 0;}
</style>
