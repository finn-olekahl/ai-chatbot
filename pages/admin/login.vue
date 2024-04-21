<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        await useAuth().loginWitPassword(this.email, this.password);
        this.$router.push('/admin/dashboard');
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    const user = useAuthUser();
    if (user.value !== null) {
      this.$router.push('/admin/dashboard');
    }
  }
});
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Sign In.</h1>
      <input v-model="email" type="email" placeholder="E-mail" />
      <input v-model="password"  type="password" placeholder="Password" />
      <button type="submit" class="sign-in-btn">Sign In</button>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1d1d1d;
}
.login-form {
  width: 300px;
  padding: 20px;
  color: white;
}
h1 {
  margin-bottom: 20px;
}
.google-btn, .facebook-btn, .sign-in-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}
.google-btn {
  background-color: #dd4b39;
}
.facebook-btn {
  background-color: #3b5998;
}
.sign-in-btn {
  background-color: #e91e63;
}
.divider {
  color: #999;
  text-align: center;
  margin: 20px 0;
}
input[type="email"], input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: white;
}
.links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
a {
  color: #e91e63;
  text-decoration: none;
}
</style>