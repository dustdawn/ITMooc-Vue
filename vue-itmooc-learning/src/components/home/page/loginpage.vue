<template>
  <div>
    <p-head></p-head>

    <login-form></login-form>

    <p-foot></p-foot>
  </div>
</template>
<script>
import PHead from '@/components/head.vue';
import PFoot from '@/components/foot.vue';
import loginForm from '@/components/loginForm.vue';

export default {
	components:{
		PHead,
    PFoot,
    loginForm
	},
  data() {
    return {

    }
  },
  methods: {

  },
  created() {

  },
  mounted() {

  }
}
</script>
<style scoped>
  .login-form{width: 400px;margin:5% auto 0;}
</style>
