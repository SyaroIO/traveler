<script lang="ts" setup>
import FloatingActionButtons from './components/FloatingActionButtons.vue'
</script>

<template>
  <el-container style="min-height: 100vh;">
    <el-main>
      <FloatingActionButtons />
      <router-view />
    </el-main>
  </el-container>
</template>