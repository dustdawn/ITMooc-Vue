<template>
  <div>
    <h3>权限列表</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightList" border highlight-current-row>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限ID" prop="id"></el-table-column>
        <el-table-column label="权限名称" prop="menuName"></el-table-column>
        <el-table-column label="路径" prop="code"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag effect="dark" type="info" v-if="scope.row.level + '' === '0'">根目录</el-tag>
            <el-tag effect="dark" type="primary" v-else-if="scope.row.level + '' === '1'">一级</el-tag>
            <el-tag effect="dark" type="success" v-else-if="scope.row.level + '' === '2'">二级</el-tag>
            <el-tag effect="dark" type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import * as menuApi from '../api/menu'
  import utilApi from '@/common/utils';

    export default {
        data() {
          return {
            // 权限列表
            rightList: []
          }
        },
      created() {
        // 获取所有的权限
        this.getMenuList()
      },
      methods: {
        // 获取权限列表
        getMenuList() {
          menuApi.menu_list().then(res => {
            console.log("获取菜单列表", res);
            if (!res) {
              return this.$message.error("获取权限列表失败！")
            }
            this.rightList = res;
          })
          /*menuApi.menu_node().then(res => {
            console.log("获取菜单结点列表", res);
          })*/
        }
      }
    }
</script>

<style scoped>

</style>
