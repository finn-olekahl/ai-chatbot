<template>
  <div class="header-wrapper-dashboard">
    <h1>Admin Dashboard</h1>
    <button class="signout-btn" @click="handleLogout">LOGOUT</button>
  </div>
  <div class="sub-header-wrapper-dashboard">
    <p>Account: <span>{{ user.providerData[0].email }}</span></p>
  </div>
  <div class="content-dashboard">
    <button @click="$router.push('/admin/dashboard/guidelines')">GUIDELINES</button>
    <button @click="$router.push('/admin/dashboard/settings')">SETTINGS</button>
    <button @click="$router.push('/admin/dashboard/support')">SUPPORT PANEL</button>
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

.header-wrapper-dashboard > a {
  color: black;
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

.header-wrapper-dashboard > .signout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  background-color: #007f51;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

.header-wrapper-dashboard > h1 {
  position: relative;
}

.header-wrapper-dashboard > h1 > .goback-btn {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -50px;
  margin-top: auto;
  margin-bottom: auto;
  height: 30px;
  width: 30px;
  border-radius: 999px;
  border: none;
  background-color: rgb(175, 133, 255);
  transition: all 0.15s ease;
}

.header-wrapper-dashboard > h1 > .goback-btn:hover {
  transform: scale(1.1);
}

.header-wrapper-dashboard > h1 > .goback-btn:active:hover {
  transform: scale(1.0);
}

.header-wrapper-dashboard > h1 > .goback-btn > i {
  color: white
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