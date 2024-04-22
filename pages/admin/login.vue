<template>
  <html>
    <div class="login-container">
      <div class="login-form">
        <h1>SIGN IN.</h1>
        <input v-model="email" type="email" placeholder="E-mail" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit" @click="login" class="sign-in-btn">Sign In</button>
      </div>
    </div>
  </html>
</template>

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

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-form {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  margin-bottom: 20px;
}
.google-btn, .facebook-btn, .sign-in-btn {
  width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 999px;
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
  background-color: #007f51;
}
.divider {
  color: #999;
  text-align: center;
  margin: 20px 0;
}
input[type="email"], input[type="password"] {
  width: 300px;
  padding: 10px 20px;
  margin-bottom: 10px;
  border: none;
  border-radius: 999px;
  background-color: #007f5044;
  color: black;
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