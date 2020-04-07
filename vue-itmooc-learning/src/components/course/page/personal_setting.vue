<template>
  <div class="personal-content">
    <div class="only-setting">
      <div class="title">个人设置</div>
      <div class="portrait">
        <span>梦醒时分 </span> <span class="ch">修改昵称 ></span>
      </div>
      <div class="title">密码修改</div>




      <el-form :inline="false" :model="passwords" :rules="editPasswordRules" ref="editPasswordRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwords.oldPassword" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwords.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPasswordAgain">
          <el-input v-model="passwords.newPasswordAgain" placeholder="请再输入一次新密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">修改密码</el-button>
        </el-form-item>
      </el-form>


    </div>
  </div>
</template>

<script>

  export default {
    components: {},
    data() {

      var valPwd = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwords.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }

      return {
        passwords: {
          oldPassword:'',
          newPassword:'',
          newPasswordAgain:''
        },
        editPasswordRules: {
          oldPassword: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: '用户名的长度在6~15个字符之间',
              trigger: 'blur'
            }
          ],
          newPassword: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 15,
              message: '用户名的长度在6~15个字符之间',
              trigger: 'blur'
            }
          ],
          newPasswordAgain: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {validator:valPwd, trigger:'blur'}
          ]
        }
      }
    },
    methods: {
      onSubmit() {

      }

    },
    mounted() {

    }
  }

</script>

<style>
  @import './../../../../static/css/page-learing-personal-mail.css';

</style>
