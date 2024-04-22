<template>
  <div class="header-wrapper">
    <h1>Admin Dashboard</h1>
    <p>Account: <span>{{ user.providerData[0].email }}</span></p>
    <button @click="handleLogout">LOGOUT</button>
  </div>
  <div class="content">
    <button @click="this.$router.push('/admin/dashboard/guidelines')">GUIDELINES</button>
    <button @click="this.$router.push('/admin/dashboard/settings')">SETTINGS</button>
    <button @click="this.$router.push('/admin/dashboard/support')">SUPPORT PANEL</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const user = useAuthUser();
const { logout } = useAuth();

const handleLogout = async () => {
  try {
      await logout();
      await navigateTo("/");
  } catch (error) {
      console.error(error);
  }
};

</script>

<style scoped>
.header-wrapper {
  display: flex;
  width: 100vw;
  height: 150px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.header-wrapper > h1 {
  font-size: 50px;
}

.header-wrapper > p {
  font-size: 14px !important;
  font-weight: 700;
  opacity: 0.6;
}

.header-wrapper > p > span {
  color: #007f51;
}

.header-wrapper > button {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  background-color: #007f51;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.content {
  padding-top: 50px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content > button {
  width: 300px;
  color: white;
  background-color: black;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.content > button:not(:last-child) {
  margin-bottom: 20px;
}
</style>