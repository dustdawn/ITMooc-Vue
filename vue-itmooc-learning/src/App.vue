<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
  import jwtDecode from 'jwt-decode'
  import base64 from 'js-base64'
  import utilApi from './common/utils';
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
