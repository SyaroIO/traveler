<script lang="ts" setup>
import { ref } from 'vue'
import * as mark from '@/api/mark'
import { size, info } from '@/utils/geo'
import { Check, Share, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MapComponent from ':/components/MapComponent.vue'

const values = ref<number[]>(new Array(size).fill(0))
const share = ref({
  display: false,
  link: '',
  share: false
})
const last = new Array(size).fill(0)
mark.get().then(({ success, data }) => {
  if (!success) return;
  share.value.share = data.share
  share.value.link = `${location.origin}/footprint/share/${data.id}`
  for (const [index, value] of data.marks)
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
  const { success, message } = await mark.set(Array.from(changed.value.entries()))
  if (success) ElMessage.success('保存成功')
  else ElMessage.error('保存失败: ' + message)
}
const openShare = async () => {
  const { success } = await mark.share()
  if (!success) return ElMessage.error('开启失败')
  share.value.share = true
  return ElMessage.success('开启成功')
}
const closeShare = async () => {
  const { success } = await mark.unshare()
  if (!success) return ElMessage.error('关闭失败')
  share.value.share = false
  return ElMessage.success('关闭成功')
}
</script>

<template>
  <teleport to="#fabtl">
    <el-row>
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
    </el-row>
    <el-row>
      <el-tooltip
        content="分享"
        placement="right"
      >
        <el-button
          circle
          type="primary"
          size="large"
          :icon="Share"
          @click="share.display = true"
        />
      </el-tooltip>
    </el-row>
  </teleport>
  <MapComponent
    :max="5"
    :values="values"
    @district-click="click"
  />
  <el-dialog
    v-model="share.display"
    title="分享"
    width="400"
  >
    <el-row
      v-if="share.share"
      justify="center"
      align="middle"
    >
      <el-col class="btn-col">
        <el-row
          justify="center"
          align="middle"
        >
          <el-tooltip
            content="取消分享"
            placement="right"
          >
            <el-button
              circle
              type="danger"
              size="large"
              :icon="Close"
              @click="closeShare"
            />
          </el-tooltip>
        </el-row>
      </el-col>
      <el-col>
        <el-row
          justify="center"
          align="middle"
        >
          <el-text>
            你的足迹分享链接是:
          </el-text>
        </el-row>
        <el-row
          justify="center"
          align="middle"
        >
          <el-link :href="share.link">
            {{ share.link }}
          </el-link>
        </el-row>
      </el-col>
    </el-row>
    <el-row
      v-else
      justify="center"
      align="middle"
    >
      <el-col class="btn-col">
        <el-row
          justify="center"
          align="middle"
        >
          <el-tooltip
            content="分享"
            placement="right"
          >
            <el-button
              circle
              type="success"
              size="large"
              :icon="Check"
              @click="openShare"
            />
          </el-tooltip>
        </el-row>
      </el-col>
      <el-col>
        <el-row
          justify="center"
          align="middle"
        >
          <el-text>
            你还没有开启分享足迹
          </el-text>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
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
          v-for="{ text, value } of radios"
          :key="value"
          class="radio"
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
.radio {
  margin-bottom: 8px;
}

.btn-col {
  margin-bottom: 30px;
}
</style>
