<template>
  <div>
    <div class="learing-list">
      <div class="list-box">
        <ul>
          <li>关键字：</li>
          <ol>
            <li>{{keyword}}

              <nuxt-link v-if="keyword" class="title-link" :to="'/course/search?keyword=&mt='+mt+'&st=' + st+'&grade='+grade">
                &Chi;
              </nuxt-link>
            </li>
          </ol>
        </ul>
        <ul>
          <li>一级分类：</li>
          <li v-if="mt!=''"><nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&grade='+grade">全部</nuxt-link></li>
          <li class="all" v-else>全部</li>
          <ol>
            <li v-for="category_v in first_category">
              <nuxt-link  class="title-link all" :to="'/course/search?keyword='+keyword+'&mt=' + category_v.id" v-if="category_v.id == mt">{{category_v.label}}</nuxt-link>
              <nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt=' + category_v.id" v-else>{{category_v.label}}</nuxt-link>
            </li>
          </ol>

        </ul>
        <ul>
          <li>二级分类：</li>
          <li v-if="st!=''"><nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt='+mt+'&grade='+grade">全部</nuxt-link></li>
          <li class="all" v-else>全部</li>
          <ol v-if="second_category.length>0">
            <li v-for="category_v in second_category">
              <nuxt-link  class="title-link all" :to="'/course/search?keyword='+keyword+'&mt='+mt+'&st=' + category_v.id" v-if="category_v.id == st">{{category_v.label}}</nuxt-link>
              <nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt='+mt+'&st=' + category_v.id" v-else>{{category_v.label}}</nuxt-link>
            </li>

          </ol>

        </ul>
        <ul>
          <li>难度等级：</li>
          <li v-if="grade!=''">
            <nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt=' + mt+'&st='+st+'&grade='">全部
            </nuxt-link>
          </li>
          <li class="all" v-else>全部</li>
          <ol>
            <li v-if="grade=='200001'" class="all">初级</li>
            <li v-else><nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt=' + mt+'&st='+st+'&grade=200001'">初级</nuxt-link></li>
            <li v-if="grade=='200002'" class="all">中级</li>
            <li v-else><nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt=' + mt+'&st='+st+'&grade=200002'">中级</nuxt-link></li>
            <li v-if="grade=='200003'" class="all">高级</li>
            <li v-else><nuxt-link  class="title-link" :to="'/course/search?keyword='+keyword+'&mt=' + mt+'&st='+st+'&grade=200003'">高级</nuxt-link></li>
          </ol>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-11 list-row-left">
          <div class="list-cont-left">
            <div class="tit">
              <ul class="nav nav-tabs ">

              </ul>
            </div>
            <div class="tab-content">
              <div class="content-list">


                <div class="recom-item" v-for="(course, index) in courselist">
                  <a :href="'/course/detail/'+course.id+'.html'" target="_blank">

                    <div v-if="course.pic">
                      <p><img :src="imgUrl+'/'+course.pic" width="100%" alt=""></p>
                    </div>
                    <div v-else>
                      <p><img src="/img/widget-demo1.png" width="100%" alt=""></p>
                    </div>
                    <ul >
                      <li class="course_title"><span v-html="course.name"></span></li>
                    </ul>

                  </a>
                </div>

                <li class="clearfix"></li>
              </div>
              <div class="clearfix"></div>
            </div>
          </div>

          <div style="text-align: center">
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="total"
              :page-size="page_size"
              :current-page="page"
              prev-text="上一页"
              next-text="下一页">
            </el-pagination>
          </div>
        </div>
        <!--<div class="col-md-3 list-row-rit">
          <div class="list-cont-right">


          </div>
        </div>-->
      </div>

    </div>

  </div>
</template>

<script>
  //配置文件
  let config = require('~/config/sysConfig')
  import querystring from 'querystring'
  import * as courseApi from '~/api/course'
    export default {
      data() {
        return {
          courselist: {},
          first_category: {},
          second_category: {},
          mt: '',
          st: '',
          grade: '',
          keyword: '',
          imgUrl: config.imgUrl,
          total: 0,//总记录数
          page: 1,//页码
          page_size: 4//每页显示个数
        }
      },
      head() {
        return {
          title: 'ITMOOC门户',
          meta: [
            {charset: 'utf-8'},
            {name: 'description', content: 'XX'},
            {name: 'keywords', content: this.keywords}
          ],
          link: [
            {rel: 'stylesheet', href: '/static/plugins/normalize-css/normalize.css'},
            {rel: 'stylesheet', href: '/static/plugins/bootstrap/dist/css/bootstrap.css'},
            {rel: 'stylesheet', href: '/static/css/page-learing-list.css'},
            {rel: 'icon', href: '/img/itmooc.ico'}
            ]
        }
      },
      methods:{
        //分页触发
        handleCurrentChange(page) {
          //更改路由
          this.page = page
          //将当前页设置到route中
          this.$route.query.page = page
          let querys = querystring.stringify(this.$route.query)
          window.location = '/course/search?'+querys;
        },
        search(){
          //刷新当前页面
          window.location.reload();
        }
      },
      watch:{//路由发生变化立即搜索search表示search方法
        '$route':'search'
      },

      async asyncData({ store, route }) {//服务端调用方法
        //向java微服务发起请求搜索课程
        //同步调用
        //当前页码，当前路由参数中的page
        let page = route.query.page;
        if (!page) {
          page = 1;
        }else {
          page = Number.parseInt(page)
        }
        //查询课程列表
        let course_data = await courseApi.search_course(page,4,route.query);
        console.log("course_data is ", course_data)

        //查询分类信息
        let category_data = await courseApi.course_category()
        // console.log("category_data is ", category_data)
        if (course_data && course_data.queryResult) {
          //全部分类
          //let category = category_data.category//分部分类
          //let first_category = category[0].children//一级分类

          //let first_category = category_data.category[0].children// 一级分类
          let first_category = category_data.children
          // console.log("一级分类",first_category)
          let second_category=[]//二级分类

          let keywords = ''
          let mt=''
          let st=''
          let grade=''
          let keyword=''
          let total = course_data.queryResult.total
          if( route.query.mt){
            mt = route.query.mt
          }
          if( route.query.st){
            st = route.query.st
          }
          if( route.query.grade){
            grade = route.query.grade
          }
          if( route.query.keyword){
            keyword = route.query.keyword
          }


          //遍历一级分类
          for(var i in first_category){
            keywords += first_category[i].label+' ';
            // console.log("关键字", keywords)
            if(mt!=''&& mt == first_category[i].id){
              //取出二级分类
              second_category = first_category[i].children;
              console.log(second_category)
              break;
            }
          }
          // console.log("一级分类", first_category)
          // console.log("二级分类", second_category)
          return {
            courselist: course_data.queryResult.list,
            first_category:first_category,
            second_category:second_category,
            mt:mt,
            st:st,
            grade:grade,
            keyword:keyword,
            page:page,
            total:total,
            imgUrl:config.imgUrl
          }
        }else {
          return {
            courselist: {},
            first_category:{},
            second_category:{},
            mt:'',
            st:'',
            grade:'',
            keyword:'',
            page:1,
            total:0,
            imgUrl:config.imgUrl
          }
        }
        //查询分类信息

      }
    }
</script>

<style>
  .eslight{
    color: red;
  }
</style>
