<script lang="ts" setup>
import { HomeFilled } from '@element-plus/icons-vue'
import { route } from ':/routers'
</script>

<template>
  <div class="fab">
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
  </div>
</template>

<style lang="scss" scoped>
.fab {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 10;
}
</style>