<script lang="ts" setup>
import { ref } from 'vue'
import { show } from '@/router'
import { ElMessage } from 'element-plus'

const activeIndex = ref('index')
const handleSelect = (key: string, keyPath: string[]) => {
  console.debug(key, keyPath);
  switch (key) {
    case 'index':
    case 'single':
    case 'authenticate':
    case 'register': show(key); break;
    default: ElMessage.warning('功能开发中'); break;
  }
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="index">
      首页
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        足迹
      </template>
      <el-menu-item index="single">
        个人
      </el-menu-item>
      <el-menu-item index="2-2">
        群体
      </el-menu-item>
      <el-menu-item index="2-3">
        踩一下
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="register">
      注册
    </el-menu-item>
    <el-menu-item index="authenticate">
      登录
    </el-menu-item>
  </el-menu>
</template>