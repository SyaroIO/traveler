<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { get, set } from '@/api/random'
import { size } from '@/utils/geo'
import { Location } from '@element-plus/icons-vue'
import MapComponent from ':/components/MapComponent.vue'
const values = ref<number[]>(new Array(size).fill(0))
const max = ref(0)
const mine = ref({ m: false, v: 0 })

onMounted(async () => {
  const { success, data } = await get();
  if (!success) return

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
  <teleport to="#fabtl">
    <el-row>
      <el-tooltip
        content="踩一下"
        placement="right"
      >
        <el-button
          circle
          type="primary"
          size="large"
          :icon="Location"
          @click="set"
        />
      </el-tooltip>
    </el-row>
  </teleport>
  <MapComponent
    :values="values"
    :max="max"
  />
</template>