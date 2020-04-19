<template>
    <div>
      <h3>组织列表</h3>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>组织管理</el-breadcrumb-item>
        <el-breadcrumb-item>组织列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card>

        <!-- 用户列表区域 -->
        <el-table :data="officeList" border highlight-current-row>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="组织名" prop="name"></el-table-column>
          <el-table-column label="组织介绍" prop="intro"></el-table-column>
        </el-table>

      </el-card>
    </div>
</template>

<script>
  import * as officeApi from '../api/office'
  import utilApi from '@/common/utils';
    export default {
        data() {
          return {
            officeList: []
          }
        },
      created() {
        this.getOfficeList();
      },
      methods: {
          getOfficeList() {
            officeApi.office_list().then(res => {
              this.officeList = res;
            })
          }
      }
    }
</script>

<style scoped>

</style>
