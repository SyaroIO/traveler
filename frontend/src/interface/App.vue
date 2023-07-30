<script lang="ts" setup>
import Header from ':/layouts/HeaderComponent.vue'
import Footer from ':/layouts/FooterComponent.vue'
import { ElLoading } from 'element-plus';
import { useDialogStore } from ':/dialogs'

const dialog = useDialogStore()
let loading: any = null;

const dialogPending = () => {
  loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
const dialogResolve = () => {
  loading?.close()
  loading = null
}
</script>

<template>
  <el-container>
    <el-header><Header /></el-header>
    <el-aside />
    <el-main><router-view /></el-main>
    <el-footer><Footer /></el-footer>
  </el-container>

  <template v-if="dialog.visible && dialog.component">
    <el-dialog v-model="dialog.visible" :title="dialog.title">
      <Suspense @pending="dialogPending" @resolve="dialogResolve">
        <component :is="dialog.component"></component>
      </Suspense>
    </el-dialog>
  </template>
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