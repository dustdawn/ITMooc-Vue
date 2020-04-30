<template>
  <div>
    <h3>页面列表</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>CMS</el-breadcrumb-item>
      <el-breadcrumb-item>Java课程管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加课程</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="bannerList" border highlight-current-row @row-dblclick=clickRow>
        <el-table-column type="index" prop="index"></el-table-column>
        <el-table-column label="课程名称" prop="name" width="150px"></el-table-column>
        <el-table-column label="图片链接" prop="value" width="380px"></el-table-column>
        <el-table-column label="课程地址" prop="key"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>


    <!-- 添加对话框 -->
    <el-dialog title="添加" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm"  ref="addFormRef" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="addForm.value"></el-input>
        </el-form-item>
        <el-form-item label="课程地址">
          <el-input v-model="addForm.key"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addModelInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="内容修改" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm"  ref="editFormRef" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="editForm.value"></el-input>
        </el-form-item>
        <el-form-item label="课程地址">
          <el-input v-model="editForm.key"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editModelInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
  import * as cmsApi from '../api/cms'
  export default {
    data() {
      return {
        addDialogVisible: false,
        addForm: {
          key: '',
          name: '',
          value: ''
        },
        editForm: {},
        editDialogVisible: false,

        bannerList: [],
        courseList:[],
        javaList: [],
        cList: [],
        menuList: [
          {
            id: '5e982b2155d6b309a9db48e4',
            name: '课程管理'
          },
          {
            id: '5ea7898eb20fe673b6046419',
            name: '热门课程推荐管理'
          },
          {
            id: '5ea78d23b20fe673b604641e',
            name: 'Java课程推荐管理'
          },
          {
            id: '5ea78d2fb20fe673b604641f',
            name: 'C课程推荐管理'
          }
        ]
      }
    },
    methods : {
      getModel() {
        cmsApi.get_model('5ea78d23b20fe673b604641e').then(res => {
          if (res) {
            this.bannerList = res.model;
          }
        })
      },
      showEditDialog(row) {
        this.editDialogVisible = true;
        this.editForm.name = row.name;
        this.editForm.value = row.value;
        this.editForm.key = row.key;
      },
      async removeById(id) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
          '此操作将永久删除, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
      },
      showManageDialog(id) {
        cmsApi.get_model(id).then(res => {
          if (res) {
            if (res.name == '课程') {
              this.bannerList = res.model;
            }else if (res.name == '课程推荐') {
              this.courseList = res.model;
            }else if (res.name == 'Java课程推荐') {
              this.javaList = res.model;
            }else if (res.name == 'C课程推荐') {
              this.cList = res.model;
            }
          }
          this.manageDialogVisible = true;
          console.log(res.model);
        })
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      addModelInfo() {

      },
      editModelInfo() {

      },
      clickRow(e) {
        window.open(e.key,"_blank");
      }
    },
    created() {
      this.getModel();
    }

  }
</script>

<style scoped>

</style>
