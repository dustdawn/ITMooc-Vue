<template>
  <div class="personal-content">
    <el-card style="height: 700px">
      <div class="only-setting">
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
    </el-card>
  </div>
</template>

<script>
  import * as loginApi from '@/base/api/login'
  import utilApi from '../../../common/utils';
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
        user: {},
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
        console.log(this.$refs)
        this.$refs.editPasswordRef.validate(async valid => {
          if (!valid) return;
          var params = {
            userId: this.user.userid,
            passwordOld: this.passwords.oldPassword,
            passwordNew: this.passwords.newPassword
          }
          loginApi.change_password(params).then(res => {
            console.log(res)
            if (!res.success) {
              return this.$message.error("修改密码失败！" + res.message)
            }
            this.$refs.editPasswordRef.resetFields();
            return this.$message.success("修改密码成功！")
          })
        })
      }

    },
    created() {
      let activeUser= utilApi.getActiveUser();
      if(activeUser){
        this.logined = true
        this.user = activeUser;
      }
    },
    mounted() {

    }
  }

</script>

<style>
  @import './../../../../static/css/page-learing-personal-mail.css';

</style>
