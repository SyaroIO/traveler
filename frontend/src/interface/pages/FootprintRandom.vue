<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { get, set } from '@/api/random'
import { size, info } from '@/utils/geo'
import { Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MapComponent from ':/components/MapComponent.vue'
const values = ref<number[]>(new Array(size).fill(0))
const max = ref(0)
const mine = ref({ m: false, v: 0 })
const tooltip = (index: number) => `<strong>${info(index)?.fullname}<br /><span style="color:#88F;">${values.value[index]}</span></strong> 人踩过`

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

const random = async () => {
  if (mine.value.m) {
    ElMessage.success(`您已经踩了 [${info(mine.value.v)?.fullname}]`);
    return;
  }
  const { success, code, message, data } = await set();
  if (!success) {
    ElMessage.error(`踩一踩失败 [${code}] ${message}`);
    return;
  }
  values.value[data] += 1;
  mine.value = { m: true, v: data }
  ElMessage.success(`踩一踩成功，踩了 [${info(data)?.fullname}]`);
}
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
          :type="mine.m ? 'success' : 'primary'"
          size="large"
          :icon="Location"
          @click="random"
        />
      </el-tooltip>
    </el-row>
  </teleport>
  <MapComponent
    :values="values"
    :max="max"
    :tooltip="tooltip"
  />
</template>