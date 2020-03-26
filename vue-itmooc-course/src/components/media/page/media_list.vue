<template>
  <div>

    <h3>我的媒资</h3>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>媒资管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的媒资</el-breadcrumb-item>

    </el-breadcrumb>



    <!--查询表单-->
    <el-form :model="params">
      标签：
      <el-input v-model="params.tag" style="width:160px"></el-input>
      原始名称：
      <el-input v-model="params.fileOriginalName" style="width:160px"></el-input>
      处理状态：
      <el-select v-model="params.processStatus" placeholder="请选择处理状态">
        <el-option
          v-for="item in processStatusList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <br/>
      <br/>
      <el-button type="primary" v-on:click="query" size="small">查询</el-button>
      <router-link class="mui-tab-item" :to="{path:'/upload'}">
        <el-button  type="primary" size="small" v-if="ischoose != true">上传文件</el-button>
      </router-link>
    </el-form>
    <!--列表-->
    <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;" border>
      <el-table-column type="index" width="30">
      </el-table-column>
      <el-table-column prop="fileOriginalName" label="原始文件名称" width="220">
      </el-table-column>
      <el-table-column prop="fileName" label="文件名称" width="220">
      </el-table-column>
      <el-table-column prop="fileUrl" label="访问url" width="260">
      </el-table-column>
      <el-table-column prop="tag" label="标签" width="100">
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小" width="100">
      </el-table-column>
      <el-table-column prop="processStatus" label="处理状态" width="100" :formatter="formatProcessStatus">
      </el-table-column>
      <el-table-column prop="uploadTime" label="创建时间" width="120" :formatter="formatCreatetime">
      </el-table-column>
      <el-table-column label="开始处理" width="110" v-if="ischoose != true">
        <template slot-scope="scope">
          <el-button
            size="small" type="primary" plain @click="process(scope.row.fileId)">开始处理
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="选择" width="80" v-if="ischoose == true">
        <template slot-scope="scope">
          <el-button
            size="small" type="primary" plain @click="choose(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">

      <el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="this.size"
                     :total="total" :current-page="this.page"
                     style="float:right;">
      </el-pagination>
    </el-col>

  </div>
</template>
<script>
  import * as mediaApi from '../api/media'
  import utilApi from '@/common/utils';
  export default{
    props: ['ischoose'],
    data(){
      return {
        page:1,//页码
        size:2,//每页显示个数
        params:{
          tag:'',//标签
          fileOriginalName:'',//文件原始名称
          processStatus:''//处理状态
        },
        listLoading:false,
        list:[],
        total:0,
        processStatusList:[]
      }
    },
    methods:{
      formatCreatetime(row, column){
        var createTime = new Date(row.uploadTime);
        if (createTime) {
          return utilApi.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss');
        }
      },
      formatProcessStatus(row,column){
        var processStatus = row.processStatus;
        if (processStatus) {
          if(processStatus == '303001'){
            return "处理中";
          }else if(processStatus == '303002'){
            return "处理成功";
          }else if(processStatus == '303003'){
            return "处理失败";
          }else if(processStatus == '303004'){
            return "未处理";
          }
        }
      },
      choose(mediaFile){
        if(mediaFile.processStatus !='303002' && mediaFile.processStatus !='303004'){
          this.$message.error('该文件未处理，不允许选择');
          return ;
        }
        if(!mediaFile.fileUrl){
          this.$message.error('该文件的访问url为空，不允许选择');
          return ;
        }
        //调用父组件的choosemedia方法
        this.$emit('choosemedia',mediaFile.fileId,mediaFile.fileOriginalName,mediaFile.fileUrl);
      },
      changePage(page){
        this.page = page;
        this.query()
      },
      process (id) {
//        console.log(id)
        mediaApi.media_process(id).then((res)=>{
          if(res.success){
            this.$message.success('开始处理，请稍后查看处理结果');
          }else{
            this.$message.error(res.message);
          }
        })
      },
      query(){
        mediaApi.media_list(this.page,this.size,this.params).then((res)=>{
          console.log(res)
          this.total = res.queryResult.total
          this.list = res.queryResult.list


          for (let i = 0; i < this.total; i++) {
            if (this.list[i]) {
              let size = parseInt(this.list[i].fileSize/1024/1024);
              this.list[i].fileSize = size + "MB"
            }
          }
        })
      }
    },
    created(){
      //默认第一页
      console.log(this.$route.query.page)
      this.page = Number.parseInt(this.$route.query.page||1);
      //默认查询页面
      this.query()
    },
    mounted() {

      //初始化处理状态
      this.processStatusList = [
        {
          id:'',
          name:'全部'
        },
        {
          id:'303001',
          name:'处理中'
        },
        {
          id:'303002',
          name:'处理成功'
        },
        {
          id:'303003',
          name:'处理失败'
        },
        {
          id:'303004',
          name:'未处理'
        }
      ]
    }
  }
</script>

<style scoped>

</style>
