<script lang="ts" setup>
import { HomeFilled } from '@element-plus/icons-vue'
import { route } from ':/routers'
</script>

<template>
  <teleport to="#fabtl">
    <el-row>
      <el-tooltip
        content="主页"
        placement="right"
      >
        <el-button
          circle
          size="large"
          type="success"
          :icon="HomeFilled"
          @click="() => route('index')"
        />
      </el-tooltip>
    </el-row>
  </teleport>
</template>