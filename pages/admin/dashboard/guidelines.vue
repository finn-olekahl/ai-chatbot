<template>
    <div class="header-wrapper-dashboard">
        <h1><button class="goback-btn" @click="$router.push('/admin/dashboard')"><i class="fas fa-arrow-left"></i></button>Guidelines</h1>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth'
})
</script>

<style>

</style>