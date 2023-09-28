<script lang="ts" setup>
import { ref } from 'vue'
import { get, set } from '@/api/mark'
import { size, info } from '@/utils/geo'
import { Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MapComponent from ':/components/MapComponent.vue'

const values = ref<number[]>(new Array(size).fill(0))
const last = new Array(size).fill(0)
get().then(({ success, data }) => {
  if (!success) return;
  for (const [index, value] of data)
    last[index] = values.value[index] = value
})

const dialog = ref<{
  display: boolean,
  province: string,
  district: string,
  value: number
  index: number,
}>({ display: false, province: '', district: '', index: -1, value: 0 })
const click = (index: number) => {
  const districtData = info(index)
  if (!districtData) return;
  dialog.value.index = index
  dialog.value.province = districtData.province
  dialog.value.district = districtData.name
  dialog.value.value = values.value[index]
  dialog.value.display = true
}
const radios = [
  { value: 0, text: '清除' },
  { value: 1, text: '想去' },
  { value: 2, text: '路过' },
  { value: 3, text: '去过' },
  { value: 4, text: '住过' },
  { value: 5, text: '家乡' }
];
const changed = ref(new Map<number, number>());
const change = (value: string | number | boolean) => {
  value = Number(value);
  const index = dialog.value.index
  values.value[index] = value
  if (last[index] == value)
    changed.value.delete(index)
  else
    changed.value.set(index, value)
}
const save = async () => {
  if (changed.value.size === 0)
    return ElMessage('没有任何修改')
  const { success, message } = await set(Array.from(changed.value.entries()))
  if (success) ElMessage.success('保存成功')
  else ElMessage.error('保存失败: ' + message)
}
</script>

<template>
  <MapComponent
    :max="5"
    :values="values"
    @district-click="click"
  />
  <div class="toolbar">
    <el-tooltip
      content="保存"
      placement="right"
    >
      <el-button
        circle
        type="primary"
        size="large"
        :icon="Check"
        @click="save"
      />
    </el-tooltip>
  </div>
  <el-dialog
    v-model="dialog.display"
    :title="`${dialog.province}${dialog.district}`"
    width="300"
  >
    <el-radio-group
      v-model="dialog.value"
      @change="change"
    >
      <el-row
        justify="center"
        align="middle"
      >
        <el-col
          class=""
          v-for="{ text, value } of radios"
          :key="value"
          :span="8"
        >
          <el-row
            justify="center"
            align="middle"
          >
            <el-radio
              :label="value"
              border
            >
              {{ text }}
            </el-radio>
          </el-row>
        </el-col>
      </el-row>
    </el-radio-group>
  </el-dialog>
</template>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  top: 60px;
  left: 10px;
}

.el-col {
  margin-bottom: 8px;
}
</style>
