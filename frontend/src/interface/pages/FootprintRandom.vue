<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MapComponent from ':/components/MapComponent.vue'
import { get, set } from '@/api/random'
import { indexs } from '@/utils/geo'
import { View } from '@element-plus/icons-vue'
const values = ref<number[]>(new Array(indexs.length).fill(0))
const max = ref(0)
const mine = ref({ m: false, v: 0 })

onMounted(async () => {
  const { success, data } = await get();
  if (!success) return
  console.log(data);

  for (const { me, records } of data) {
    if (me)
      mine.value = { m: true, v: Number(Object.keys(records)[0]) }
    for (const index in records)
      values.value[Number(index)] += records[index];
  }
  max.value = Math.max(...values.value);
})
onUnmounted(() => close?.());
</script>

<template>
  <MapComponent
    :values="values"
    :max="max"
  />
  <div class="toolbar">
    <el-tooltip
      content="踩一下"
      placement="right"
    >
      <el-button
        circle
        type="primary"
        size="large"
        :icon="View"
        @click="set"
      />
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  top: 60px;
  left: 10px;
}
</style>