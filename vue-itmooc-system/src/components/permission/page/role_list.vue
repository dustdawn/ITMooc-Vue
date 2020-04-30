<template>
    <div>
      <h3>角色列表</h3>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图 -->
      <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
          <el-col>
            <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
          </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table :data="roleList" border highlight-current-row>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row, item1, scope.row.children)">{{item1.menuName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <!-- 通过 for 循环 嵌套渲染二级权限 -->
                  <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeRightById(scope.row, item2, item1.children)">{{item2.menuName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3, item2.children)">{{item3.menuName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

               <!--<pre>
                {{scope.row}}
              </pre> -->
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色代号" prop="roleCode"></el-table-column>
          <el-table-column label="角色描述" prop="description"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-card>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="代号" prop="roleCode">
            <el-input v-model="addForm.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="代号" prop="roleCode">
            <el-input v-model="editForm.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限的对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignMenu">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  import * as roleApi from '../api/role'
  import utilApi from '@/common/utils';
    export default {
        data() {
          return {
            // 所有角色列表数据
            roleList: [],
            // 添加角色对话框的显示与隐藏
            addDialogVisible: false,
            addForm: {
              roleName: '',
              roleCode: '',
              description: ''
            },
            addFormRules: {
              roleName: [{required: true, message: '请输入角色名', trigger: 'blur'}],
              roleCode: [{required: true, message: '请输入角色代号', trigger: 'blur'}]
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            editFormRules: {
              roleName: [{required: true, message: '请输入角色名', trigger: 'blur'}],
              roleCode: [{required: true, message: '请输入角色代号', trigger: 'blur'}]
            },
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限的数据
            rightList: [],
            // 树形控件的属性绑定对象
            treeProps: {
              label: 'menuName',
              children: 'children'
            },
            // 默认选中的节点Id值数组
            defKeys: [],
            // 当前即将分配权限的角色id
            roleId: ''
          }
        },
      created() {
          this.getRoleList()
        },
      methods: {
        // 获取所有角色的列表
        getRoleList() {
          roleApi.role_list().then(res => {
            console.log(res)
            if (!res.success) {
              this.$message.error("获取角色列表失败！" + res.message);
            }
            this.roleList = res.queryResult.list
          })
        },
        addRole() {
          this.$refs.addFormRef.validate(async valid => {
            if (!valid) return
            roleApi.role_add(this.addForm).then(res => {
              console.log(res);
              if (!res.success) {
                return this.$message.error("添加角色失败！" + res.message);
              }
              this.$message.success('添加角色成功！')
              // 隐藏添加用户的对话框
              this.addDialogVisible = false
              // 重新获取角色列表数据
              this.getRoleList();
            })
          })

        },
        //监听添加角色对话框关闭事件
        addDialogClosed() {
          this.$refs.addFormRef.resetFields()
        },
        // 打开修改页面，并查询用户信息
        showEditDialog(id) {
          roleApi.role_get(id).then(res => {
            console.log("获取角色信息",res);
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
        // 修改角色信息并提交
        editRoleInfo() {
          this.$refs.editFormRef.validate(async valid => {
            if (!valid) return
            roleApi.role_update(this.editForm.id, this.editForm).then(res => {
              console.log(res)
              if (!res.success) {
                return this.$message.error('修改角色失败！' + res.message)
              }
              this.$message.success('修改角色成功！')
              // 隐藏添加用户的对话框
              this.editDialogVisible = false
              // 重新获取用户列表数据
              this.getRoleList()
            })
          })
        },
        // 根据Id删除对应的用户信息
        async removeRoleById(id) {
          // 弹框询问用户是否删除数据
          const confirmResult = await this.$confirm(
            '此操作将永久删除该角色, 是否继续?',
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

          roleApi.role_delete(id).then(res => {
            if (!res.success) {
              return this.$message.error('删除角色失败！' + res.message)
            }
            this.$message.success('删除角色成功！')
            this.getRoleList()
          })
        },

  //权限管理相关
        // 根据Id删除对应的权限
        async  removeRightById(role, right, children) {

          // this.dynamicTags.splice(this.dynamicTags.indexOf(rightId), 1);
          //父级元素
          console.log(children)

          console.log("角色", role, "权限", right)

          // 弹框询问用户是否删除数据
          const confirmResult = await this.$confirm(
            '此操作将永久删除该权限, 是否继续?',
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

          roleApi.revoke_right(role.id, right.id).then(res => {
            if (!res.success) {
              return this.$message.error("取消权限错误！" + res.message);
            }
            // console.log(children.indexOf(item))
            children.splice(children.indexOf(right),1)
          })
        },
        // 展示分配权限的对话框
        showSetRightDialog(role) {
          this.roleId = role.id
          roleApi.menu_node().then(res => {
            if (!res) {
              return this.$message.error("获取权限结点列表失败！" + res.message)
            }
            this.rightList = res.children;
            console.log("所有权限列表",this.rightList)
            // 递归获取三级节点的Id
            console.log("角色信息", role)
            this.getLeafKeys(role, this.defKeys)
            console.log("该角色已有权限列表", this.defKeys)
          });

          this.setRightDialogVisible = true
        },
        // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
        getLeafKeys(node, arr) {
          // 如果当前 node 节点不包含 children 属性，则是三级节点

          if (!node.children) {
            return arr.push(node.id)
          }

          node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
          this.defKeys = []
        },
        // 点击为角色分配权限
        assignMenu() {
          const keys = [
            // 解构赋值，将两个数组中元素合并
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
          ]

          const idStr = keys.join(',')
          console.log("授权id",idStr);
          roleApi.assign_right(this.roleId, idStr).then(res => {
            console.log(res);
            if (!res.success) {
              return this.$message.error("分配权限失败！" + res.message);
            }
            this.$message.success('分配权限成功！')
            this.getRoleList()
            this.setRightDialogVisible = false
          })
        }
      }

    }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
