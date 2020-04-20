<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../../../assets/logo.png" alt="" />
        <span>系统管理中心</span>
      </div>
      <div class="usermenu" >
        欢迎您：{{user.username}}
        <a href="http://www.itmooc.com" target="_blank"><i class="el-icon-s-home"></i>首页</a>
        <a href="javascript:;" @click="logout" :loading="editLoading"><i class="el-icon-close"></i>退出</a>
      </div>

    </el-header>
    <!-- 主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">IIII</div>
        <!-- 侧边栏菜单区 -->
        <!-- active-text-color选中高亮，在/home路由页面正常，路由跳转后仍然要保持，设置default-active -->
        <!-- unique-opened指定单子菜单打开 -->
        <!-- 保证collapse-transition为boolean值，要动态绑定，如果为true，直接写属性，如unique-opened -->
        <!-- router属性达到<router-link></router-link>作用，开启路由模式,跳转index值 -->
        <!-- default-active设置当前选中子菜单高亮状态，通过二级菜单开启路由后，路由跳转前绑定事件，将路由地址保存在缓存中 -->
        <!-- 方法二：获取当前路由地址的path属性，$route.path -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="this.$route.path"
        >
          <!-- index绑定唯一值不重复index改为:index,注意只支持字符串,v-for绑定循环数据 -->
          <!-- router属性 开启路由后二级菜单的index设置为跳转路径 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 样式模板 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <!-- 路由匹配到的组件将显示在这里 -->
        <!-- <router-view> 定义显示部分，就是点击后或者匹配路由后，区配的内容显示在什么地方，会被匹配到的组件替换掉，此处是匹配路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import utilApi from '../../../common/utils'
export default {
  data() {
    return {
      user:{
        userid:'',
        username: '',
      },
      logined:false,
      editLoading:false,
      menulist: [],
      iconsObj: {
        '100': 'iconfont icon-user',
        '101': 'iconfont icon-tijikongjian',
        '102': 'el-icon-office-building',
        '103': 'el-icon-reading'
      },
      isCollapse: false
    }
  },
  // 声明周期函数（钩子）
  created() {
    this.funcApi();
    this.refresh_user()
  },
  methods: {
    // 退出登录
    logout: function () {
      this.$confirm('确认退出吗?', '提示', {
      }).then(() => {
        //跳转到统一登陆
        window.location = "http://ucenter.itmooc.com/#/logout"
      }).catch(() => {

      });
    },
    refresh_user:function(){
      let activeUser= utilApi.getActiveUser();

      if(activeUser){
        this.logined = true
        this.user = activeUser;
        console.log("this。user", this.user)
      }
    },
    funcApi() {
      this.menulist = [
        {
          id: 100,
          authName: '用户管理',
          children: [{ id: 1001, authName: '用户列表', path: 'user/page/list' }]
        },
        {
          id: 101,
          authName: '权限管理',
          children: [
            { id: 1011, authName: '角色列表', path: 'permission/page/role' },
            { id: 1012, authName: '权限列表', path: 'permission/page/menu' }]
        },
        {
          id: 102,
          authName: '组织管理',
          children: [{ id: 1021, authName: '组织列表', path: 'office/page/list' }]
        },
        {
          id: 103,
          authName: 'CMS',
          children: [
            {id: 10031, authName: '页面管理', path: 'cms/page/list'}]
        }
      ]
    },
    // 折叠菜单方法
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  // 左右贴边对齐
  justify-content: space-between;
  padding-left: 0;
  //元素居中，如按钮
  align-items: center;
  // 文本颜色
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      //设置span文字与图片的距离
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  // 侧边栏菜单样式设置，边框突出去除
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  // 行高
  line-height: 24px;
  color: #fff;
  text-align: center;
  // 文字之间的间距
  letter-spacing: 0.2em;
  // 鼠标变手
  cursor: pointer;
}

.usermenu {
  float: right;
  padding: 0 2em;
  color:#fff;
  font-size: 15px;
}
.usermenu a {
  text-decoration: none;
  margin: 0 0.2em 0 1em;
  color:inherit;
}
</style>
