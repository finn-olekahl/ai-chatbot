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

<template>
  <h1>Welcome to your dashboard</h1>
  <h3>User:</h3>
  <pre>{{ JSON.stringify(user, null, 2) }}</pre>
  <button @click="handleLogout">Signout</button>
</template>