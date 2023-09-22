<script lang="ts" setup>
import FloatingActionButtons from './components/FloatingActionButtons.vue'
</script>

<template>
  <el-container style="min-height: 100vh;">
    <el-main>
      <router-view />
      <FloatingActionButtons />
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
  width: auto;
}
</style>