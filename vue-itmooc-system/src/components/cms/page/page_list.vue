<template>
  <div>

    <h3>页面列表</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>CMS</el-breadcrumb-item>
      <el-breadcrumb-item>页面列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--查询表单-->
    <el-form :model="params">
      <el-select v-model="params.siteId" placeholder="请选择站点">
        <el-option
          v-for="item in siteList"
          :key="item.siteId"
          :label="item.siteName"
          :value="item.siteId">
        </el-option>
      </el-select>
      页面别名：<el-input v-model="params.pageAliase" style="width: 100px"></el-input>
      <el-button type="primary" v-on:click="query" size="small">查询</el-button>
      <!--类似于a标签，query表示含带参数-->
      <router-link class="mui-tab-item" :to="{path:'/cms/page/add/',query:{
          page: this.params.page,
          siteId: this.params.siteId}}">
        <el-button  type="primary" size="small">新增页面</el-button>
      </router-link>
    </el-form>
    <!--列表-->
    <el-table :data="list"  highlight-current-row v-loading="listLoading" style="width: 100%;" border>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="pageName" label="页面名称" width="200">
      </el-table-column>
      <el-table-column prop="pageAliase" label="别名" width="125">
      </el-table-column>

      <el-table-column prop="pageWebPath" label="访问路径" width="120">
      </el-table-column>
      <el-table-column prop="pagePhysicalPath" label="物理路径" width="120">
      </el-table-column>
      <el-table-column prop="pageCreateTime" label="创建时间" width="180" :formatter="formatCreatetime">
      </el-table-column>
      <el-table-column prop="pageStatus" label="是否静态化" :formatter="formatStatus" width="100">
      </el-table-column>
      <el-table-column label="编辑" width="80">
        <!--插槽模板可取出其他数据，scope为自定义的名称，row为循环遍历的实体-->
        <template slot-scope="scope">

          <el-button
            size="small"type="primary"
            @click="edit(scope.row.pageId)">编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="80">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="danger"
            @click="del(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="静态化" width="90">
        <template slot-scope="scope">
          <el-button
            size="small" type="primary" plain @click="generateHtml(scope.row.pageId)">静态化
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布" width="150" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button
              size="small" type="primary" plain @click="postPage(scope.row.pageId)">
              发布
            </el-button>
            <a :href="scope.row.pubUrl" target="_blank" v-if="scope.row.pubUrl !== null">查看发布</a>
          </el-row>

        </template>



      </el-table-column>

    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">

      <el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="this.params.size"
                     :total="total" :current-page="this.params.page"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>
<script>
  import * as cmsApi from '../api/cms'
  import utilApi from '@/common/utils';
  export default{
    data(){
      return {
        params:{
          page:1,//页码
          size:5,//每页显示个数
          siteId:'',//站点id
          pageAliase:''//站点别名
        },
        listLoading:false,
        list:[],
        total:0,
        siteList:[]//站点列表
      }
    },
    methods:{
      formatCreatetime(row, column){
        var createTime = new Date(row.pageCreateTime);
        if (createTime) {
          return utilApi.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss');
        }
      },
      //角色转换
      formatStatus: function(row, column) {
        if (row.pageStatus == '100001') {
          return "未静态化";
        }else if (row.pageStatus == '100002') {
          return "已静态化";
        }else if (row.pageStatus == '100003') {
          return "已发布";
        }
      },

      generateHtml (id) {
//        console.log(id)
        this.$router.push({ path: '/cms/page/html/'+id, query:{
            page: this.params.page,
            siteId: this.params.siteId}})
      },
      postPage (id) {
        this.$confirm('确认发布该页面吗?', '提示', {
        }).then(() => {
          this.listLoading = true;
          cmsApi.page_postPage(id).then((res) => {
            console.log("res is",res);
            if(res.success){
              console.log('发布页面id='+id);
              this.listLoading = false;
              this.$message.success('发布成功，请稍后查看结果');
              this.query()
            }else{
              this.$message.error('发布失败');
            }
          });
        }).catch(() => {
        });
      },
      edit(pageId){
        this.$router.push({ path: '/cms/page/edit/'+pageId,query:{
            page: this.params.page,
            siteId: this.params.siteId}})
      },
      //删除
      del (index, row) {
        console.log(index);
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let pageId = row.pageId;
          cmsApi.page_del(pageId).then((res) => {
            this.listLoading = false;
            if(res.success){
              this.$message.success("删除成功")
              this.query();
            }else{
              this.$message.error('删除失败');
            }

          });
        }).catch(() => {

        });
      },
      changePage(page){
        this.params.page = page;
        this.query()
      },
      query(){
        cmsApi.page_list(this.params.page,this.params.size,this.params).then((res)=>{
          console.log(res)
          this.total = res.queryResult.total
          this.list = res.queryResult.list
        });
        cmsApi.site_list().then((res)=>{
          console.log("站点列表",res);
          this.siteList = res.queryResult.list;
        })

      },
      /*preview:function (pageId) {
        //打开浏览器窗口
        window.open("http://www.xuecheng.com/cms/preview/"+pageId);
      }*/
    },
    created(){
      //存储 请求参数
      /*if(this.$route.query.page){
       this.params.page = Number.parseInt(this.$route.query.page)
       }*/
      this.params.page = Number.parseInt(this.$route.query.page||1);
      this.params.siteId = this.$route.query.siteId||'';
    },
    //钩子函数
    mounted() {
      //DOM元素渲染完成时起作用
      //默认查询页面
      this.query()
      //初始化站点列表
      // this.siteList = [
      //   {
      //     siteId:'5a751fab6abb5044e0d19ea1',
      //     siteName:'门户主站'
      //   },
      //   {
      //     siteId:'102',
      //     siteName:'测试站'
      //   }
      // ]
    }
  }
</script>

<style scoped>

</style>
