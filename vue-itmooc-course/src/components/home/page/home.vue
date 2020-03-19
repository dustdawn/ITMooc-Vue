<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../../../assets/logo.png" alt="" />
        <span>教学管理中心</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
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
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        // '100': 'iconfont icon-user',
        '101': 'iconfont icon-tijikongjian',
        '100': 'iconfont icon-tijikongjian'
      },
      isCollapse: false
    }
  },
  // 声明周期函数（钩子）
  created() {
    console.log('created......')
    this.funcApi()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    funcApi() {
      console.log('调取后台接口')
      this.menulist = [
        {
          id: 100,
          authName: '课程管理',
          children: [{ id: 1001, authName: '我的课程', path: 'course/list' }]
        },
        {
          id: 101,
          authName: '媒资管理',
          children: [{ id: 1011, authName: '上传文件', path: 'upload' }, { id: 1012, authName: '我的媒资', path: 'media_list' }]
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
</style>
