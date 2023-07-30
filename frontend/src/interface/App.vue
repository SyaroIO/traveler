<script lang="ts" setup>
import Header from './layouts/HeaderComponent.vue'
import Footer from './layouts/FooterComponent.vue'
</script>

<template>
  <el-container>
    <el-header><Header /></el-header>
    <el-aside />
    <el-main><router-view /></el-main>
    <el-footer><Footer /></el-footer>
  </el-container>
</template>

<style lang="scss" scoped>
.el-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-main {
  // height: 100%;
  padding: 0;
  overflow: scroll;
}

.el-footer {
  display: flex;
  height: 4vh;
  padding: 0;
  width: 100%;
  align-items: center;
}
</style>