<template>
  <div class="header-wrapper-dashboard">
    <h1>Admin Dashboard</h1>
    <button @click="handleLogout">LOGOUT</button>
  </div>
  <div class="sub-header-wrapper-dashboard">
    <p>Account: <span>{{ user.providerData[0].email }}</span></p>
  </div>
  <div class="content-dashboard">
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

<style>
.header-wrapper-dashboard {
  display: flex;
  width: 100vw;
  height: 150px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.sub-header-wrapper-dashboard {
  display: flex;
  width: 100vw;
  height: 50px;
  transform: translateY(-40px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.header-wrapper-dashboard > h1 {
  font-size: 50px;
}

.sub-header-wrapper-dashboard > p {
  font-size: 14px !important;
  font-weight: 700;
  opacity: 0.6;
}

.sub-header-wrapper-dashboard > p > span {
  color: #007f51;
}

.header-wrapper-dashboard > button {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  background-color: #007f51;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.content-dashboard {
  padding-top: 50px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-dashboard > button {
  width: 300px;
  color: white;
  background-color: black;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.content-dashboard > button:not(:last-child) {
  margin-bottom: 20px;
}
</style>