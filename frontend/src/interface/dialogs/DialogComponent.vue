<script lang="ts" setup>
import { ElLoading } from 'element-plus';
import { useDialogStore } from ':/dialogs'

const dialog = useDialogStore()
let loading = ElLoading.service({ visible: false });
loading.close();

const dialogPending = () => {
    loading = ElLoading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
const dialogResolve = () => {
    loading.close()
}
</script>

<template>
  <template v-if="dialog.visible && dialog.component">
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      style="min-width:300px; max-width: 600px;"
      width="auto"
    >
      <Suspense
        @pending="dialogPending"
        @resolve="dialogResolve"
      >
        <component :is="dialog.component" />
        <template #fallback>
          <el-skeleton
            :rows="10"
            animated
          />
        </template>
      </Suspense>
    </el-dialog>
  </template>
</template>