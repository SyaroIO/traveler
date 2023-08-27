<script lang="ts" setup>
import { ref } from 'vue'
import { route } from ':/routers'
import { ElMessage } from 'element-plus'
import { Dialogs, useDialogStore } from ':/dialogs';

const dialog = useDialogStore()
const activeIndex = ref('index')
const handleSelect = (key: string) => {
  switch (key) {
    case 'index':
    case 'map': route(key); break;
    case 'authenticate': dialog.show(Dialogs.AuthenticateDialog); break;
    case 'register': dialog.show(Dialogs.RegisterDialog); break;
    case 'test': dialog.show(Dialogs.Test); break;
    default: ElMessage.warning('功能开发中'); break;
  }
}
</script>

<template>
  <el-menu
    :default-active="activeIndex"
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
      <el-menu-item index="map">
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
    <el-menu-item index="test">
      测试
    </el-menu-item>
  </el-menu>
</template>