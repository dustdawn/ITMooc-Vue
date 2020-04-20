<template>
  <div id="app">
    <!-- 路由占位符 -->
    <!-- 路由匹配到的组件将显示在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
  import jwtDecode from 'jwt-decode'
  import base64 from 'js-base64'
  import utilApi from './common/utils';
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
