<template>
    <div>
      <h3>用户列表</h3>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>


      <!-- 卡片视图区域 -->
      <el-card>


        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="4">
            <el-input placeholder="请输入用户名" v-model="params.username" clearable @clear="getUserList">
            </el-input>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="请输入姓名" v-model="params.name" clearable @clear="getUserList">
            </el-input>
          </el-col>

          <el-col :span="2">
            <el-button type="primary" v-on:click="getUserList">查询</el-button>
          </el-col>

          <el-col :span="2">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userList" border highlight-current-row>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="utype"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status == 1 ? true: false" @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.page" :page-sizes="[1, 2, 5, 10]" :page-size="params.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>角色分配：</p>
          <el-checkbox-group v-model="userRoleList" @change="checkboxChange">
            <el-checkbox v-for="role in roleList" :label="role.id" :key="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>

        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
      </el-dialog>

    </div>
</template>

<script>
  import * as userApi from '../api/user'
  import utilApi from '@/common/utils';
    export default {
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
            // 获取用户列表的参数对象
            params: {
              username: '',
              name: '',
              // 当前的页数
              page: 1,
              // 当前每页显示多少条数据
              size: 5
            },
            userList: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
              username: '',
              name: '',
              password: '',
              email: '',
              mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
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
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
              email: [
                { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
              ],
              mobile: [
                { required: true, message: '请输入用户手机', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
              ]
            },
            // 控制分配角色对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 需要被分配角色的用户信息
            userInfo: {},
            // 所有角色的数据列表
            roleList: [],
            userRoleList: [],
            // 已选中的角色Id值
            selectedRoleId: []
          }
        },
        methods: {
          getUserList() {
            userApi.user_list(this.params.page, this.params.size, this.params).then(res => {
              console.log(res);
              this.total = res.queryResult.total
              this.userList = res.queryResult.list

            })
          },
          // 监听 pagesize 改变的事件
          handleSizeChange(newSize) {
            // console.log(newSize)
            this.params.size = newSize
            this.getUserList()
          },
          // 监听 页码值 改变的事件
          handleCurrentChange(newPage) {
            // console.log(newPage)
            this.params.page = newPage
            this.getUserList()
          },
          // 修改用户状态
          userStateChanged(userinfo) {
            console.log(userinfo)
            let status = userinfo.status == 1 ? 0 : 1;
            userApi.user_edit_status(userinfo.id, status).then(res => {
              console.log(res)
              if (!res.success) {
                return this.$message.error('更新用户状态失败！')
              }
              this.$message.success('更新用户状态成功！')
              this.getUserList();
            });
          },
          // 监听添加用户对话框的关闭事件
          addDialogClosed() {
            this.$refs.addFormRef.resetFields()
          },
          // 点击按钮，添加新用户
          addUser() {
            this.$refs.addFormRef.validate(async valid => {
              if (!valid) return
              userApi.user_add(this.addForm).then(res => {
                console.log(res)
                if (!res.success) {
                  return this.$message.error('添加用户失败！' + res.message)
                }
                this.$message.success('添加用户成功！')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getUserList()

              })
            })
          },
          // 打开修改页面，并查询用户信息
          showEditDialog(id) {
            userApi.user_get(id).then(res => {
              console.log("获取用户信息",res);
              if (res) {
                this.editDialogVisible = true;
                this.editForm = res;
              }
            })
          },
          // 监听修改用户对话框的关闭事件
          editDialogClosed() {
            this.$refs.editFormRef.resetFields()
          },
          // 修改用户信息并提交
          editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
              if (!valid) return
              userApi.user_update(this.editForm.id, this.editForm).then(res => {
                console.log(res)
                if (!res.success) {
                  return this.$message.error('修改用户失败！' + res.message)
                }
                this.$message.success('修改用户成功！')
                // 隐藏添加用户的对话框
                this.editDialogVisible = false
                // 重新获取用户列表数据
                this.getUserList()
              })
            })
          },
          // 根据Id删除对应的用户信息
          async removeUserById(id) {
            // 弹框询问用户是否删除数据
            const confirmResult = await this.$confirm(
              '此操作将永久删除该用户, 是否继续?',
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

            userApi.user_delete(id).then(res => {
              if (!res.success) {
                return this.$message.error('删除用户成功！' + res.message)
              }
              this.$message.success('删除用户成功！')
              this.getUserList()
            })
          },
          // 展示分配角色的对话框
          setRole(userInfo) {
            this.userInfo = userInfo;
            // 获取所有角色
            userApi.role_list().then(res => {
              console.log("所有角色列表", res)
              if (!res.success) {
                return this.$message.error("获取角色列表失败！" + res.message)
              }
              this.roleList = res.queryResult.list;
            })
            // 获取用户角色
            userApi.user_roles(userInfo.id).then(res => {
              console.log("用户角色列表",res)
              if (!res.success) {
                return this.$message.error("获取用户角色失败！" + res.message)
              }
              var list = res.roleList
              for (let i = 0; i < list.length; i++) {
                this.userRoleList.push(list[i].id)
              }
            })
            this.setRoleDialogVisible = true;
          },
          // 监听checkbox改变事件
          checkboxChange(e) {
            // console.log(e)
          },
          // 保存用户角色
          saveRoleInfo() {
            console.log(this.userRoleList)
            userApi.assign_roles(this.userInfo.id, this.userRoleList.toString()).then(res => {
              console.log(res)
              if (!res.success) {
                return this.$message.error("分配用户角色失败！" + res.message)
              }
              this.$message.success('分配角色成功！')
              this.getUserList()
              this.setRoleDialogVisible = false
            })
          },

          // 监听分配角色对话框的关闭事件
          setRoleDialogClosed() {
            this.roleList = []
            this.userRoleList = []
          }
        },
        created() {
          this.getUserList();
        }
    }
</script>

<style scoped>

</style>
